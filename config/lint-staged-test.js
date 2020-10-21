const eslintConfig = require.resolve("./eslint.js");
const stylelintConfig = require.resolve("./stylelint.json");

module.exports = {
  "*.{js,jsx,md,ts,tsx}": `eslint -c ${eslintConfig}`,
  "*.css": `stylelint --config ${stylelintConfig} --allow-empty-input`,
  "*": "prettier --ignore-unknown --check",
};
