import { IMySQL, MySQL } from '@jamashita/publikum-mysql';
import 'reflect-metadata';

import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';

describe('VeauMySQL', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const mysql1: IMySQL = kernel.get<IMySQL>(Type.MySQL);
      const mysql2: IMySQL = kernel.get<IMySQL>(Type.MySQL);

      expect(mysql1).toBeInstanceOf(MySQL);
      expect(mysql1).toBe(mysql2);
    });
  });
});
