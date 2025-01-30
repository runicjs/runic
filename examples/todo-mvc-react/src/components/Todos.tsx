import { useStore } from '@runicjs/runic-react';
import { toggleAllTodos } from '../actions';
import { AppState, appStore } from '../stores';
import { Filter } from '../types';
import Todo from './Todo';

const createFilterSelector = (filter: Filter) => (state: AppState) => {
  return state.todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    return todo.completed;
  });
};

export default function Todos() {
  const filter = useStore(appStore, (state) => state.filter);
  const filteredTodos = useStore(appStore, createFilterSelector(filter));

  if (filteredTodos.length === 0) {
    return null;
  }

  const onToggleAll = () => {
    toggleAllTodos();
  };

  return (
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" onChange={onToggleAll} />
      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}
