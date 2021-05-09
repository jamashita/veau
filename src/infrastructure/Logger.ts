import { Logger as Log } from 'tslog';
import { ILogger } from './ILogger';

export class Logger implements ILogger {
  private logger: Log;

  public constructor() {
    this.logger = new Log();
  }

  public debug(message: unknown, context?: string): unknown {
    return this.logger.debug(message, context);
  }

  public error(message: unknown, trace?: string, context?: string): unknown {
    return this.logger.error(message, trace, context);
  }

  public fatal(message: unknown, trace?: string, context?: string): unknown {
    return this.logger.fatal(message, trace, context);
  }

  public info(message: unknown, context?: string): unknown {
    return this.log(message, context);
  }

  public log(message: unknown, context?: string): unknown {
    return this.logger.info(message, context);
  }

  public trace(message: unknown, context?: string): unknown {
    return this.verbose(message, context);
  }

  public verbose(message: unknown, context?: string): unknown {
    return this.logger.trace(message, context);
  }

  public warn(message: unknown, context?: string): unknown {
    return this.logger.warn(message, context);
  }
}

export const logger: Logger = new Logger();
