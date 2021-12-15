import 'reflect-metadata';
import { Logger } from 'tslog';
import { cask } from '../../container/Cask';
import { Type } from '../../container/Types';
import { ILogger } from '../interface/ILogger';

describe('Logger', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const logger1: ILogger = cask.get<ILogger>(Type.Logger);
      const logger2: ILogger = cask.get<ILogger>(Type.Logger);

      expect(logger1).toBeInstanceOf(Logger);
      expect(logger1).toBe(logger2);
    });
  });
});
