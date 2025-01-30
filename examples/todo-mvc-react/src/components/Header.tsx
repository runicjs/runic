import { useCallback } from 'react';
import { addTodo } from '../actions';

export default function Header() {
  const onNewTodoKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodo(event.currentTarget.value.trim());
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
