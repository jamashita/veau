import sinon, { SinonSpy } from 'sinon';

import { Superposition } from '@jamashita/publikum-monad';

import { OffsetError } from '../Error/OffsetError';
import { Offset } from '../Offset';

describe('Offset', () => {
  describe('of', () => {
    it('returns Dead when the argument is less than 0', () => {
      const superposition1: Superposition<Offset, OffsetError> = Offset.of(0);
      const superposition2: Superposition<Offset, OffsetError> = Offset.of(-1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(superposition1.isAlive()).toBe(true);
      expect(superposition2.isDead()).toBe(true);

      superposition2.transform<void>(
        () => {
          spy1();
        },
        (err: OffsetError) => {
          spy2();
          expect(err).toBeInstanceOf(OffsetError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when the argument is not integer', () => {
      const superposition1: Superposition<Offset, OffsetError> = Offset.of(0.1);
      const superposition2: Superposition<Offset, OffsetError> = Offset.of(1.5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isDead()).toBe(true);
      expect(superposition2.isDead()).toBe(true);

      superposition1.transform<void>(
        () => {
          spy1();
        },
        (err: OffsetError) => {
          spy2();
          expect(err).toBeInstanceOf(OffsetError);
        }
      );

      superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: OffsetError) => {
          spy4();
          expect(err).toBeInstanceOf(OffsetError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true i f both properties are the same', () => {
      const offset1: Offset = Offset.of(1).get();
      const offset2: Offset = Offset.of(2).get();
      const offset3: Offset = Offset.of(1).get();

      expect(offset1.equals(offset1)).toBe(true);
      expect(offset1.equals(offset2)).toBe(false);
      expect(offset1.equals(offset3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const offset: Offset = Offset.of(num).get();

      expect(offset.toString()).toBe(num.toString());
    });
  });
});
