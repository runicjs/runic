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
