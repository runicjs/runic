import { createStore } from '@/runic';

type State = {
  count: number;
};

export const countStore = createStore<State>({
  count: 0,
});

// mutative?

// const runic = createRunic({
//   // ...options
// });

// const store = runic.createStore({
//   // ...state
// });

// runic.update([userStore, blogStore], ([user, blog]) => {
//   // ...
// });

export const increment = () => {
  countStore.setState((draft) => {
    draft.count++;
  });
};

export const decrement = () => {
  countStore.setState((draft) => {
    draft.count--;
  });
};
