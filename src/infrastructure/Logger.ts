import pino, { BaseLogger } from 'pino';
import { ILogger } from './ILogger';

export class Logger implements ILogger {
  private logger: BaseLogger;

  public constructor() {
    this.logger = pino({
      level: 'info'
    });
  }

  public debug(message: unknown, context?: string): unknown {
    return this.rightnow(this.logger.debug, message, context);
  }

  public error(message: unknown, trace?: string, context?: string): unknown {
    return this.rightnow(this.logger.error, message, trace, context);
  }

  public fatal(message: unknown, trace?: string, context?: string): unknown {
    return this.rightnow(this.logger.fatal, message, trace, context);
  }

  public info(message: unknown, context?: string): unknown {
    return this.log(message, context);
  }

  public log(message: unknown, context?: string): unknown {
    return this.rightnow(this.logger.info, message, context);
  }

  public trace(message: unknown, context?: string): unknown {
    return this.verbose(message, context);
  }

  public verbose(message: unknown, context?: string): unknown {
    return this.rightnow(this.logger.trace, message, context);
  }

  public warn(message: unknown, context?: string): unknown {
    return this.rightnow(this.logger.warn, message, context);
  }

  private rightnow(fn: Function, ...args: Array<unknown>): unknown {
    return setImmediate(() => {
      fn(...args);
    });
  }
}

export const logger: Logger = new Logger();
