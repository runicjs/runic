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
