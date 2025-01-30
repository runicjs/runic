import { Draft, produce } from 'immer';
import { Store, Stores } from '../types';
import updateStatesWithProducer, { UpdateManyCallback } from '../utils/updateStatesWithProducer';

export type Drafts<T extends unknown[]> = { [K in keyof T]: Draft<T[K]> };

/**
 * Update the store using Immer.
 * @param store - The store to update.
 * @param recipe - The function to use to update the store.
 */
export const updateState = <State>(
  store: Store<State>,
  recipe: (draft: Draft<State>, initialState?: State) => void,
) => {
  store.setState(produce(store.getState(), recipe));
};

/**
 * Update multiple stores simultaneously using Immer.
 *
 * Example:
 *   type NumState = { num: number };
 *   type NumsState = { nums: number[] };
 *   const numStore1 = createStore<NumState>({ num: 1 });
 *   const numsStore = createStore<NumsState>({ nums: [2, 3, 4] });
 *   const numStore3 = createStore<NumState>({ num: 5 });
 *
 *   // This:
 *   updateStates([numStore1, numsStore, numStore3], ([num1, nums, num3]) => {
 *     //          Draft<NumState>, Draft<NumsState>, Draft<NumState>
 *     console.log(num1,            nums,             num3);
 *   });
 *
 *   // is equivalent to this:
 *   updateStates(numStore1, (num1) => {
 *     updateStates(numsStore, (nums) => {
 *       updateStates(numStore3, (num3) => {
 *         console.log(num1, nums, num3);
 *       });
 *     });
 *   });
 */
export function updateStates<T extends unknown[]>(stores: Stores<T>, fn: (drafts: Drafts<T>) => void) {
  return updateStatesWithProducer(stores, produce, fn as UpdateManyCallback);
}
