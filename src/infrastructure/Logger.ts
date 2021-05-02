import { Logger } from 'tslog';
import { ILogger } from './interface/ILogger';

export const logger: ILogger = new Logger({
  overwriteConsole: true
});
