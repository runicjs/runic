import { useStore } from '@runicjs/runic-react';
import { memo } from 'react';
import { appStore } from '../stores';
import ClearCompleted from './ClearCompleted';
import FilterButtons from './FilterButtons';
import RemainingCount from './RemainingCount';

const Filters = memo(() => {
  const hasTodos = useStore(appStore, (state) => state.todos.length > 0);

  if (!hasTodos) {
    return null;
  }

  return (
    <footer className="footer">
      <RemainingCount />
      <FilterButtons />
      <ClearCompleted />
    </footer>
  );
});

export default Filters;
