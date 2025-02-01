import { RunicRunes } from '../types';

export type UpdateManyRecipe = (drafts: unknown[]) => void;

/**
 * Takes a list of stores and a callback function that will be called with
 * a draft for each store.
 *
 * TODO: I'm having trouble making types for this. This should only be used
 * by people who need advanced customization anyway. Most people should be
 * fine with Immer or Mutative. And if not, this is always available, just
 * not the friendliest thing to use.
 *
 * @param runes - The runes to update.
 * @param producer - The function to use to create "drafts" for each rune's state.
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
export default function updateWithProducer<T extends unknown[]>(
  runes: RunicRunes<T>,
  producer: any, // (state, (draft) => draft | undefined) => void
  recipe: UpdateManyRecipe,
) {
  const drafts: Array<any> = [];
  const queue = runes.slice();

  function next() {
    if (queue.length === 0) {
      recipe(drafts);
    } else {
      const store = queue.shift()!;
      const newState = producer(store.get(), (draft: unknown) => {
        drafts.push(draft);
        next();
      });
      store.set(newState);
    }
  }

  next();
}
