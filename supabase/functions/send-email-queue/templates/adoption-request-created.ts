import { baseLayout } from "./base-layout.ts";
import { pill, primaryButton } from "./ui.ts";

export function adoptionRequestCreated(payload: any) {
  const requestId = String(payload?.request_id ?? "—");
  const petName = payload?.animal_name ? String(payload.animal_name) : null;
  const foundationName = payload?.foundation_name ? String(payload.foundation_name) : null;

  // Si ya tienes URL de tu app, ponla aquí (deep link)
  const viewUrl = payload?.view_url
    ? String(payload.view_url)
    : `https://tuapp.com/requests/${encodeURIComponent(requestId)}`;

  const details =
    pill("ID de solicitud", requestId) +
    (petName ? pill("Mascota", petName) : "") +
    (foundationName ? pill("Fundación", foundationName) : "");

  const content = `
    <p style="margin:0 0 10px 0;">¡Gracias por tu interés en adoptar! Recibimos tu solicitud y ya está en revisión.</p>
    ${details}
    ${primaryButton("Ver solicitud", viewUrl)}
    <p style="margin:16px 0 0 0;font-size:12px;color:#6b7280;">
      Si no solicitaste esto, puedes ignorar este mensaje.
    </p>
  `;

  return baseLayout({
    preheader: "Tu solicitud de adopción fue creada y está en revisión.",
    title: "Solicitud de adopción recibida 🐾",
    contentHtml: content,
  });
}
