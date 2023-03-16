export interface HasKind {
  kind: string;
}

export const logMisfiredState = (store: string, action: string, state: HasKind) =>
  console.warn(`[${store}] [${action}] mistakenly called in state [${state.kind}]`);
