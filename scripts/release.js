#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const [, , action, profile, ...rest] = process.argv;
const customMessage = rest.join(" ").trim();

if (!["build", "ota"].includes(action) || !["preview", "production"].includes(profile)) {
  console.error("Usage: node scripts/release.js <build|ota> <preview|production> [message]");
  process.exit(1);
}

const root = process.cwd();
const versionsPath = path.join(root, "versions.json");
const versions = JSON.parse(fs.readFileSync(versionsPath, "utf8"));
const v = versions[profile];

const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: root });

if (action === "build") {
  v.major += 1;
  fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2) + "\n");
  console.log(`\n✓ ${profile}.major → ${v.major}.0.0\n`);
  run(`git add versions.json`);
  run(`git commit -m "chore: bump ${profile} to v${v.major}.0.0"`);
  run(`eas build --profile ${profile} --platform android --non-interactive`);
} else {
  v.ota += 1;
  fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2) + "\n");
  const message = customMessage || `OTA v${v.ota}.0.0`;
  console.log(`\n✓ ${profile}.ota → ${v.ota}.0.0 — "${message}"\n`);
  run(`git add versions.json`);
  run(`git commit -m "chore: bump ${profile} OTA to v${v.ota}.0.0"`);
  run(
    `APP_VARIANT=${profile} eas update --channel ${profile} --environment ${profile} --message "${message}" --non-interactive`,
  );
}
