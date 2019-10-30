import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
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

  describe('of', () => {
    it('throws RuntimeError when the argument is less than 0', () => {
      expect(() => {
        Offset.of(0);
      }).not.toThrow(RuntimeError);
      expect(() => {
        Offset.of(-1);
      }).toThrow(RuntimeError);
    });

    it('throws RuntimeError when the argument is not integer', () => {
      expect(() => {
        Offset.of(0.1);
      }).toThrow(RuntimeError);
      expect(() => {
        Offset.of(1.5);
      }).toThrow(RuntimeError);
    });
  });
});
