import 'jest';
import { HeaderSizeError } from '../../veau-error/HeaderSizeError';
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

  describe('toString', () => {
    it('normal case', () => {
      const size: number = 10;
      const headerSize: HeaderSize = HeaderSize.of(size);

      expect(headerSize.toString()).toEqual(size.toString());
    });
  });

  describe('of', () => {
    it('throws HeaderSizeError when the argument is less than 0', () => {
      expect(() => {
        HeaderSize.of(0);
      }).not.toThrow(HeaderSizeError);
      expect(() => {
        HeaderSize.of(-1);
      }).toThrow(HeaderSizeError);
    });

    it('throws HeaderSizeError when the argument is not integer', () => {
      expect(() => {
        HeaderSize.of(0.1);
      }).toThrow(HeaderSizeError);
      expect(() => {
        HeaderSize.of(1.5);
      }).toThrow(HeaderSizeError);
    });
  });
});
