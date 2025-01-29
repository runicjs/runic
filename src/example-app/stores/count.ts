import { createStore } from '@/runic';

type State = {
  count: number;
};

export const countStore = createStore<State>({
  count: 0,
});

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
