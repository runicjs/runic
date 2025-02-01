import { RunicRune, RunicSelector } from '@runicjs/runic';
import { RefObject, useEffect, useRef } from 'react';

export default function useRuneRef<State>(rune: RunicRune<State>): RefObject<State>;
export default function useRuneRef<State, Value>(
  rune: RunicRune<State>,
  selector: RunicSelector<State, Value>,
): RefObject<Value>;

export default function useRuneRef<State, Value>(
  rune: RunicRune<State>,
  selector: RunicSelector<State, Value> = (v) => v as unknown as Value,
): RefObject<Value> {
  const ref = useRef<Value>(selector(rune.get()));

  useEffect(() => {
    return rune.subscribe((state) => {
      ref.current = selector(state);
    });
  }, [rune]);

  return ref;
}
