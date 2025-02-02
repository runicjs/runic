# Batched Updates

```ts
import { batch } from 'runic-react';

batch(() => {
  rune1.set({ ... });
  rune1.set({ ... });

  rune2.set({ ... });
  patch(rune2, { ... });

  rune3.set({ ... });
  update(rune3, draft => { ... });
}); // Only notifies listeners once for each rune.
```

```ts
// src/createRune.ts

import { batchNotify } from 'src/state/batch';

function createRune() {
  // ...

  const set: Self['set'] = (next: State) => {
    lastState = state;
    state = next;
    batchNotify(this);
  };

  const notify: Self['notify'] = () => {
    listeners.forEach((listener) => listener.fn(state, lastState));
  };

  // ...
}
```

```ts
// src/state/batch.ts

// batch(() => /* depth = 1 */);
// batch(() => batch(() => /* depth = 2 */));
// etc
let batchDepth = 0;

export const batch = (fn: () => void) => {
  batchDepth++;

  try {
    fn();
  } finally {
    batchDepth--;
  }

  if (batchDepth === 0) {
    // What if, instead of this, waiting runes are flushed every
    // frame, e.g. setInterval(flush, 0);
    flush();
  }
};

const waiting: Set<RunicRune> = new Set();
export const batchNotify = (rune) => {
  waiting.add(rune);
  flush();
};

const flush = () => {
  if (batchDepth > 0) return;

  // In case someone makes more changes during notification.
  const runes = Array.from(waiting);
  waiting.clear();

  runes.forEach((rune) => rune.notify());
};
```
