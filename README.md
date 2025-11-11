# Vanilla JSX to ReScript JSX

A tool that transforms vanilla JSX syntax into ReScript JSX format, mapping attributes, props, and syntax differences to be compatible with ReScript's JSX implementation (specifically targeting `@rescript/runtime/lib/ocaml/JsxDOM.res`).

See [online tool](https://vanilla-jsx-to-rescript-jsx.web.app)!

## Contributing

Install dependencies

```shell
bun i
```

Run tests

```shell
bun run tests
```

Format code

```shell
bun run fmt
```

Launch tool

```shell
bun run tool
```

## Deploying tool

This thing is deployed to Firebase.

```shell
bun run tool:build
# firebase login
firebase deploy --only hosting
```

