export function baseLayout(opts: {
  preheader?: string;
  title: string;
  contentHtml: string;
  footerHtml?: string;
}) {
  const preheader = opts.preheader ?? "";
  const footer = opts.footerHtml ?? "Amigo Gigante · Notificaciones automáticas";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(opts.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f7fb;">
    <!-- Preheader (texto que se ve en el snippet del inbox) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(preheader)}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px;max-width:600px;">
            <!-- Header -->
            <tr>
              <td style="padding:12px 8px 16px 8px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;">
                  <b style="color:#111827;">Amigo Gigante</b>
                </div>
              </td>
            </tr>

            <!-- Card -->
            <tr>
              <td style="background:#ffffff;border-radius:14px;padding:24px;border:1px solid #e5e7eb;">
                <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;">
                  <div style="font-size:20px;line-height:28px;font-weight:700;margin:0 0 8px 0;">
                    ${escapeHtml(opts.title)}
                  </div>

                  <div style="font-size:14px;line-height:22px;color:#374151;">
                    ${opts.contentHtml}
                  </div>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:14px 8px 0 8px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#6b7280;">
                  ${escapeHtml(footer)}
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(v: string) {
  return v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
