import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
import { HeaderSize } from '../HeaderSize';

describe('HeaderSize', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const size1: HeaderSize = HeaderSize.of(10);
      const size2: HeaderSize = HeaderSize.of(20);
      const size3: HeaderSize = HeaderSize.of(10);

      expect(size1.equals(size1)).toEqual(true);
      expect(size1.equals(size2)).toEqual(false);
      expect(size1.equals(size3)).toEqual(true);
    });
  });

  describe('of', () => {
    it('throws RuntimeError when the argument is less than 0', () => {
      expect(() => {
        HeaderSize.of(0);
      }).not.toThrow(RuntimeError);
      expect(() => {
        HeaderSize.of(-1);
      }).toThrow(RuntimeError);
    });

    it('throws RuntimeError when the argument is not integer', () => {
      expect(() => {
        HeaderSize.of(0.1);
      }).toThrow(RuntimeError);
      expect(() => {
        HeaderSize.of(1.5);
      }).toThrow(RuntimeError);
    });
  });
});
