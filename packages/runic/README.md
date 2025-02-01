# Runic

Runic is the barebones core of [RunicJS](https://github.com/runicjs). It has a minimal
API surface, providing only enough functionality to be a holder of state, while
leaving the door open for more powerful abstractions to be built on top of it,
such as [Runic React](https://github.com/runicjs/runic/tree/master/packages/runic-react).

> **Warning**
> RunicJS is in its infancy. It's not safe to use in production at this time.

## Features

- Simple API with a plain JavaScript approach to state updates
- Updates powered by [Immer](https://immerjs.github.io/immer/) or [Mutative](https://mutative.js.org/) to avoid excessive boilerplate
- Full TypeScript support with strong type inference
- Core implementation is ~25 sloc and has no dependencies
- Optional integrations with Immer, Mutative, and more
- Efficient updates through granular change detection and selective re-rendering
- Support for atomic multi-store updates to maintain data consistency
- No Providers, no actions, no reducers, minimal boilerplate

## Roadmap

- [x] Move to a new API design (`createStore` -> `createRune`).
- [ ] Test that `patch` does not modify the current state object directly, but returns a new one.
- [ ] Move all of the listener logic out of `rune` and into a separate class.
- [ ] Test `update` with primitive types.
- [ ] Test store.destroy()
- [ ] Think about middleware
- [ ] Come up with a solution for persistence
- [ ] Come up with a solution for logging
- [ ] Come up with a solution for error reporting
- [ ] Finalize the v0 API
- [ ] Implement remaining functionality
- [ ] Implement TodoMVC in vanilla JS using runic

## API

**Core**

```ts
import { createRune } from '@runicjs/runic';
const person = createRune({ name: 'Joe', age: 25 }); // create a new rune (a state holder)
person.get(); // => { name: 'Joe', age: 25 }
person.set({ name: 'Joe', age: 26 }); // overwrite the entire state
person.initial(); // => { name: 'Joe', age: 25 }
const unsubscribe = person.subscribe((state, lastState) => { ... }); // listen for changes
unsubscribe(); // stop listening for changes
person.destroy(); // clean up the rune
```

**Utils**

```ts
import { patch, reset } from '@runicjs/runic';
const person = createRune({ name: 'Joe', age: 25 });
patch(person, { age: 26 }); // merge the current state with a partial state
reset(person); // reset to the initial state
```

**Integrations**

```ts
// Choose one. They have the same API.
import { update } from '@runicjs/runic/integrations/immer';
import { update } from '@runicjs/runic/integrations/mutative';

const person1 = createRune({ name: 'Joe', age: 25 });
const person1 = createRune({ name: 'Jane', age: 26 });

update(person1, (draft) => {
  draft.age = 26;
}); // use immer or mutative to make changes

update([person1, person2], ([p1, p2]) => {
  p1.age = 30;
  p2.age = 31;
}); // use immer or mutative to change multiple stores together
```

## Notes on Naming

**Why are holders of state called "runes", and not "stores"?**

"Store" is an overloaded term you'll find all over a codebase, in code,
comments, and other documentation. "Rune" will be far more searchable.

"Rune" also matches nicely with the name of the library, Runic.

**Why the short names for utility functions like `patch` and `reset`?**

Won't there be name collisions with my own code or other libraries?

Ideally, you'll be writing your own getter/setter wrapper functions to
work with your runes, and keeping those tucked away in their own file,
so there shouldn't be much chance for collision.

For example, here is one pattern you could adopt with RunicJS:

```ts
// <project-root>/src/stores/todoList.ts

import { createRune, patch } from '@runicjs/runic';
import { update } from '@runicjs/runic/integrations/immer';

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export type Filter = 'all' | 'completed' | 'incompleted';

export type TodoListState = {
  filter: Filter;
  todos: Array<Todo>;
};

export const rune = createRune<TodoListState>({
  filter: 'all',
  todos: [],
});

export const setFilter = (filter: Filter): void => {
  patch(rune, { filter });
};

export const addTodo = (newTodo: Todo): void => {
  update(rune, (draft) => {
    draft.todos.push(newTodo);
  });
};

// <project-root>/src/App.ts

import * as todoList from './stores/todoList';

todoList.rune.subscribe((state) => {
  // Update your UI...
});

todoList.addTodo({ id: '1', text: 'Do a thing', done: true });
todoList.addTodo({ id: '2', text: 'Do another thing', done: false });

todoList.setFilter('completed');
```

## Naming Conventions

Here are some guidelines you may find helpful when naming things:

1. Things returned by `createRune` are "runes".
2. The type passed to `createRune<Type>` is the "state type".
3. State types should follow the convention `NounState`, e.g. `PersonState`.
4. Runes should follow the convention `noun = createRune()`, e.g. `const person = createRune<PersonState>(...)`.
5. When using `update`, drafts should follow the convention `nounDraft`, e.g. `personDraft`., or just `draft`.
6. You may shorten draft names if it improves readability, e.g. `update([person1, person2], ([p1, p2]) => { ... })`.
   Compare that to `update([person1, person2], ([person1Draft, person2Draft]) => { ... })`.
7. The values returned by `get`, `last`, and `initial` are "states".

Here's a full example:

```ts
type PersonState = {
  name: string;
  age: number;
};

const person = createRune<PersonState>({
  name: 'John',
  age: 25,
});

update(person, (personDraft) => {
  personDraft.age++;
});

const currentState = person.get();
const lastState = person.last();
const initialState = person.initial();
```

## Usage

### Basic Store Creation and Updates

```ts
import { createRune } from '@runicjs/runic';

type CounterState = {
  name: string;
  count: number;
};

// Create a store with initial state
const counter = createRune<CounterState>({ name: 'Laps', count: 0 });

// Overwrite the entire state
const storedState = JSON.parse(localStorage.getItem('counter-state'));
counter.set(storedState); // Could also be passed directly to createRune().

// Get the current state
console.log('Current count:', counter.get().count);

// Subscribe to changes
const unsubscribe = counter.subscribe((state) => {
  console.log('New count:', state.count);
});

// Merge in a partial state.
patch({ count: 5 });

// Update state (changes are made immutably via Immer)
update(counter, (draft) => {
  draft.count += 1;
});

// No more state updates.
unsubscribe();

// Reset the store to the initial state
reset(counter);
```

### TypeScript Support

```ts
type Todo = { id: number; text: string; done: boolean };
type TodoListState = {
  todos: Array<Todo>;
};

// Runes are type-safe holders of state.
const todoList = createRune<TodoListState>({
  todos: [],
});

todoList.get(); // => TodoListState

// Write simple functions to update your stores.
function addTodo(newTodo: Todo) {
  update(todoList, (draft) => {
    draft.todos.push(newTodo);
  });
}

addTodo({ id: 1, text: 'Learn Runic', done: false });
```

### Multi-Store Updates

```ts
import { update } from '@runicjs/runic/integrations/immer';

type UserState = { credits: number };
type InventoryState = Array<string>;

// Create as many stores as you want.
const user = createRune<UserState>({ credits: 100 });
const inventory = createRune<InventoryState>(['potion']);

// Update multiple stores at once.
update([user, inventory], ([userDraft, inventoryDraft]) => {
  userDraft.credits -= 50;
  inventoryDraft.push('sword');
});
```
