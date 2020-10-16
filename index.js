#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crossSpawn = require("cross-spawn");

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

const eslintConfig = require.resolve("./config/eslint.js");
const stylelintConfig = require.resolve("./config/stylelint.json");

const testCommands = [
  `eslint -c ${eslintConfig} **/*.{js,jsx,md,ts,tsx}`,
  `stylelint --config ${stylelintConfig} --allow-empty-input **/*.css`,
  "prettier --check .",
  "depcheck",
];

const fixCommands = [
  "prettier --write .",
  `eslint -c ${eslintConfig} --fix **/*.{js,jsx,md,ts,tsx}`,
  `stylelint --config ${stylelintConfig} --fix --allow-empty-input **/*.css`,
  "depcheck",
];

const lintStagedFix = path.join(__dirname, "config", "lint-staged-fix.js");
const lintStagedTest = path.join(__dirname, "config", "lint-staged-test.js");

const testStagedCommands = [
  `lint-staged --config ${lintStagedTest}`,
  "depcheck",
];

const fixStagedCommands = [`lint-staged --config ${lintStagedFix}`, "depcheck"];

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
  const result = crossSpawn.sync("npx", [moduleName, ...restOfCommand], {
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
} else if (subCommand === "test-staged") {
  runAll(testStagedCommands);
} else if (subCommand === "fix-staged") {
  runAll(fixStagedCommands);
} else {
  console.log("Usage: common-good <test|fix>[-staged]");
  process.exit(1);
}
