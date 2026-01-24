import { baseLayout } from "./base-layout.ts";
import { pill } from "./ui.ts";

function fmtNum(n: number): string {
  return Number(n).toLocaleString("es-CO");
}

export function purchaseVoucher(payload: any) {
  const o = payload?.order ?? {};
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const f = payload?.foundation ?? {};
  const fName = String(f?.name ?? "Fundación");

  const details =
    pill("Referencia", `#${o?.id ?? "—"}`) +
    pill("Fecha", o?.createdAt ? new Date(o.createdAt).toLocaleDateString("es-CO") : "—") +
    pill("Comprador", o?.buyerName ?? "—") +
    pill("Email", o?.buyerEmail ?? "—") +
    (o?.buyerPhone ? pill("Teléfono", o.buyerPhone) : "") +
    pill("Fundación", fName);

  const rows = items
    .map(
      (i: any) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #e5e7eb;">${escapeHtml(String(i?.productName ?? ""))} × ${Number(i?.quantity ?? 0)}</td><td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">$${fmtNum(Number(i?.subtotal ?? 0))}</td></tr>`,
    )
    .join("");

  const subtotal = Number(o?.subtotal ?? 0);
  const shipping = Number(o?.shippingCost ?? 0);
  const total = Number(o?.total ?? 0);

  const content = `
    <p style="margin:0 0 12px 0;">Gracias por tu solicitud de compra. La tienda la recibió y completará el proceso contigo. Aquí tienes tu comprobante.</p>
    ${details}
    <div style="margin-top:20px;">
      <div style="font-weight:700;margin-bottom:8px;">Detalle de la solicitud</div>
      <table style="width:100%;font-size:14px;">
        ${rows}
      </table>
      <table style="width:100%;margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb;">
        <tr><td style="padding:4px 0;">Subtotal</td><td style="padding:4px 0;text-align:right;font-weight:700;">$${fmtNum(subtotal)}</td></tr>
        ${shipping > 0 ? `<tr><td style="padding:4px 0;">Envío</td><td style="padding:4px 0;text-align:right;font-weight:700;">$${fmtNum(shipping)}</td></tr>` : ""}
        <tr><td style="padding:8px 0 0 0;font-size:16px;">Total</td><td style="padding:8px 0 0 0;text-align:right;font-weight:700;font-size:16px;">$${fmtNum(total)}</td></tr>
      </table>
    </div>
    <p style="margin:16px 0 0 0;font-size:12px;color:#6b7280;">
      Si no enviaste esta solicitud de compra, puedes ignorar este mensaje.
    </p>
  `;

  return baseLayout({
    preheader: "Comprobante de solicitud de compra",
    title: "✅ Comprobante de solicitud de compra",
    contentHtml: content,
  });
}

function escapeHtml(v: string) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
