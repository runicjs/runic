# Runic

Runic is a vanilla JS state management library. It's primary goal is to be
simple, lightweight, and fast, and have a minimal API surface area that is
easy to understand and ergonomic to use.

> **Note**
> This project adheres to semantic versioning.

> **Warning**
> Runic is in its infancy. It's not safe to use in production at this time.

## Roadmap

- [x] Turn this into a monorepo with separate packages.
- [ ] Get to a place where I'm happy with the API
- [ ] Starting using a `develop` branch
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
