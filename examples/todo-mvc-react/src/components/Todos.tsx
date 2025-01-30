import { useStore } from '@runicjs/runic-react';
import { useCallback } from 'react';
import { toggleAllTodos } from '../actions';
import { appStore, selectFilteredTodos } from '../stores';
import Todo from './Todo';

export default function Todos() {
  const filteredTodos = useStore(appStore, selectFilteredTodos);

  const onToggleAll = useCallback(() => {
    toggleAllTodos();
  }, []);

  if (filteredTodos.length === 0) {
    return null;
  }

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
