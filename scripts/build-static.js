const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const apiDir = path.join(root, "app", "api");
const disabledApiDir = path.join(root, "app", "_api_disabled_for_static_export");

function move(from, to) {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
  }
}

if (fs.existsSync(disabledApiDir)) {
  if (!fs.existsSync(apiDir)) {
    move(disabledApiDir, apiDir);
  } else {
    throw new Error(`Temporary API directory already exists: ${disabledApiDir}`);
  }
}

process.env.NEXT_PUBLIC_API_TARGET = "php";

let status = 1;

try {
  move(apiDir, disabledApiDir);

  const nextBin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "next.cmd" : "next");
  const result = spawnSync(nextBin, ["build"], {
    cwd: root,
    env: process.env,
    shell: true,
    stdio: "inherit",
  });

  status = result.status ?? 1;
} finally {
  move(disabledApiDir, apiDir);
}

process.exit(status);
