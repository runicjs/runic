/**
 * Not implemented yet.
 *
 * This creates configured versions of each of the runic function, e.g.:
 *
 * import { createRunic } from 'runic';
 *
 * const runic = createRunic({
 *   updateFn: (state, fn) => {
 *     mutative.create(state, fn);
 *   },
 * });
 *
 * const statsStore = runic.createStore<Stats>({
 *   complete: 0,
 *   incomplete: 0,
 * });
 *
 * const todosStore = runic.createStore<Todos>({
 *   todos: [],
 * });
 *
 * runic.update([statsStore, todosStore], (stats, todos) => {
 *   // stats & todos are mutative drafts now
 *   stats.complete = todos.todos.filter(todo => todo.complete).length;
 *   stats.incomplete = todos.todos.filter(todo => !todo.complete).length;
 * });
 */
