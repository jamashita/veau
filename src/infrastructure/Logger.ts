import { Logger as Log } from 'tslog';
import { ILogger } from './ILogger.js';

export class Logger implements ILogger {
  private readonly logger: Log;

  private static readonly INSTANCE: Logger = new Logger();

  public static instance(): Logger {
    return Logger.INSTANCE;
  }

  public constructor() {
    this.logger = new Log();
  }

  public debug(...messages: ReadonlyArray<unknown>): unknown {
    return this.logger.debug(messages);
  }

  public error(...messages: ReadonlyArray<unknown>): unknown {
    return this.logger.error(messages);
  }

  public fatal(...messages: ReadonlyArray<unknown>): unknown {
    return this.logger.fatal(messages);
  }

  public info(...messages: ReadonlyArray<unknown>): unknown {
    return this.logger.info(messages);
  }

  public trace(...messages: ReadonlyArray<unknown>): unknown {
    return this.logger.trace(messages);
  }

  public warn(...messages: ReadonlyArray<unknown>): unknown {
    return this.logger.warn(messages);
  }
}
