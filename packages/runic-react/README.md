# Runic

Runic React provides tools for working with Runic in React.

> **Warning**
> RunicJS is in its infancy. It's not safe to use in production at this time.

## Roadmap

- [ ] Test custom equalityFns, like deepEqual.
- [ ] Test selector that relies on a value from another selector that just changed
- [ ] Test default selector (entire state)
- [ ] Test creating stores dynamically (e.g. in a Context) and destroying them
- [ ] Verify that there are no unnecessary rerenders (with tests)
- [ ] Implement a larger app with more complex state using runic. RealWorld perhaps?

## Usage

### `useRune`

```tsx
import { rune } from '@runicjs/runic';
import { useRune } from '@runicjs/runic-react';

type CounterState = {
  count: number;
};

export const counter = rune<CounterState>({
  count: 0,
});

export const increment = () => {
  updateState(counter, (counterDraft) => {
    counterDraft.count++;
  });
};

export const decrement = () => {
  updateState(counter, (counterDraft) => {
    counterDraft.count--;
  });
};

function Counter() {
  // Only re-renders when count changes
  const count = useRune(counter, (counter) => counter.count);

  // "Computed" value
  const doubled = useRune(counter, (counter) => counter.count * 2);

  return (
    <div>
      <div>
        {count} * 2 = {doubled}
      </div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

### `useRunes`

```ts
import { rune } from '@runicjs/runic';
import { useRunes } from '@runicjs/runic-react';
import deepEqual from 'fast-deep-equal';

type UserState = {
  id: number;
};

const user = rune<UserState>({
  id: 1,
});

type Todo = {
  userId: number;
  id: number;
  text: string;
  done: boolean;
};

type TodoListState = {
  todos: Array<Todo>;
};

const todoList = rune<TodoListState>({
  todos: [
    { userId: 1, id: 1, text: 'First task', done: false },
    { userId: 2, id: 2, text: 'Second task', done: true },
    { userId: 1, id: 3, text: 'Third task', done: false },
  ],
});

const UserTodos = () => {
  const userTodos = useRunes<Array<Todo>>(
    [user, todoList], // Listens for changes to any store that is passed in.
    ([userState, todoListState]) => {
      return todoListState.todos.filter((todo) => todo.userId === userState.id);
    },
  );
};
```
