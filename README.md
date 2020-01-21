# Common-Good

> All of the best practices without any of the boilerplate.

Software is a complex and difficult topic, but we can make it easier for
everyone if we use best practices that make our code predictable and accessible.
Most people want to _have_ a style guide and a handful of static analysis tools,
but it's not a fun problem to spend time on.

## Usage

Install with [npm](https://npmjs.org/):

```js
npm install --save-dev common-good
```

Add common-good to `package.json`:

```json
{
  "scripts": {
    "fix": "common-good fix",
    "test": "common-good check"
}
```

Resolve small problems with `npm run fix` and test code with `npm test`.

## Acknowledgements

Common-Good is just a thin wrapper around other great projects.

- CSpell
- Dependency-Check
- ESLint
- Prettier
- StyleLint
- TypeScript

## License

AGPL-3.0
