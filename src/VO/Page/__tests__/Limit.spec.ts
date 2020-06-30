import sinon, { SinonSpy } from 'sinon';

import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { LimitError } from '../Error/LimitError';
import { Limit } from '../Limit';

describe('Limit', () => {
  describe('default', () => {
    it('always returns 40', () => {
      expect(Limit.default().get()).toBe(40);
    });

    it('returns singleton instance', () => {
      expect(Limit.default()).toBe(Limit.default());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 1', async () => {
      const superposition1: Superposition<Limit, LimitError> = Limit.of(1);
      const superposition2: Superposition<Limit, LimitError> = Limit.of(0);
      const superposition3: Superposition<Limit, LimitError> = Limit.of(-1);
      const schrodinger1: Schrodinger<Limit, LimitError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Limit, LimitError> = await superposition2.terminate();
      const schrodinger3: Schrodinger<Limit, LimitError> = await superposition3.terminate();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isDead()).toBe(true);
      expect(schrodinger3.isDead()).toBe(true);

      await superposition2.transform<void>(
        () => {
          spy1();
        },
        (err: LimitError) => {
          spy2();
          expect(err).toBeInstanceOf(LimitError);
        }
      ).terminate();

      await superposition3.transform<void>(
        () => {
          spy3();
        },
        (err: LimitError) => {
          spy4();
          expect(err).toBeInstanceOf(LimitError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<Limit, LimitError> = Limit.of(1.1);
      const superposition2: Superposition<Limit, LimitError> = Limit.of(0.2);
      const schrodinger1: Schrodinger<Limit, LimitError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Limit, LimitError> = await superposition2.terminate();

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
        (err: LimitError) => {
          spy2();
          expect(err).toBeInstanceOf(LimitError);
        }
      ).terminate();

      await superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: LimitError) => {
          spy4();
          expect(err).toBeInstanceOf(LimitError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive and its value is Limit.default() when the argument 0', async () => {
      const superposition: Superposition<Limit, LimitError> = Limit.of(40);
      const schrodinger: Schrodinger<Limit, LimitError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Limit.default());
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', async () => {
      const limit1: Limit = await Limit.of(1).get();
      const limit2: Limit = await Limit.of(2).get();
      const limit3: Limit = await Limit.of(1).get();

      expect(limit1.equals(limit1)).toBe(true);
      expect(limit1.equals(limit2)).toBe(false);
      expect(limit1.equals(limit3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const num: number = 1;
      const limit: Limit = await Limit.of(num).get();

      expect(limit.toString()).toBe(num.toString());
    });
  });
});
