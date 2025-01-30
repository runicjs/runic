// import createStore from './createStore';
import { Store } from '../types';

export type Stores<T extends unknown[]> = { [K in keyof T]: Store<T[K]> };
export type UpdateManyCallback = (drafts: any[]) => void;

/**
 * Takes a list of stores and a callback function that will be called with
 * a draft for each store.
 *
 * TODO: Having trouble making a types for this. Going to table it for now.
 *
 * Example:
 *   type NumState = { num: number };
 *   type NumsState = { nums: number[] };
 *
 *   const numStore1 = createStore<NumState>({ num: 1 });
 *   const numsStore = createStore<NumsState>({ nums: [2, 3, 4] });
 *   const numStore3 = createStore<NumState>({ num: 5 });
 *
 *   updateStates([numStore1, numsStore, numStore3], ([num1, nums, num3]) => {
 *     //          Draft<NumState>, Draft<NumsState>, Draft<NumState>
 *     console.log(num1,            nums,             num3);
 *   });
 */
export default function updateStatesWithProducer<T extends unknown[]>(
  stores: Stores<T>,
  producer: any, // (state, (draft) => draft | undefined) => void
  callback: UpdateManyCallback,
) {
  const drafts: Array<any> = [];
  const queue = stores.slice();

  function next() {
    if (queue.length === 0) {
      callback(drafts);
    } else {
      const store = queue.shift()!;
      const newState = producer(store.getState(), (draft: any) => {
        drafts.push(draft);
        next();
      });
      store.setState(newState);
    }
  }

  next();
}
