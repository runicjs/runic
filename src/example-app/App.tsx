import { counterStore, decrement, increment } from '@/example-app/stores';
import { useStore } from '@/runic-react';
import './index.css';

function App() {
  const count = useStore(counterStore, (counter) => counter.count);
  const doubled = useStore(counterStore, (counter) => counter.count * 2);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-4xl font-bold">runic</h1>

      <div className="text-2xl">
        {count} * 2 = {doubled}
      </div>

      <div className="flex flex-row gap-4 items-center">
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
}

export default App;
