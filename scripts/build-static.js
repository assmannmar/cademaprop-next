const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const apiDir = path.join(root, "app", "api");
const disabledApiDir = path.join(root, "app", "_api_disabled_for_static_export");
const staticDir = path.join(root, ".next-static");

function removeGeneratedDir(dir) {
  if (fs.existsSync(dir) && dir.startsWith(root)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function move(from, to) {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
  }
}

function patchStaticHtaccess() {
  const htaccessPath = path.join(staticDir, ".htaccess");
  if (!fs.existsSync(htaccessPath)) return;

  const current = fs.readFileSync(htaccessPath, "utf8");
  const cacheBlock = [
    "<IfModule mod_headers.c>",
    "  <FilesMatch \"\\.(html|txt|php)$\">",
    "    Header set Cache-Control \"no-cache, no-store, must-revalidate\"",
    "    Header set Pragma \"no-cache\"",
    "    Header set Expires \"0\"",
    "  </FilesMatch>",
    "  <FilesMatch \"\\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf)$\">",
    "    Header set Cache-Control \"public, max-age=31536000, immutable\"",
    "  </FilesMatch>",
    "</IfModule>",
  ].join("\n");
  const listRule = "RewriteRule ^propiedades/?$ /propiedades/index.html [L]";
  const seoBlock = [
    "RewriteCond %{REQUEST_FILENAME} !-f",
    "RewriteCond %{REQUEST_FILENAME} !-d",
    "RewriteRule ^propiedades/[0-9][^/]*(/)?$ /property-seo.php [L]",
  ].join("\n");
  const placeholderBlock = [
    "RewriteCond %{REQUEST_FILENAME} !-f",
    "RewriteCond %{REQUEST_FILENAME} !-d",
    "RewriteRule ^propiedades/.+/?$ /propiedades/placeholder/ [L]",
  ].join("\n");

  let updated = current
    .replace(
      /RewriteCond %\{REQUEST_FILENAME\} !-f\r?\nRewriteCond %\{REQUEST_FILENAME\} !-d\r?\nRewriteRule \^propiedades\/\[0-9\]\[\^\/\]\*\(\/\)\?\$ \/property-seo\.php \[L\]\r?\nRewriteRule \^propiedades\/\.\+\?\/\?\$ \/propiedades\/placeholder\/ \[L\]/g,
      `${seoBlock}\n${placeholderBlock}`
    )
    .replace(
      /RewriteCond %\{REQUEST_FILENAME\} !-f\r?\nRewriteCond %\{REQUEST_FILENAME\} !-d\r?\nRewriteRule \^propiedades\/\.\+\?\/\?\$ \/propiedades\/placeholder\/ \[L\]/g,
      placeholderBlock
    );

  if (!updated.includes(listRule)) {
    const legacyRedirectRule = "RewriteRule ^propiedad-([0-9]+)(-.*)?/?$ /propiedades/$1/ [R=301,L]";
    updated = updated.includes(legacyRedirectRule)
      ? updated.replace(legacyRedirectRule, `${legacyRedirectRule}\n${listRule}`)
      : `${updated.trimEnd()}\n${listRule}\n`;
  }

  if (!updated.includes(seoBlock)) {
    updated = updated.includes(placeholderBlock)
      ? updated.replace(placeholderBlock, `${seoBlock}\n${placeholderBlock}`)
      : `${updated.trimEnd()}\n${seoBlock}\n${placeholderBlock}\n`;
  }

  if (!updated.includes("Cache-Control \"no-cache, no-store, must-revalidate\"")) {
    updated = updated.replace(
      "RewriteEngine On",
      `RewriteEngine On\n\n${cacheBlock}`
    );
  }

  fs.writeFileSync(htaccessPath, updated);
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
  removeGeneratedDir(path.join(root, ".next", "dev"));
  removeGeneratedDir(staticDir);

  move(apiDir, disabledApiDir);

  const nextBin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "next.cmd" : "next");
  const result = spawnSync(nextBin, ["build"], {
    cwd: root,
    env: process.env,
    shell: true,
    stdio: "inherit",
  });

  status = result.status ?? 1;
  if (status === 0) {
    patchStaticHtaccess();
  }
} finally {
  move(disabledApiDir, apiDir);
}

process.exit(status);
