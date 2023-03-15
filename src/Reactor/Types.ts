export interface Store<State> {
  state: State;
}

export interface Reactions<State> {
  state: () => State;
  effect: (store: Store<State>) => (state: State) => void;
}
