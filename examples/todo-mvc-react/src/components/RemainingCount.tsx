import { useStore } from '@runicjs/runic-react';
import { appStore } from '../stores';

export default function RemainingCount() {
  const remaining = useStore(appStore, (state) => {
    return state.todos.filter((todo) => !todo.completed).length;
  });

  return (
    <span className="todo-count">
      <strong>{remaining}</strong> {remaining === 1 ? 'item' : 'items'} left
    </span>
  );
}
