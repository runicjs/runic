import { createStore } from '@runicjs/runic';
import { Filter, Todo } from '../types';

export type AppState = {
  nextId: number;
  filter: Filter;
  todos: Todo[];
};

const StorageKey = 'app-store';

const InitialState: AppState = {
  nextId: 0,
  filter: 'all',
  todos: [],
};

const loadState = () => {
  const state = localStorage.getItem(StorageKey);
  return state ? JSON.parse(state) : InitialState;
};

export const appStore = createStore<AppState>(loadState());

appStore.subscribe((state) => {
  localStorage.setItem(StorageKey, JSON.stringify(state));
});

export const selectFilter = (state: AppState) => state.filter;
export const selectTodos = (state: AppState) => state.todos;
export const selectCompleteTodos = (state: AppState) => state.todos.filter((todo) => todo.completed);
export const selectIncompleteTodos = (state: AppState) => state.todos.filter((todo) => !todo.completed);

export const selectFilteredTodos = (state: AppState) => {
  const filter = selectFilter(state);
  return state.todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    return todo.completed;
  });
};

// const SampleState: AppState = {
//   nextId: 11,
//   filter: 'all',
//   todos: [
//     { id: 5, text: 'Build Runic', completed: true },
//     { id: 6, text: 'Build Runic React', completed: true },
//     { id: 7, text: 'Build a counter app with Runic', completed: true },
//     { id: 8, text: 'Build TodoMVC with Runic React', completed: false },
//     { id: 9, text: 'Test rerenders in TodoMVC', completed: false },
//     { id: 10, text: 'MVP implementation of middleware', completed: false },
//   ],
// };
