import pino, { BaseLogger, LogFn } from 'pino';

export const log: BaseLogger & { [p: string]: LogFn; } = pino({
  level: 'info'
});
