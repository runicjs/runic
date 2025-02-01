import { useRune } from '@runicjs/runic-react';
import * as counter from './counter';
import './index.css';

const Count = () => {
  const count = useRune(counter.rune, (counter) => counter.count);
  const doubled = useRune(counter.rune, (counter) => counter.count * 2);

  return (
    <div className="text-2xl">
      {count} * 2 = {doubled}
    </div>
  );
};

export default function Counter() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Count />

      <div className="flex flex-row gap-4 items-center">
        <button onClick={counter.decrement}>-</button>
        <button onClick={counter.increment}>+</button>
      </div>
    </div>
  );
}
