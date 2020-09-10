#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crossSpawn = require("cross-spawn");

const npmBin = crossSpawn
  .sync("npm", ["bin"], { cwd: process.cwd() })
  .stdout.toString()
  .trim();

// Fix package.json
crossSpawn.sync("npm", ["init", "-y"]);

const packageString = fs.readFileSync(
  path.join(process.cwd(), "package.json"),
  "utf8"
);
const { main } = JSON.parse(packageString);

if (main === "") {
  throw new Error(
    'Package.json is missing the "main" property. Please add one.'
  );
}

const eslintConfig = require.resolve("./.eslintrc");

const testCommands = [
  `eslint -c ${eslintConfig} **/*.{js,md,ts}`,
  "stylelint --allow-empty-input **/*.css",
  "prettier --check .",
  "depcheck",
];

const fixCommands = [
  "prettier --write .",
  "stylelint --fix --allow-empty-input **/*.css",
  `eslint -c ${eslintConfig} --fix **/*.{js,md,ts}`,
];

const run = (command) => {
  const moduleName = command.split(" ")[0];
  const restOfCommand = command.split(" ").slice(1);

  const suffixIndex = process.argv.findIndex(
    (arg) => arg === `--${moduleName}`
  );

  if (suffixIndex !== -1) {
    const suffixArgs = process.argv[suffixIndex + 1].split(" ");
    restOfCommand.push(...suffixArgs);
  }
  process.stdout.write(`=> ${moduleName} ${restOfCommand.join(" ")}\n`);
  const bin = path.join(npmBin, moduleName);
  const result = crossSpawn.sync(bin, restOfCommand, {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  return result.status;
};

const subCommand = process.argv[2];

const runAll = (commands) => {
  if (!commands.map(run).every((status) => status === 0)) {
    process.exit(1);
  }
};

if (subCommand === "test") {
  runAll(testCommands);
} else if (subCommand === "fix") {
  runAll(fixCommands);
} else if (subCommand === "both") {
  runAll(fixCommands);
  runAll(testCommands);
} else {
  console.log("Usage: common-good <test|fix|both>");
}
