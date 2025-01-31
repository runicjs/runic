# Changelog

## 0.1.8

- Fix: Migrated to NPM to resolve dependency issues.

## 0.1.7

- Fix: Added the mutative integration to the exports declaration it can be imported.
- Fix: Calling listeners in `createStore` as soon as they are registered, to prevent stale data in some cases.
- API: Added a new type: `Selector<State, Value>`
- Performance: Using objects as IDs in `createStore`, instead of wrapper functions, to find listeners for unsubscription.
- Performance: Using `forEach` instead of `for..of` in `createStore`.
- Docs: Added benchmarking results inline as justification for the above changes.
- Docs: Fixed some typos in some docs.
