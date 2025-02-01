import { rune as runicRune } from '@runicjs/runic';
import { update } from '@runicjs/runic/integrations/immer';

export type State = {
  count: number;
};

export const rune = runicRune<State>({
  count: 0,
});

export const increment = () => {
  update(rune, (draft) => {
    draft.count++;
  });
};

export const decrement = () => {
  update(rune, (draft) => {
    draft.count--;
  });
};
