import { LoggerService } from '@nestjs/common';

export interface ILogger extends LoggerService {
  debug(message: unknown, context?: string): unknown;

  error(message: unknown, trace?: string, context?: string): unknown;

  fatal(message: unknown, trace?: string, context?: string): unknown;

  info(message: unknown, context?: string): unknown;

  log(message: unknown, context?: string): unknown;

  trace(message: unknown, context?: string): unknown;

  verbose(message: unknown, context?: string): unknown;

  warn(message: unknown, context?: string): unknown;
}
