# DSE Toolbox

A set of tools (parsers, converters, diff tools, references) I regularly use at work, combined into a single app.

## Development

After cloning the repo, make a copy of `forge.config.js.example`:

```sh
cp forge.config.js.example forge.config.js
```

You can either update the variables in the osxNotarize object, or make the whole `packagerConfig` object a blank, like so:

```
packagerConfig: {}
```

Install dependencies with:

```sh
npm install
```

### Running the app

```sh
npm start
```

### Packaging for distribution

```sh
npm run make
```