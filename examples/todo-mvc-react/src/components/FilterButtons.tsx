import { useStore } from '@runicjs/runic-react';
import { setFilter } from '../actions';
import { appStore } from '../stores';
import { Filter } from '../types';

const FilterList: Array<Filter> = ['all', 'active', 'completed'];

export default function Filters() {
  const appFilter = useStore(appStore, (state) => state.filter);

  const onFilterChange = (filter: Filter) => {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setFilter(filter);
    };
  };

  return (
    <ul className="filters">
      {FilterList.map((filter) => (
        <li key={filter}>
          <a href="#" className={filter === appFilter ? 'selected' : ''} onClick={onFilterChange(filter)}>
            {filter}
          </a>
        </li>
      ))}
    </ul>
  );
}
