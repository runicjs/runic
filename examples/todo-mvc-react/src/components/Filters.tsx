import { useStore } from '@runicjs/runic-react';
import { clearCompletedTodos, setFilter } from '../actions';
import { appStore } from '../stores';
import { Filter, Todo } from '../types';

const FilterList: Array<Filter> = ['all', 'active', 'completed'];

const partitionTodos = (
  todos: Todo[],
): {
  completed: Todo[];
  remaining: Todo[];
} => {
  const completed: Todo[] = [];
  const remaining: Todo[] = [];
  for (const todo of todos) {
    if (todo.completed) {
      completed.push(todo);
    } else {
      remaining.push(todo);
    }
  }
  return { completed, remaining };
};

export default function Filters() {
  const appFilter = useStore(appStore, (state) => state.filter);
  const todos = useStore(appStore, (state) => state.todos);
  const { completed, remaining } = partitionTodos(todos);

  if (todos.length === 0) {
    return null;
  }

  const onFilterChange = (filter: Filter) => {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setFilter(filter);
    };
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remaining.length}</strong> {remaining.length === 1 ? 'item' : 'items'} left
      </span>

      <ul className="filters">
        {FilterList.map((filter) => (
          <li key={filter}>
            <a href="#" className={filter === appFilter ? 'selected' : ''} onClick={onFilterChange(filter)}>
              {filter}
            </a>
          </li>
        ))}
      </ul>

      {completed.length > 0 && (
        <button className="clear-completed" onClick={clearCompletedTodos}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
