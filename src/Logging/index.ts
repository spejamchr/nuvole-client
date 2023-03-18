type Logger = 'debug' | 'error' | 'info' | 'log' | 'warn';

const prefixer =
  (prefix: string) =>
  <T extends Logger>(kind: T) =>
  (msg: any, ...other: any[]): void =>
    console[kind](prefix, msg, ...other);

const prefixed = prefixer('[NUV]');

export const debug = prefixed('debug');
export const error = prefixed('error');
export const info = prefixed('info');
export const log = prefixed('log');
export const warn = prefixed('warn');
