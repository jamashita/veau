import sinon, { SinonSpy } from 'sinon';

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

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isDead()).toBe(true);

      await superposition2.transform<void>(
        () => {
          spy1();
        },
        (err: HeaderSizeError) => {
          spy2();
          expect(err).toBeInstanceOf(HeaderSizeError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<HeaderSize, HeaderSizeError> = HeaderSize.of(0.1);
      const superposition2: Superposition<HeaderSize, HeaderSizeError> = HeaderSize.of(1.5);
      const schrodinger1: Schrodinger<HeaderSize, HeaderSizeError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<HeaderSize, HeaderSizeError> = await superposition2.terminate();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(schrodinger1.isDead()).toBe(true);
      expect(schrodinger2.isDead()).toBe(true);

      await superposition1.transform<void>(
        () => {
          spy1();
        },
        (err: HeaderSizeError) => {
          spy2();
          expect(err).toBeInstanceOf(HeaderSizeError);
        }
      ).terminate();

      await superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: HeaderSizeError) => {
          spy4();
          expect(err).toBeInstanceOf(HeaderSizeError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
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

      expect(headerSize.toString()).toBe(headerSize.toString());
    });
  });
});
