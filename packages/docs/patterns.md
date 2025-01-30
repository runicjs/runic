# Ideas about patterns

## Grouping stores into an object

```typescript
// A fictional project management app.

// @/stores/index.ts
import userStore from './user';
import organizationsStore from './organizations';
import projectsStore from './projects';
import tasksStore from './tasks';
import boardsStore from './boards';

const stores = {
  user: userStore,
  organizations: organizationsStore,
  projects: projectsStore,
  tasks: tasksStore,
  boards: boardsStore,
};

// @/app/components/App.tsx
import stores from '@/stores';
import { useStore } from '@runicjs/runic-react';

const App = () => {
  const userId = useStore(stores.user, (user) => user.id);
};
```

## Modifying the store API with a custom store type

```typescript
// @/stores/index.ts

import { createStore as createBaseStore, mergeState, resetState, DeepPartial } from '@runicjs/runic';
import { updateState } from '@runicjs/runic/integrations/mutative'; // or immer, choose one
import { Draft } from 'mutative';

export type Recipe<State> = (draft: Draft<State>) => void;

export type CustomStore<State> = {
  reset: () => void;
  merge: (partialState: DeepPartial<State>) => void;
  update: (recipe: Recipe<State>) => void;
};

export const createStore = <State>(initialState: State): CustomStore<State> => {
  const baseStore = createBaseStore(initialState);
  const reset = () => resetState(baseStore);
  const merge = (partialState: DeepPartial<State>) => mergeState(baseStore, partialState);
  const update = (recipe: Recipe<State>) => updateState(baseStore, recipe);

  return {
    ...baseStore,
    reset,
    merge,
    update,
  };
};

// @/app/components/App.tsx

import { createStore } from '@/stores';

type User = {
  id: string;
  name: string;
}

const userStore = createStore<User>({
  id: '',
  name: '',
});

const setUserName = (userName: string) => {
  userStore.update(user => {
    user.name = userName;
  });
}

const App = () => {
  const userName = useStore(userStore, user => user.name);
  return <input value={userName} onChange={(e) => setUserName(e.target.value)} />;
};
```

## Creating stores dynamically

```typescript
// @/app/components/ContactModal.tsx
import { useStore } from '@runicjs/runic-react';
import { StoreProvider, useNewStore, useProvidedStore } from '@runicjs/runic-react/context';
import shallowEqual from 'shallow-equal';

// const useNewStore = <State>(initialState: State): Store<State> => {
//   const store = useMemo(() => createStore(initialState), []);
//   useEffect(() => store.destroy, [store]);
//   return store;
// };

type ContactInformation = {
  name: string;
  email: string;
  message: string;
};

const InitialState: ContactInformation = {
  name: '',
  email: '',
  message: '',
};

const ContactModal = () => {
  // This is somewhat contrived. You'd probably use a form library for this.
  // TODO: Think of a real use-case for this.
  const contactStore = useNewStore<ContactInformation>(InitialState);

  return (
    <StoreProvider store={contactStore}>
      <ContactForm />
    </StoreProvider>
  );
};

const ContactForm = () => {
  const store = useProvidedStore();
  const info = useStore(store, (state) => state, shallowEqual);
};
```
