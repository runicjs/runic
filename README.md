# Runic

Runic is a vanilla JS state management library. It's primary goal is to be
simple, lightweight, and fast, and have a minimal API surface area that is
easy to understand and ergonomic to use.

> **Warning**
> Runic is in its infancy. It's not safe to use in production at this time.

## Roadmap

- [x] Turn this into a monorepo with separate packages.
- [ ] Create a documentation site (https://docusaurus.io/)

## Development

**Setup**

```bash
$ pnpm i
```

**Run example: Basic Counter**

```bash
$ pnpm example:basic-counter:dev
# open http://localhost:5173/
```

**Publish all packages**

```bash
$ pnpm ci:publish
```

**Build package: Runic**

```bash
$ runic:build
```
**Build package: Runic React**

```bash
$ runic-react:build
```
