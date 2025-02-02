# Derived State

```ts
// These are readonly!
const rune = createDerivedRune([rune1, rune2], ([state1, state2]) => ({
  a: state1.a + state2.a,
  b: state1.b + state2.b,
  c: state1.c + state2.c,
}));
```

```ts
type DerivedRune = Omit<Rune, 'set'>;

const createDerivedRune = (runes, deriveState): DerivedRunicRune => {
  const getDerivedState = () => {
    return deriveState(runes.map((r) => r.get()));
  };

  let state = getDerivedState();

  // private
  const onChange = () => {
    state = getDerivedState();
    notify(state);
  };

  // ...
};
```
