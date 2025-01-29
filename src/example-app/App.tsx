import './index.css';

import { countStore, decrement, increment } from '@/example-app/stores/count';
import { useStore } from '@/runic-react';
import './App.css';

function App() {
  const count = useStore(countStore, (state) => state.count);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold">runic</h1>

      <div className="p-8 flex flex-row gap-4 items-center">
        <button onClick={decrement}>-</button>
        <span className="text-6xl">{count}</span>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
}

export default App;
