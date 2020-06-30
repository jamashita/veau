import sinon, { SinonSpy } from 'sinon';

import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { OffsetError } from '../Error/OffsetError';
import { Offset } from '../Offset';

describe('Offset', () => {
  describe('of', () => {
    it('returns Dead when the argument is less than 0', async () => {
      const superposition1: Superposition<Offset, OffsetError> = Offset.of(0);
      const superposition2: Superposition<Offset, OffsetError> = Offset.of(-1);
      const schrodinger1: Schrodinger<Offset, OffsetError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Offset, OffsetError> = await superposition2.terminate();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isDead()).toBe(true);

      await superposition2.transform<void>(
        () => {
          spy1();
        },
        (err: OffsetError) => {
          spy2();
          expect(err).toBeInstanceOf(OffsetError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<Offset, OffsetError> = Offset.of(0.1);
      const superposition2: Superposition<Offset, OffsetError> = Offset.of(1.5);
      const schrodinger1: Schrodinger<Offset, OffsetError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Offset, OffsetError> = await superposition2.terminate();

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
        (err: OffsetError) => {
          spy2();
          expect(err).toBeInstanceOf(OffsetError);
        }
      ).terminate();

      await superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: OffsetError) => {
          spy4();
          expect(err).toBeInstanceOf(OffsetError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true i f both properties are the same', async () => {
      const offset1: Offset = await Offset.of(1).get();
      const offset2: Offset = await Offset.of(2).get();
      const offset3: Offset = await Offset.of(1).get();

      expect(offset1.equals(offset1)).toBe(true);
      expect(offset1.equals(offset2)).toBe(false);
      expect(offset1.equals(offset3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const num: number = 2;
      const offset: Offset = await Offset.of(num).get();

      expect(offset.toString()).toBe(num.toString());
    });
  });
});
