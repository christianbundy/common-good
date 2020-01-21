#!/usr/bin/env node

const childProcess = require("child_process");

const packageMain = process.env.npm_package_main;
const main = packageMain != null ? packageMain : ".";

const checkCommands = [
  "prettier --check '**'",
  "dependency-check -i common-good ./package.json",
  "cspell --no-summary '**/*.{js,md}'",
  'stylelint --allow-empty-input "**/*.css"',
  `tsc --allowJs --resolveJsonModule --lib dom --checkJs --noEmit --skipLibCheck ${main}`,
  `eslint ${main}`
];

const fixCommands = [
  "prettier --write '**'",
  'stylelint --fix --allow-empty-input "**/*.css"',
  `eslint --fix ${main}`
];

const run = command => {
  console.log(`=> ${command}`);
  const commandName = command.split(" ")[0].replace(/-/g, "_");
  const envSuffix = process.env[`${commandName}_suffix`];
  const suffix = envSuffix != null ? envSuffix : "";
  const finalCommand = [command, suffix].join(" ");
  console.log(childProcess.execSync(finalCommand).toString());
};

const subCommand = process.argv[2];

if (subCommand == null || subCommand === "check") {
  checkCommands.forEach(command => {
    try {
      run(command);
    } catch (e) {
      console.log(e.stdout.toString());
      console.log(e.stderr.toString());
      process.exit(1);
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
