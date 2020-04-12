import 'reflect-metadata';
import { kernel } from '../../Container/Container';
import { TYPE } from '../../Container/Types';
import { MySQL } from '../../General/MySQL/MySQL';

describe('VeauMySQL', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const mysql1: MySQL = kernel.get<MySQL>(TYPE.MySQL);
      const mysql2: MySQL = kernel.get<MySQL>(TYPE.MySQL);

      expect(mysql1).toBeInstanceOf(MySQL);
      expect(mysql1).toBe(mysql2);
    });
  });
});
