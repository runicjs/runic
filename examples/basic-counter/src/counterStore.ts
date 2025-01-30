import { createStore } from '@runicjs/runic';
import { updateState } from '@runicjs/runic/integrations/immer';

export type Counter = {
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
