import { createStore } from '@/runic';

type State = {
  count: number;
};

export const countStore = createStore<State>({
  count: 0,
});

export const increment = () => {
  countStore.update((draft) => {
    draft.count++;
  });
};

export const decrement = () => {
  countStore.update((draft) => {
    draft.count--;
  });
};
