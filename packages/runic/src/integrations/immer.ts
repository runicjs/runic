import { Draft, produce } from 'immer';
import { RunicRune, RunicStateHolders } from '../types';
import updateWithProducer, { UpdateManyCallback } from '../utils/updateWithProducer';

export type Drafts<T extends unknown[]> = { [K in keyof T]: Draft<T[K]> };

/**
 * Update a single rune using Immer.
 *
 * @param rune - The rune to update.
 * @param recipe - The function to use to update the rune.
 */
export function update<T extends unknown[], State>(rune: RunicRune<State>, recipe: (draft: Draft<State>) => void): void;

/**
 * Update multiple runes simultaneously using Immer.
 *
 * @param runes - The runes to update.
 * @param recipe - The function to use to update the runes.
 *
 * Example:
 *   type Person = { name: string; age: number };
 *   type Address = { street: string; city: string; state: string; zip: string };
 *   const person = rune<Person>({ name: 'John', age: 25 });
 *   const address = rune<Address>({ street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' });
 *
 *   update([person, address], ([person, address]) => {
 *     //          Draft<Person>,  Draft<Address>
 *     console.log(person,         address);
 *   });
 *
 *   // The above is equivalent to this:
 *   update(person, (person) => {
 *     update(address, (address) => {
 *       console.log(person, address);
 *     });
 *   });
 */
export function update<T extends unknown[], State>(
  runes: RunicStateHolders<T>,
  recipe: (drafts: Drafts<T>) => void,
): void;

export function update<T extends unknown[], State>(
  rune: RunicRune<State> | RunicStateHolders<T>,
  recipe: (draft: Draft<State> | Drafts<T>) => void,
): void {
  if (Array.isArray(rune)) {
    return updateWithProducer(rune, produce, recipe as UpdateManyCallback);
  } else {
    rune.set(produce(rune.get(), recipe));
  }
}
