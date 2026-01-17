export function pill(label: string, value: string) {
    return `
      <div style="margin:10px 0 0 0;">
        <span style="display:inline-block;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:6px 10px;font-size:12px;color:#111827;">
          <b>${escape(label)}:</b> ${escape(value)}
        </span>
      </div>
    `;
  }
  
  export function primaryButton(text: string, url: string) {
    return `
      <div style="margin-top:18px;">
        <a href="${escapeAttr(url)}"
           style="display:inline-block;text-decoration:none;background:#111827;color:#ffffff;padding:12px 16px;border-radius:10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;">
          ${escape(text)}
        </a>
      </div>
    `;
  }
  
  function escape(v: string) {
    return v
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  
  function escapeAttr(v: string) {
    return escape(v).replaceAll("\n", "").replaceAll("\r", "");
  }
  