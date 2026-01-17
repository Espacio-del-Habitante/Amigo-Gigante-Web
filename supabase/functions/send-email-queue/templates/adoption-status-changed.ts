import { baseLayout } from "./base-layout.ts";
import { pill, primaryButton } from "./ui.ts";

export function adoptionStatusChanged(payload: any) {
  const requestId = String(payload?.request_id ?? "—");
  const oldS = String(payload?.old_status ?? "—");
  const newS = String(payload?.new_status ?? "—");

  const viewUrl = payload?.view_url
    ? String(payload.view_url)
    : `https://tuapp.com/requests/${encodeURIComponent(requestId)}`;

  const content = `
    <p style="margin:0 0 10px 0;">Tu solicitud cambió de estado:</p>
    ${pill("Antes", oldS)}
    ${pill("Ahora", newS)}
    ${pill("ID", requestId)}
    ${primaryButton("Ver detalles", viewUrl)}
  `;

  return baseLayout({
    preheader: `Tu solicitud cambió a: ${newS}`,
    title: "Actualización de tu solicitud 🐶",
    contentHtml: content,
  });
}
