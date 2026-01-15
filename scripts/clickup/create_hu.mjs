import fs from "node:fs/promises";

const API_BASE = "https://api.clickup.com/api/v2";

const requiredEnv = ["CLICKUP_API_TOKEN", "CLICKUP_LIST_ID"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Falta variable de entorno: ${key}`);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
};

const title = getArg("--title");
const description = getArg("--description");
const bodyFile = getArg("--body-file");
const status = getArg("--status") ?? process.env.CLICKUP_STATUS_IN_PROGRESS;
const assignee = getArg("--assignee") ?? process.env.CLICKUP_ASSIGNEE_ID;

if (!title) {
  console.error('Uso: node scripts/clickup/create_hu.mjs --title "HU-XXX — Título" [--description "texto"] [--body-file "HUs/HU-XXX.md"] [--status "En curso"] [--assignee 123]');
  process.exit(1);
}

let finalDescription = description ?? "";
if (bodyFile) {
  finalDescription = await fs.readFile(bodyFile, "utf8");
}

const payload = {
  name: title,
  description: finalDescription,
};

if (status) payload.status = status;
if (assignee) payload.assignees = [Number(assignee)];

const response = await fetch(
  `${API_BASE}/list/${process.env.CLICKUP_LIST_ID}/task`,
  {
    method: "POST",
    headers: {
      Authorization: process.env.CLICKUP_API_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

if (!response.ok) {
  const text = await response.text();
  console.error(`Error creando tarea: ${response.status} ${response.statusText}`);
  console.error(text);
  process.exit(1);
}

const data = await response.json();
console.log("Tarea creada:", {
  id: data.id,
  name: data.name,
  url: data.url,
  status: data.status?.status ?? data.status,
});

