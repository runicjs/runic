# Changelog

## 0.1.8

- Fix: Migrated to NPM to resolve dependency issues.

## 0.1.7

- Fix: Added a default `equalityFn` to `useStore` & `useStores`, which does a reference equality check on primitives, and uses [`shallow-equal`](https://github.com/moroshko/shallow-equal) on objects. This fixes a bug that was causing unnecessary rerenders.
- API: Made the selector in `useStore` optional. By default you get the entire state.
