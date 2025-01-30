import { useStore } from '@runicjs/runic-react';
import { counterStore, decrement, increment } from './counterStore';
import './index.css';

const Count = () => {
  const count = useStore(counterStore, (counter) => counter.count);
  const doubled = useStore(counterStore, (counter) => counter.count * 2);

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
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
}
