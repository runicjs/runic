# Examples

## Creating a rune

```typescript
type CounterState = {
  count: number;
};

const counter = rune<CounterState>({
  count: 0;
});
```

## Getting the current state

```typescript
counter.get(); // { count: 0 }
```

## Replacing the state

```typescript
counter.set({ count: 1 }); // { count: 1 }
```

## Subscribing to state changes

```typescript
const unsubscribe = counter.subscribe((counterState) => {
  console.log(counterState); // { count: 2 } after call to set() below
});

counter.set({ count: 2 });

unsubscribe(); // unsubscribed
```

## Merging a partial state into the rune

```typescript
type Vector2 = {
  x: number;
  y: number;
};

const vector = rune<Vector2>({ x: 1, y: 2 });

patch(vector, { x: 3 }); // { x: 3, y: 2 }
```

## Resetting the state back to the initial state

```typescript
reset(counter); // { count: 0 }
```

## Updating state with Immer

```typescript
import { update } from '@runicjs/runic/integrations/immer';

const counter1 = rune<Counter>({ x: 0 });
const counter2 = rune<Counter>({ x: 0 });

update(counter1, (counterDraft) => {
  counterDraft.count++;
}); // { count: 1 }

update([counter1, counter2], ([counter1Draft, counter2Draft]) => {
  counter1Draft.count++;
  counter2Draft.count = counter1Draft.count * 2;
}); // { count: 2 }, { count: 4 }
```

## Updating state with Mutative

```typescript
import { update } from '@runicjs/runic/integrations/mutative';
// Same as Immer...
```

## Using a selector

```typescript
const Counter = () => {
  const count = useRune(counter, (counterState) => counterState.count);
  return <div>{count}</div>; // <div>0</div>
};
```

## Using multiple runes

```typescript
const vector1 = rune<Vector2>({ x: 1, y: 2 });
const vector2 = rune<Vector2>({ x: 3, y: 4 });

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
