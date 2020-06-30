import sinon, { SinonSpy } from 'sinon';

import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { RowError } from '../Error/RowError';
import { Row } from '../Row';

describe('Row', () => {
  describe('origin', () => {
    it('always returns 0', () => {
      expect(Row.origin().get()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(Row.origin()).toBe(Row.origin());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 0', async () => {
      const superposition1: Superposition<Row, RowError> = Row.of(-1);
      const superposition2: Superposition<Row, RowError> = Row.of(-2.1);
      const schrodinger1: Schrodinger<Row, RowError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Row, RowError> = await superposition2.terminate();

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
        (err: RowError) => {
          spy2();
          expect(err).toBeInstanceOf(RowError);
        }
      ).terminate();

      await superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: RowError) => {
          spy4();
          expect(err).toBeInstanceOf(RowError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive and its value is Row.origin() when the argument 0', async () => {
      const superposition: Superposition<Row, RowError> = Row.of(0);
      const schrodinger: Schrodinger<Row, RowError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Row.origin());
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<Row, RowError> = Row.of(0.1);
      const superposition2: Superposition<Row, RowError> = Row.of(1.5);
      const schrodinger1: Schrodinger<Row, RowError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Row, RowError> = await superposition2.terminate();

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
        (err: RowError) => {
          spy2();
          expect(err).toBeInstanceOf(RowError);
        }
      ).terminate();

      await superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: RowError) => {
          spy4();
          expect(err).toBeInstanceOf(RowError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive when the argument is positive and integer', async () => {
      const value1: number = 31;
      const value2: number = 101;
      const superposition1: Superposition<Row, RowError> = Row.of(value1);
      const superposition2: Superposition<Row, RowError> = Row.of(value2);
      const schrodinger1: Schrodinger<Row, RowError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Row, RowError> = await superposition2.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isAlive()).toBe(true);

      expect(schrodinger1.get()).toBe(value1);
      expect(schrodinger2.get()).toBe(value2);
    });
  });

  describe('isOrigin', () => {
    it('Row.origin() returns true', () => {
      expect(Row.origin().isOrigin()).toBe(true);
    });

    it('returns true when the value is 0, otherwise returns false', async () => {
      const row1: Row = await Row.of(0).get();
      const row2: Row = await Row.of(1).get();
      const row3: Row = await Row.of(2).get();

      expect(row1.isOrigin()).toBe(true);
      expect(row2.isOrigin()).toBe(false);
      expect(row3.isOrigin()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', async () => {
      const row1: Row = await Row.of(1).get();
      const row2: Row = await Row.of(2).get();
      const row3: Row = await Row.of(1).get();

      expect(row1.equals(row1)).toBe(true);
      expect(row1.equals(row2)).toBe(false);
      expect(row1.equals(row3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const num: number = 2;
      const row: Row = await Row.of(num).get();

      expect(row.toString()).toBe(num.toString());
    });
  });
});
