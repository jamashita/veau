import 'jest';
import { OffsetError } from '../../veau-error/OffsetError';
import { Offset } from '../Offset';

describe('Offset', () => {
  describe('equals', () => {
    it('returns true i f both properties are the same', () => {
      const offset1: Offset = Offset.of(1);
      const offset2: Offset = Offset.of(2);
      const offset3: Offset = Offset.of(1);

      expect(offset1.equals(offset1)).toEqual(true);
      expect(offset1.equals(offset2)).toEqual(false);
      expect(offset1.equals(offset3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const offset: Offset = Offset.of(num);

      expect(offset.toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws OffsetError when the argument is less than 0', () => {
      expect(() => {
        Offset.of(0);
      }).not.toThrow(OffsetError);
      expect(() => {
        Offset.of(-1);
      }).toThrow(OffsetError);
    });

    it('throws OffsetError when the argument is not integer', () => {
      expect(() => {
        Offset.of(0.1);
      }).toThrow(OffsetError);
      expect(() => {
        Offset.of(1.5);
      }).toThrow(OffsetError);
    });
  });
});
