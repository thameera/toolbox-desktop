# DSE Toolbox

A set of tools (parsers, converters, diff tools, references) I regularly use at work, combined into a single app.

## Development

```
yarn
yarn start
```

## Building

```
yarn run dist
```

Binary will be available in the `./dist/mac/` directory.
Due to Apple notarization issues, the zip file in `./dist/` won't work. Create the release file by zipping the binary in `./dist/mac/`

## Download

You can download the latest binary at [Releases](https://github.com/thameera/toolbox/releases) page.
