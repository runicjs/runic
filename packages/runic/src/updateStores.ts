import { Draft } from 'immer';
// import createStore from './createStore';
import { Store } from './types';

type Stores<T extends unknown[]> = { [K in keyof T]: Store<T[K]> };
type Drafts<T extends unknown[]> = { [K in keyof T]: Draft<T[K]> };

/**
 * type NumState = { num: number };
 * type NumsState = { nums: number[] };
 *
 * const numStore1 = createStore<NumState>({ num: 1 });
 * const numsStore = createStore<NumsState>({ nums: [2, 3, 4] });
 * const numStore3 = createStore<NumState>({ num: 5 });
 *
 * updateStores([numStore1, numsStore, numStore3], ([num1, nums, num3]) => {
 *   //          Draft<NumState>, Draft<NumsState>, Draft<NumState>
 *   console.log(num1,            nums,             num3);
 * });
 */
export default function updateStores<T extends unknown[]>(stores: Stores<T>, fn: (drafts: Drafts<T>) => void) {
  const drafts: Drafts<T> = [] as Drafts<T>;
  const queue = stores.slice();

  function next() {
    if (queue.length === 0) {
      fn(drafts);
    } else {
      const store = queue.shift()!;
      store.update((draft) => {
        drafts.push(draft);
        next();
      });
    }
  }

  next();
}
