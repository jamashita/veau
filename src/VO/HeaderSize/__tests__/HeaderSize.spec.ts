import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { HeaderSizeError } from '../Error/HeaderSizeError';
import { HeaderSize } from '../HeaderSize';

describe('HeaderSize', () => {
  describe('of', () => {
    it('returns Dead when the argument is less than 0', async () => {
      const superposition1: Superposition<HeaderSize, HeaderSizeError> = HeaderSize.of(0);
      const superposition2: Superposition<HeaderSize, HeaderSizeError> = HeaderSize.of(-1);
      const schrodinger1: Schrodinger<HeaderSize, HeaderSizeError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<HeaderSize, HeaderSizeError> = await superposition2.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(HeaderSizeError);
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<HeaderSize, HeaderSizeError> = HeaderSize.of(0.1);
      const superposition2: Superposition<HeaderSize, HeaderSizeError> = HeaderSize.of(1.5);
      const schrodinger1: Schrodinger<HeaderSize, HeaderSizeError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<HeaderSize, HeaderSizeError> = await superposition2.terminate();

      expect(schrodinger1.isDead()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(HeaderSizeError);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(HeaderSizeError);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const size1: HeaderSize = HeaderSize.ofString('');
      const size2: HeaderSize = HeaderSize.ofString('1');

      expect(size1.get()).toBe(0);
      expect(size2.get()).toBe(14);
    });
  });

  describe('default', () => {
    it('normal case', () => {
      const size: HeaderSize = HeaderSize.default();

      expect(size.get()).toBe(14);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', async () => {
      const size1: HeaderSize = await HeaderSize.of(10).get();
      const size2: HeaderSize = await HeaderSize.of(20).get();
      const size3: HeaderSize = await HeaderSize.of(10).get();

      expect(size1.equals(size1)).toBe(true);
      expect(size1.equals(size2)).toBe(false);
      expect(size1.equals(size3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const size: number = 10;
      const headerSize: HeaderSize = await HeaderSize.of(size).get();

      expect(headerSize.toString()).toBe('140');
    });
  });
});
