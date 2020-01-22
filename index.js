#!/usr/bin/env node

const childProcess = require("child_process");
const path = require("path");

const packageMain = process.env.npm_package_main;
const main = packageMain != null ? packageMain : ".";

const npmBin = childProcess
  .execSync("npm bin")
  .toString()
  .trim();

const checkCommands = [
  `eslint ${main}`,
  'stylelint --allow-empty-input "**/*.css"',
  `tsc --allowJs --resolveJsonModule --lib dom --checkJs --noEmit --skipLibCheck ${main}`,
  "dependency-check -i common-good ./package.json",
  "cspell --no-summary '**/*.{js,md}'",
  "prettier --check '**'"
];

const fixCommands = [
  `eslint --fix ${main}`,
  'stylelint --fix --allow-empty-input "**/*.css"',
  "prettier --write '**'"
];

const run = command => {
  console.log(`=> ${command}`);
  const moduleName = command.split(" ")[0];
  const restOfCommand = command
    .split(" ")
    .slice(1)
    .join(" ");

  const suffixIndex = process.argv.findIndex(
    arg => arg === `--${moduleName}-suffix`
  );

  const suffix = suffixIndex !== -1 ? process.argv[suffixIndex + 1] : "";
  const bin = path.join(npmBin, moduleName);
  const finalCommand = [bin, restOfCommand, suffix];
  console.log(childProcess.execSync(finalCommand).toString());
};

console.log(process.argv)

const subCommand = process.argv[2];

if (subCommand == null || subCommand === "check") {
  checkCommands.forEach(command => {
    try {
      run(command);
    } catch (e) {
      if (e.stdout) {
        console.log(e.stdout.toString());
        console.log(e.stderr.toString());
        process.exit(1);
      } else {
        throw e;
      }
    }
  });
} else if (subCommand === "fix") {
  fixCommands.forEach(command => {
    try {
      run(command);
    } catch (e) {
      console.log(e.stdout.toString());
      console.log(e.stderr.toString());
    }
  });
}
