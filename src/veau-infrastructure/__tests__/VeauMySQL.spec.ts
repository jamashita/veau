import 'jest';
import 'reflect-metadata';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { MySQL } from '../../veau-general/MySQL/MySQL';

describe('VeauMySQL', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const mysql1: MySQL = container.get<MySQL>(TYPE.MySQL);
      const mysql2: MySQL = container.get<MySQL>(TYPE.MySQL);

      expect(mysql1).toBeInstanceOf(MySQL);
      expect(mysql1).toBe(mysql2);
    });
  });
});
