# Runic

A lightweight and type-safe, vanilla JavaScript state management library.

## Features

- Simple API with a plain JavaScript approach to state updates
- Updates powered by [Immer](https://immerjs.github.io/immer/) to avoid excessive boilerplate
- Full TypeScript support with strong type inference
- Minimal bundle size with zero dependencies beyond Immer
- Efficient updates through granular change detection and selective re-rendering
- Support for atomic multi-store updates to maintain data consistency

## Roadmap

**repo**

- [ ] Turn this into a monorepo with separate packages.

**runic**

- [x] Implement `createStore`

**runic-react**

- [x] Implement `useStore`
- [ ] IDEA: `useComposite`

## Usage

### Basic Store Creation and Updates

```js
import { createStore } from 'runic';

// Create a store with initial state
const counterStore = createStore({ count: 0 });

// Subscribe to changes
counterStore.subscribe((state) => {
  console.log('New count:', state.count);
});

// Update state (changes are made immutably via Immer)
counterStore.update((state) => {
  state.count += 1;
});
```

### TypeScript Support

```ts
type Todo = { id: number; text: string; done: boolean };
type Todos {
  items: Array<Todo>;
}

const todosStore = createStore<Todos>({
  items: [],
});

// Write simple functions to update your stores.
function addTodo(todo: Todo) {
  todosStore.update((todos) => {
    todos.items.push(todo);
  });
}

addTodo({ id: 1, text: 'Learn Runic', done: false });
```

### Multi-Store Updates

```js
import { update } from 'runic';

// Create as many stores as you want.
const userStore = createStore < User > { credits: 100 };
const inventoryStore = createStore < Inventory > ['potion'];

// Update multiple stores at once.
update([userStore, inventoryStore], ([user, inventory]) => {
  user.credits -= 50;
  inventory.push('sword');
});
```

### Derived Values

> **Warning**
> Not implemented yet

```js
import { derived } from 'runic';

const todoStore = createStore({
  items: [
    { id: 1, text: 'First task', done: false },
    { id: 2, text: 'Second task', done: true },
  ],
});

// Create a derived value that updates when source changes
const incompleteTodos =
  derived < IncompleteTodos > ([todosStore], ([todos]) => todos.items.filter((item) => !item.done));

incompleteTodos.subscribe((todos) => {
  console.log('Incomplete tasks:', todos.length);
});
```

## Development

```bash
$ npm i
$ npm run dev
# open http://localhost:5173/
```
