import { useCallback } from 'react';
import * as app from '../stores/app';

export default function Header() {
  const onNewTodoKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      app.addTodo(event.currentTarget.value.trim());
      event.currentTarget.value = '';
    }
  }, []);

  return (
    <header className="header">
      <h1>todos</h1>
      <input className="new-todo" placeholder="What needs to be done?" autoFocus onKeyDown={onNewTodoKeyDown} />
    </header>
  );
}
