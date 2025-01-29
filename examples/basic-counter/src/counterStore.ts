import { createStore } from '@/runic';

export type Counter = {
  count: number;
};

export const counterStore = createStore<Counter>({
  count: 0,
});

export const increment = () => {
  counterStore.update((counter) => {
    counter.count++;
  });
};

export const decrement = () => {
  counterStore.update((counter) => {
    counter.count--;
  });
};
