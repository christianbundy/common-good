#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const npmBin = childProcess
  .spawnSync("npm", ["bin"], { cwd: process.cwd() })
  .stdout.toString()
  .trim();

// Fix package.json
childProcess
  .spawnSync("npm", ["init", "-y"])
  .stdout.toString()
  .trim();

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

const checkCommands = [
  `eslint -c ${eslintConfig} ${main}`,
  "stylelint --allow-empty-input **/*.css",
  `tsc --allowJs --resolveJsonModule --lib es2018,dom --checkJs --noEmit --skipLibCheck ${main}`,
  "dependency-check --missing -i common-good ./package.json",
  "cspell --no-summary **/*.{js,ts,md",
  "prettier --check **/*.{js,ts,jsx,json,css,scss,less,html,vue,gql,md,yaml}"
];

const fixCommands = [
  "prettier --write **/*.{js,ts,jsx,json,css,scss,less,html,vue,gql,md,yaml}",
  "stylelint --fix --allow-empty-input **/*.css",
  `eslint -c ${eslintConfig} --fix ${main}`
];

const run = command => {
  const moduleName = command.split(" ")[0];
  const restOfCommand = command.split(" ").slice(1);

  const suffixIndex = process.argv.findIndex(
    arg => arg === `--${moduleName}-suffix`
  );

  if (suffixIndex !== -1) {
    const suffixArgs = process.argv[suffixIndex + 1].split(" ");
    restOfCommand.push(...suffixArgs);
  }
  process.stdout.write(`=> ${moduleName} ${restOfCommand.join(" ")}\n`);
  const bin = path.join(npmBin, moduleName);
  const result = childProcess.spawnSync(bin, restOfCommand, {
    cwd: process.cwd()
  });
  if (result.stdout) {
    process.stdout.write(result.stdout.toString());
  }
  if (result.stderr) {
    process.stderr.write(result.stderr.toString());
  }
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(1);
  }
};

const subCommand = process.argv[2];

if (subCommand == null || subCommand === "check") {
  checkCommands.forEach(run);
} else if (subCommand === "fix") {
  fixCommands.forEach(run);
}
