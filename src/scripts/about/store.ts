import type { Store } from "./types";

export const createStore = <S>(initialState: S, render: (state: S) => void): Store<S> => {
  let state = initialState;
  const get = () => state;
  const set = (patch: Partial<S>) => { state = { ...state, ...patch }; render(state); };
  render(state);
  return { get, set };
};