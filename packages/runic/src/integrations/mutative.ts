import { Draft, create } from 'mutative';
import updateWithProducer, { UpdateManyRecipe } from '../state/updateWithProducer';
import { RunicRune, RunicRunes } from '../types';

export type Drafts<T extends unknown[]> = { [K in keyof T]: Draft<T[K]> };

/**
 * Update a single rune using Mutative.
 *
 * @param rune - The rune to update.
 * @param recipe - The function to use to update the rune.
 */
export function update<T extends unknown[], State>(rune: RunicRune<State>, recipe: (draft: Draft<State>) => void): void;

/**
 * Update multiple runes simultaneously using Mutative.
 *
 * @param runes - The runes to update.
 * @param recipe - The function to use to update the runes.
 *
 * Example:
 *   type Person = { name: string; age: number };
 *   type Address = { street: string; city: string; state: string; zip: string };
 *   const person = createRune<Person>({ name: 'John', age: 25 });
 *   const address = createRune<Address>({ street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' });
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
export function update<T extends unknown[], State>(runes: RunicRunes<T>, recipe: (drafts: Drafts<T>) => void): void;

export function update<T extends unknown[], State>(
  rune: RunicRune<State> | RunicRunes<T>,
  recipe: (draft: Draft<State> | Drafts<T>) => void,
): void {
  if (Array.isArray(rune)) {
    return updateWithProducer(rune, create, recipe as UpdateManyRecipe);
  } else {
    rune.set(create(rune.get(), recipe));
  }
}
