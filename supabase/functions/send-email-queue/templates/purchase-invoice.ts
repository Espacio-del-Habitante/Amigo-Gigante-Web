import { baseLayout } from "./base-layout.ts";

function fmtNum(n: number): string {
  return Number(n).toLocaleString("es-CO");
}

function escapeHtml(v: string) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function purchaseInvoice(payload: any) {
  const o = payload?.order ?? {};
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const f = payload?.foundation ?? {};
  const fc = payload?.foundationContact ?? {};
  const fName = String(f?.name ?? fc?.foundationName ?? "Fundación");
  const ref = String(o?.id ?? "—");
  const dateStr = o?.createdAt ? new Date(o.createdAt).toLocaleDateString("es-CO") : "—";

  const rows = items
    .map(
      (i: any) =>
        `<tr>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(String(i?.productName ?? ""))}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;">${Number(i?.quantity ?? 0)}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;">$${fmtNum(Number(i?.productPrice ?? 0))}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;">$${fmtNum(Number(i?.subtotal ?? 0))}</td>
        </tr>`,
    )
    .join("");

  const subtotal = Number(o?.subtotal ?? 0);
  const shipping = Number(o?.shippingCost ?? 0);
  const total = Number(o?.total ?? 0);

  const content = `
    <div style="margin-bottom:24px;">
      <div style="font-size:12px;color:#6b7280;">Solicitud de compra — Referencia</div>
      <div style="font-size:18px;font-weight:700;">#${escapeHtml(ref)}</div>
      <div style="font-size:14px;margin-top:4px;">Fecha de emisión: ${escapeHtml(dateStr)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
      <tr>
        <th style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;text-align:left;">Producto</th>
        <th style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;text-align:center;">Cant.</th>
        <th style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;text-align:right;">P. unit.</th>
        <th style="padding:8px 12px;border:1px solid #e5e7eb;background:#f9fafb;text-align:right;">Subtotal</th>
      </tr>
      ${rows}
    </table>
    <table style="margin-left:auto;width:240px;font-size:14px;">
      <tr><td style="padding:6px 0;">Subtotal</td><td style="padding:6px 0;text-align:right;font-weight:700;">$${fmtNum(subtotal)}</td></tr>
      ${shipping > 0 ? `<tr><td style="padding:6px 0;">Envío</td><td style="padding:6px 0;text-align:right;font-weight:700;">$${fmtNum(shipping)}</td></tr>` : ""}
      <tr><td style="padding:10px 0 0 0;border-top:2px solid #111827;font-size:16px;">Total</td><td style="padding:10px 0 0 0;text-align:right;font-weight:700;font-size:16px;border-top:2px solid #111827;">$${fmtNum(total)}</td></tr>
    </table>
    <p style="margin-top:20px;font-size:13px;color:#6b7280;">
      <strong>Comprador:</strong> ${escapeHtml(String(o?.buyerName ?? ""))} — ${escapeHtml(String(o?.buyerEmail ?? ""))}
    </p>
    <p style="margin-top:8px;font-size:13px;color:#6b7280;">
      <strong>Fundación:</strong> ${escapeHtml(fName)}
    </p>
  `;

  return baseLayout({
    preheader: "Factura de tu solicitud de compra",
    title: "Factura / Solicitud de compra",
    contentHtml: content,
  });
}
