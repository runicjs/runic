import { useRune } from '@runicjs/runic-react';
import * as app from '../stores/app';
import { Filter } from '../types';

const FilterList: Array<Filter> = ['all', 'active', 'completed'];

export default function Filters() {
  const appFilter = useRune(app.rune, app.selectFilter);

  const onFilterChange = (filter: Filter) => {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      app.setFilter(filter);
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
