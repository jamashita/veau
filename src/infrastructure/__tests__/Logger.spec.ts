import 'reflect-metadata';
import { Logger } from 'tslog';
import { kernel } from '../../container/Kernel';
import { Type } from '../../container/Types';
import { ILogger } from '../Interface/ILogger';

describe('Logger', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const logger1: ILogger = kernel.get<ILogger>(Type.Logger);
      const logger2: ILogger = kernel.get<ILogger>(Type.Logger);

      expect(logger1).toBeInstanceOf(Logger);
      expect(logger1).toBe(logger2);
    });
  });
});
