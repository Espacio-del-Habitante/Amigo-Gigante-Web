import { baseLayout } from "./base-layout.ts";
import { pill, primaryButton } from "./ui.ts";

export function adoptionInfoRequested(payload: any) {
  const requestId = String(payload?.request_id ?? "—");
  const animalName = payload?.animal_name ? String(payload.animal_name) : "la mascota";
  const foundationName = payload?.foundation_name ? String(payload.foundation_name) : null;
  const subject = payload?.subject ? String(payload.subject) : "Información adicional requerida";
  const message = payload?.message ? String(payload.message) : "";

  const viewUrl = payload?.view_url
    ? String(payload.view_url)
    : `https://tuapp.com/requests/${encodeURIComponent(requestId)}`;

  const details =
    pill("ID de solicitud", requestId) +
    pill("Mascota", animalName) +
    (foundationName ? pill("Fundación", foundationName) : "");

  const content = `
    <p style="margin:0 0 16px 0;">Hola,</p>
    <p style="margin:0 0 16px 0;">${message.replace(/\n/g, "<br>")}</p>
    <div style="margin:20px 0;">
      ${details}
    </div>
    ${primaryButton("Ver mi solicitud", viewUrl)}
    <p style="margin:16px 0 0 0;font-size:12px;color:#6b7280;">
      Por favor, responde a este correo o actualiza tu solicitud con la información solicitada.
    </p>
  `;

  return baseLayout({
    preheader: subject,
    title: subject,
    contentHtml: content,
  });
}
