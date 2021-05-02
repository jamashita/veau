import { IMySQL, MySQL } from '@jamashita/catacombe-mysql';
import 'reflect-metadata';
import { kernel } from '../../container/Kernel';
import { Type } from '../../container/Types';

describe('VeauMySQL', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const mysql1: IMySQL = kernel.get<IMySQL>(Type.MySQL);
      const mysql2: IMySQL = kernel.get<IMySQL>(Type.MySQL);

      expect(mysql1).toBeInstanceOf(MySQL);
      expect(mysql1).toBe(mysql2);
    });
  });
});
