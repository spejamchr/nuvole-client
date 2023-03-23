import { debug } from '@/Logging';

export interface HasKind {
  kind: string;
}

export const logMisfiredState = (store: string, action: string, state: HasKind): void => {
  if (action !== state.kind) {
    debug(`[${store}] [${action}] misfired in state [${state.kind}]`);
  }
};
