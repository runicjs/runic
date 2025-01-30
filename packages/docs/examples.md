# Examples

## Creating a store

```typescript
type CounterState = {
  count: number;
};

const store = createStore<CounterState>({ count: 0 });
```

## Getting the current state

```typescript
store.getState(); // { count: 0 }
```

## Replacing the state

```typescript
store.setState({ count: 1 }); // { count: 1 }
```

## Subscribing to state changes

```typescript
const unsubscribe = store.subscribe((state) => {
  console.log(state); // { count: 2 }
});

store.setState({ count: 2 });

unsubscribe(); // unsubscribed
```

## Merging a partial state into the store

```typescript
const vec1Store = createStore<Vector2>({ x: 1, y: 2 });

mergeState(vec1Store, { x: 3 }); // { x: 3, y: 2 }
```

## Resetting the state back to the initial state

```typescript
resetState(store); // { count: 0 }
```

## Updating the state with immer

```typescript
import { updateState } from '@runicjs/runic/integrations/immer';

updateState(store, (draft) => {
  draft.count++;
}); // { count: 1 }
```

## Updating multiple stores with immer

```typescript
import { updateState } from '@runicjs/runic/integrations/immer';

updateStates([store1, store2], ([state1, state2]) => {
  state1.count++;
  state2.count = state1.count * 2;
}); // { count: 1 }, { count: 2 }
```

## Updating the state with mutative

```typescript
import { updateState } from '@runicjs/runic/integrations/mutative';

updateState(store, (draft) => {
  draft.count++;
}); // { count: 1 }
```

## Updating multiple stores with mutative

```typescript
import { updateState } from '@runicjs/runic/integrations/mutative';

updateStates([store1, store2], ([state1, state2]) => {
  state1.count++;
  state2.count = state1.count * 2;
}); // { count: 1 }, { count: 2 }
```

## Using a selector

```typescript
const Counter = () => {
  const count = useStore(store, (state) => state.count);
  return <div>{count}</div>; // <div>0</div>
};
```

## Using multiple stores

```typescript
type Vector2 = { x: number; y: number };
const vec1Store = createStore<Vector2>({ x: 1, y: 2 });
const vec2Store = createStore<Vector2>({ x: 3, y: 4 });

const VectorAddition = () => {
  const vec3 = useStores([vec1Store, vec2Store], ([vec1, vec2]) => ({
    x: vec1.x + vec2.x,
    y: vec1.y + vec2.y,
  }));
  return (
    <div>
      ({vec3.x}, {vec3.y})
    </div>
  ); // <div>(4, 6)</div>
};
```
