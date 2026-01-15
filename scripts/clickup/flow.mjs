import { spawnSync } from "node:child_process";

const usage = `Uso:
  node scripts/clickup/flow.mjs --title "HU-XXX — Título" --body-file "HUs/HU-XXX.md"

Opcional:
  --assignee 123456
  --status "En curso"
`;

const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
};

const title = getArg("--title");
const bodyFile = getArg("--body-file");
const assignee = getArg("--assignee");
const status = getArg("--status");

if (!title || !bodyFile) {
  console.error(usage);
  process.exit(1);
}

const createArgs = [
  "scripts/clickup/create_hu.mjs",
  "--title",
  title,
  "--body-file",
  bodyFile,
];

if (assignee) {
  createArgs.push("--assignee", assignee);
}

if (status) {
  createArgs.push("--status", status);
}

const result = spawnSync("node", createArgs, { stdio: "inherit" });
process.exit(result.status ?? 1);

