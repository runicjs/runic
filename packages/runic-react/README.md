# Runic

Runic React provides tools for working with Runic in React.

> **Warning**
> Runic React is in its infancy. It's not safe to use in production at this time.

## Roadmap

- [x] Implement `useStore`
- [x] Publish a proper build to NPM (https://www.npmjs.com/package/@runicjs/runic-react)
- [x] Write tests
- [x] Implement `useStores`
- [ ] Test selector that relies on a value from another selector that just changed
- [ ] Test default selector (entire state)
- [ ] Test creating stores dynamically (e.g. in a Context) and destroying them
- [ ] Implement TodoMVC using runic-react
- [ ] Verify that there are no unnecessary rerenders
- [ ] Implement a larger app with more complex state using runic. RealWorld perhaps?

## Usage

### `useStore`

```tsx
import { createStore } from '@runicjs/runic';
import { useStore } from '@runicjs/runic-react';

type Counter = {
  count: number;
};

export const counterStore = createStore<Counter>({
  count: 0,
});

export const increment = () => {
  updateState(counterStore, (counter) => {
    counter.count++;
  });
};

export const decrement = () => {
  updateState(counterStore, (counter) => {
    counter.count--;
  });
};

function Counter() {
  // Only re-renders when count changes
  const count = useStore(counterStore, (counter) => counter.count);

  // "Computed" value
  const doubled = useStore(counterStore, (counter) => counter.count * 2);

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

### `useStores`

```ts
import { createStore } from '@runicjs/runic';
import { useStores } from '@runicjs/runic-react';
import deepEqual from 'fast-deep-equal';

type User = {
  id: number;
};

const userStore = createStore<User>({
  id: 1,
});

type Todo = { userId: number; id: number; text: string; done: boolean };
type TodoList = {
  todos: Array<Todo>;
};

const todoListStore = createStore<TodoList>({
  todos: [
    { userId: 1, id: 1, text: 'First task', done: false },
    { userId: 2, id: 2, text: 'Second task', done: true },
    { userId: 1, id: 3, text: 'Third task', done: false },
  ],
});

const UserTodos = () => {
  const userTodos = useStores<IncompleteTodos>(
    // Listen for changes to any store that is passed in.
    [userStore, todoListStore],
    ([user, todoList]) => {
      return todoList.todos.filter((todo) => todo.userId === user.id);
    },
    // Gives you control over whether to rerender after the selector runs.
    deepEqual,
  );
};
```
