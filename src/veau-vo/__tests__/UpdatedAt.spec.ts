import 'jest';
import * as moment from 'moment';
import { RuntimeError } from '../../veau-error/RuntimeError';
import { UpdatedAt } from '../UpdatedAt';

describe('UpdatedAt', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const at1: UpdatedAt = UpdatedAt.of(moment('2000-01-01'));
      const at2: UpdatedAt = UpdatedAt.of(moment('2000-01-02'));
      const at3: UpdatedAt = UpdatedAt.of(moment('2000-01-01'));

      expect(at1.equals(at1)).toEqual(true);
      expect(at1.equals(at2)).toEqual(false);
      expect(at1.equals(at3)).toEqual(true);
    });
  });

  describe('ofString', () => {
    it('throws error if the parameter is not date format', () => {
      expect(() => {
        UpdatedAt.ofString('this is not date');
      }).toThrow(RuntimeError);
    });

    it('normal case', () => {
      expect(() => {
        UpdatedAt.ofString('2000-01-01');
      }).not.toThrow(RuntimeError);
    });
  });
});
