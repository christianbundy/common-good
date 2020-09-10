# Common-Good

**Improve your code without configuration or controversy.** This is a JavaScript
module that bundles the most popular code formatting and static analysis tools
so that you don't have to install or configure them on your own. Each tool works
automatically without any configuration, which reduces the number of problems
your project needs to manage.

- **[Depcheck][1]** -- The dependencies you use should match `package.json`.
- **[ESLint][2]** -- Your JavaScript should avoid common problems.
- **[Prettier][3]** -- All of your code should be formatted predictably.
- **[StyleLint][4]** -- Your styles (CSS, SCSS, etc) should avoid common problems.

## Usage

Install with [npm](https://npmjs.org/):

```sh
npm install --save-dev common-good
```

Add common-good to `package.json`:

```json
{
  "scripts": {
    "fix": "common-good fix",
    "test": "common-good test"
  }
}
```

Resolve small problems with `npm run fix` and test code with `npm test`.

## License

AGPL-3.0

[1]: https://github.com/depcheck/depcheck
[2]: https://eslint.org/
[3]: https://prettier.io/
[4]: https://stylelint.io/
