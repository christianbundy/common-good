const eslintConfig = require.resolve("./eslint.js");
const stylelintConfig = require.resolve("./stylelint.json");

module.exports = {
  "*": "prettier --ignore-unknown --write",
  "*.css": `stylelint --config ${stylelintConfig} --fix --allow-empty-input`,
  "*.{js,jsx,md,ts,tsx}": `eslint -c ${eslintConfig} --fix`,
};
