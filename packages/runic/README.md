# Runic

Runic is the barebones core of [Runicjs](https://github.com/runicjs). It has a minimal
API surface, providing only enough functionality to be a holder of state, while
leaving the door open for more powerful abstractions to be built on top of it,
such as [Runic React](https://github.com/runicjs/runic/tree/master/packages/runic-react).

> **Warning**
> Runic is in its infancy. It's not safe to use in production at this time.

## Features

- Simple API with a plain JavaScript approach to state updates
- Updates powered by [Immer](https://immerjs.github.io/immer/) to avoid excessive boilerplate
- Full TypeScript support with strong type inference
- Core implementation is ~25 sloc and has no dependencies
- Optional integrations with Immer, Mutative, and more
- Efficient updates through granular change detection and selective re-rendering
- Support for atomic multi-store updates to maintain data consistency
- No Providers, no actions, no reducers, minimal boilerplate

## Roadmap

- [x] Implement `createStore`
- [x] Publish a proper build to NPM (https://www.npmjs.com/package/@runicjs/runic)
- [x] Implement `mergeState`
- [x] Implement `resetState`
- [x] Implement Immer integrations (`updateState` & `updateStates`)
- [x] Write tests
- [ ] Test initialState passed to producer in updateState, updateStates
- [ ] Test store.destroy()
- [ ] Implement Mutative integrations (`updateState` & `updateStates`)
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
const person = rune({ name: 'Joe', age: 25 }) // create a new rune (a state holder)
person.get() // => { name: 'Joe', age: 25 }
person.set({ name: 'Joe', age: 26 }) // overwrite the entire state
person.initial() // => { name: 'Joe', age: 25 }
const unsubscribe = person.subscribe((state, lastState) => { ... }) // listen for changes
unsubscribe() // stop listening for changes
person.destroy() // clean up the rune
```

**Utils**

```ts
const person = rune({ name: 'Joe', age: 25 });
patch(person, { age: 26 }); // merge the current state with a partial state
reset(person); // reset to the initial state
```

**Integrations**

```ts
// Choose one. They have the same API.
import { update } from '@runicjs/runic/integrations/immer';
import { update } from '@runicjs/runic/integrations/mutative';

const person1 = rune({ name: 'Joe', age: 25 });
const person1 = rune({ name: 'Jane', age: 26 });
update(person1, (draft) => {
  draft.age = 26;
}); // use immer or mutative to make changes
update([person1, person2], ([draft1, draft2]) => {
  draft1.age = 30;
  draft2.age = 31;
}); // use immer or mutative to change multiple stores together
```

## Usage

### Basic Store Creation and Updates

```ts
import { rune } from '@runicjs/runic';

type Counter = {
  count: number;
};

// Create a store with initial state
const counter = rune<Counter>({ count: 0 });

// Get the current state
console.log('Current count:', counter.get().count);

// Subscribe to changes
const unsubscribe = counter.subscribe((state) => {
  console.log('New count:', state.count);
});

// Update state (changes are made immutably via Immer)
update(counter, (state) => {
  state.count += 1;
});

// No more state updates.
unsubscribe();

// Overwrite the entire state
const storedState = JSON.parse(localStorage.getItem('counter-store'));
counter.set(storedState);

// Reset the store to the initial state
reset(counter);
```

### TypeScript Support

```ts
type Todo = { id: number; text: string; done: boolean };
type Todos = Array<Todo>;

const todosStore = createStore<Todos>([]);

// Write simple functions to update your stores.
function addTodo(newTodo: Todo) {
  updateState(todosStore, (todos) => {
    todos.push(newTodo);
  });
}

addTodo({ id: 1, text: 'Learn Runic', done: false });
```

### Multi-Store Updates

```ts
import { updateStates } from '@runicjs/runic/integrations/immer';

// Create as many stores as you want.
const userStore = createStore<User>({ credits: 100 });
const inventoryStore = createStore<Inventory>(['potion']);

// Update multiple stores at once.
updateStates([userStore, inventoryStore], ([user, inventory]) => {
  user.credits -= 50;
  inventory.push('sword');
});
```
