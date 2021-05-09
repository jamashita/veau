import { LoggerService } from '@nestjs/common';
import pino, { BaseLogger } from 'pino';

export class Logger implements LoggerService {
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

  public log(message: unknown, context?: string): unknown {
    return this.rightnow(this.logger.info, message, context);
  }

  public verbose(message: unknown, context?: string): unknown {
    return this.rightnow(this.logger.trace, message, context);
  }

  public warn(message: unknown, context?: string): unknown {
    return this.rightnow(this.logger.warn, message, context);
  }

  public fatal(message: unknown, trace?: string, context?: string): unknown {
    return this.rightnow(this.logger.fatal, message, trace, context);
  }

  public info(message: unknown, context?: string): unknown {
    return this.log(message, context);
  }

  private rightnow(fn: Function, ...args: Array<unknown>): unknown {
    return setImmediate(() => {
      fn(...args);
    });
  }

  public trace(message: unknown, context?: string): unknown {
    return this.verbose(message, context);
  }
}

export const logger: Logger = new Logger();
