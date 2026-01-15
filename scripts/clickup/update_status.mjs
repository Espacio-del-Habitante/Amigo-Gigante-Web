const API_BASE = "https://api.clickup.com/api/v2";

if (!process.env.CLICKUP_API_TOKEN) {
  console.error("Falta variable de entorno: CLICKUP_API_TOKEN");
  process.exit(1);
}

const [taskId, statusArg] = process.argv.slice(2);
const status =
  statusArg ??
  (process.argv.includes("--done")
    ? process.env.CLICKUP_STATUS_DONE
    : process.argv.includes("--in-progress")
      ? process.env.CLICKUP_STATUS_IN_PROGRESS
      : undefined);

if (!taskId || !status) {
  console.error('Uso: node scripts/clickup/update_status.mjs <TASK_ID> "En curso"');
  console.error("O: node scripts/clickup/update_status.mjs <TASK_ID> --in-progress");
  console.error("O: node scripts/clickup/update_status.mjs <TASK_ID> --done");
  process.exit(1);
}

const response = await fetch(`${API_BASE}/task/${taskId}`, {
  method: "PUT",
  headers: {
    Authorization: process.env.CLICKUP_API_TOKEN,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ status }),
});

if (!response.ok) {
  const text = await response.text();
  console.error(`Error actualizando status: ${response.status} ${response.statusText}`);
  console.error(text);
  process.exit(1);
}

const data = await response.json();
console.log("Status actualizado:", {
  id: data.id,
  status: data.status?.status ?? data.status,
  url: data.url,
});

