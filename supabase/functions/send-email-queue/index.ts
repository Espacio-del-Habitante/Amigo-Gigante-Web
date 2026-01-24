import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { baseLayout } from "./templates/base-layout.ts";
import { adoptionRequestCreated } from "./templates/adoption-request-created.ts";
import { adoptionStatusChanged } from "./templates/adoption-status-changed.ts";
import { adoptionInfoRequested } from "./templates/adoption-info-requested.ts";
import { purchaseVoucher } from "./templates/purchase-voucher.ts";
import { purchaseInvoice } from "./templates/purchase-invoice.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "onboarding@resend.dev"; // cámbialo
const CRON_SECRET = Deno.env.get("CRON_SECRET")!;
const BATCH_SIZE = 10;

function renderSubject(template: string, payload: any): string {
  const t = (template ?? "").trim();
  switch (t) {
    case "adoption_request_created":
      return "Recibimos tu solicitud de adopción";
    case "adoption_status_changed":
      return "Actualización de tu solicitud de adopción";
    case "info_requested":
      return payload?.subject ?? "Información adicional requerida - Amigo Gigante";
    case "purchase_voucher":
      return "Comprobante de solicitud de compra";
    case "purchase_invoice":
      return "Factura de solicitud de compra";
    default:
      return "Notificación";
  }
}

function renderHtml(template: string, payload: any): string {
  const t = (template ?? "").trim();
  switch (t) {
    case "adoption_request_created":
      return adoptionRequestCreated(payload ?? {});
    case "adoption_status_changed":
      return adoptionStatusChanged(payload ?? {});
    case "info_requested":
      return adoptionInfoRequested(payload ?? {});
    case "purchase_voucher":
      return purchaseVoucher(payload ?? {});
    case "purchase_invoice":
      return purchaseInvoice(payload ?? {});
    default:
      return baseLayout({
        title: "Notificación",
        contentHtml: "<p>Tienes una nueva notificación.</p>",
      });
  }
}

async function resendSendEmail(to: string, subject: string, html: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to,
      subject,
      html,
    }),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(`Resend error (${r.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

serve(async (req) => {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Recomendado: solo service role o cron interno (Authorization).
  // Si quieres, aquí validas un header secreto.
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // 1) Traer pendientes
  const { data: rows, error: selErr } = await supabase
    .from("email_queue")
    .select("id,to_email,template,payload,attempts")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (selErr) {
    return new Response(JSON.stringify({ ok: false, error: selErr.message }), { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
  }

  // 2) Marcar como sending (evita dobles envíos si hay concurrencia)
  const ids = rows.map((r) => r.id);
  const { error: updErr } = await supabase
    .from("email_queue")
    .update({ status: "sending" })
    .in("id", ids);

  if (updErr) {
    return new Response(JSON.stringify({ ok: false, error: updErr.message }), { status: 500 });
  }

  // 3) Enviar uno por uno
  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const subject = renderSubject(row.template, row.payload);
      const html = renderHtml(row.template, row.payload);

      if (!html || typeof html !== "string" || html.length < 50) {
        throw new Error(`Template "${row.template}" produced invalid or empty HTML`);
      }

      await resendSendEmail(row.to_email, subject, html);

      await supabase
        .from("email_queue")
        .update({ status: "sent", sent_at: new Date().toISOString(), last_error: null })
        .eq("id", row.id);

      sent++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);

      await supabase
        .from("email_queue")
        .update({
          status: "failed",
          attempts: (row.attempts ?? 0) + 1,
          last_error: msg,
        })
        .eq("id", row.id);

      failed++;
    }
  }

  return new Response(JSON.stringify({ ok: true, processed: rows.length, sent, failed }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
