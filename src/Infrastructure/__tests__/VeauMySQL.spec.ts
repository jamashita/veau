import 'reflect-metadata';

import { MySQL } from 'publikum';

import { kernel } from '../../Container/Kernel';
import { Type } from '../../Container/Types';

describe('VeauMySQL', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const mysql1: MySQL = kernel.get<MySQL>(Type.MySQL);
      const mysql2: MySQL = kernel.get<MySQL>(Type.MySQL);

      expect(mysql1).toBeInstanceOf(MySQL);
      expect(mysql1).toBe(mysql2);
    });
  });
});
