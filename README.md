# Runic

RunicJS is a vanilla JS state management library. It's primary design goal is
to be simple, lightweight, and fast.

> **Warning**
> RunicJS is in its infancy. It's not safe to use in production at this time.

## Roadmap

- [x] Turn this into a monorepo with separate packages.
- [x] Fix all of the issues with dependencies and NPM exports
- [x] Start using a `develop` branch
- [ ] Get to a place where I'm happy with the API
- [ ] Create a documentation site (https://docusaurus.io/)

## Development

**Setup**

```bash
$ npm i
```

**Run all tests**

```bash
$ npm run test
```

**Run example: Basic Counter**

```bash
$ npm run example:basic-counter:dev
# open http://localhost:5173/
```

**Publish all packages**

```bash
$ npm run ci:publish
```

**Build package: Runic**

```bash
$ npm run runic:build
```

**Build package: Runic React**

```bash
$ npm run runic-react:build
```
