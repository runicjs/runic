import { useRune } from '@runicjs/runic-react';
import * as app from '../stores/app';
import Todo from './Todo';

export default function Todos() {
  const filteredTodos = useRune(app.rune, app.selectFilteredTodos);

  if (filteredTodos.length === 0) {
    return null;
  }

  return (
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" onChange={app.toggleAllTodos} />
      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}
