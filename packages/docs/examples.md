# Examples

## Creating a rune

```ts
type CounterState = {
  count: number;
};

const counter = createRune<CounterState>({
  count: 0;
});
```

## Getting the current state

```ts
counter.get(); // { count: 0 }
```

## Replacing the state

```ts
counter.set({ count: 1 }); // { count: 1 }
```

## Subscribing to state changes

```ts
const unsubscribe = counter.subscribe((counterState) => {
  console.log(counterState); // { count: 2 } after call to set() below
});

counter.set({ count: 2 });

unsubscribe(); // unsubscribed
```

## Merging a partial state into the rune

```ts
type Vector2 = {
  x: number;
  y: number;
};

const vector = createRune<Vector2>({ x: 1, y: 2 });

patch(vector, { x: 3 }); // { x: 3, y: 2 }
```

## Resetting the state back to the initial state

```ts
reset(counter); // { count: 0 }
```

## Updating state with Immer

```ts
import { update } from '@runicjs/runic/integrations/immer';

const counter1 = createRune<Counter>({ x: 0 });
const counter2 = createRune<Counter>({ x: 0 });

update(counter1, (counterDraft) => {
  counterDraft.count++;
}); // { count: 1 }

update([counter1, counter2], ([counter1Draft, counter2Draft]) => {
  counter1Draft.count++;
  counter2Draft.count = counter1Draft.count * 2;
}); // { count: 2 }, { count: 4 }
```

## Updating state with Mutative

```ts
import { update } from '@runicjs/runic/integrations/mutative';
// Same as Immer...
```

## Using rune state in React with useRune

```tsx
const increment = () => {
  update(counter, (draft) => {
    counter.count++;
  });
};

const decrement = () => {
  update(counter, (draft) => {
    counter.count--;
  });
};

const Counter = () => {
  const count = useRune(counter, (state) => state.count);
  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

## Using multiple runes

```tsx
const vector1 = createRune<Vector2>({ x: 1, y: 2 });
const vector2 = createRune<Vector2>({ x: 3, y: 4 });

const VectorAddition = () => {
  const v3 = useRunes([vector1, vector2], ([v1, v2]) => ({
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  }));

  return (
    <div>
      ({v3.x}, {v3.y})
    </div>
  ); // <div>(4, 6)</div>
};
```
