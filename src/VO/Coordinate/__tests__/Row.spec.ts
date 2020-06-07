import sinon, { SinonSpy } from 'sinon';

import { Superposition } from '@jamashita/publikum-monad';

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
    it('returns Dead when the argument is less than 0', () => {
      const superposition1: Superposition<Row, RowError> = Row.of(-1);
      const superposition2: Superposition<Row, RowError> = Row.of(-2.1);

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
        (err: RowError) => {
          spy2();
          expect(err).toBeInstanceOf(RowError);
        }
      );

      superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: RowError) => {
          spy4();
          expect(err).toBeInstanceOf(RowError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive and its value is Row.origin() when the argument 0', () => {
      const superposition: Superposition<Row, RowError> = Row.of(0);

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(Row.origin());
    });

    it('returns Dead when the argument is not integer', () => {
      const superposition1: Superposition<Row, RowError> = Row.of(0.1);
      const superposition2: Superposition<Row, RowError> = Row.of(1.5);

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
        (err: RowError) => {
          spy2();
          expect(err).toBeInstanceOf(RowError);
        }
      );

      superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: RowError) => {
          spy4();
          expect(err).toBeInstanceOf(RowError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive when the argument is positive and integer', () => {
      const value1: number = 31;
      const value2: number = 101;
      const superposition1: Superposition<Row, RowError> = Row.of(value1);
      const superposition2: Superposition<Row, RowError> = Row.of(value2);

      expect(superposition1.isAlive()).toBe(true);
      expect(superposition2.isAlive()).toBe(true);

      expect(superposition1.get().get()).toBe(value1);
      expect(superposition2.get().get()).toBe(value2);
    });
  });

  describe('isOrigin', () => {
    it('Row.origin() returns true', () => {
      expect(Row.origin().isOrigin()).toBe(true);
    });

    it('returns true when the value is 0, otherwise returns false', () => {
      const row1: Row = Row.of(0).get();
      const row2: Row = Row.of(1).get();
      const row3: Row = Row.of(2).get();

      expect(row1.isOrigin()).toBe(true);
      expect(row2.isOrigin()).toBe(false);
      expect(row3.isOrigin()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const row1: Row = Row.of(1).get();
      const row2: Row = Row.of(2).get();
      const row3: Row = Row.of(1).get();

      expect(row1.equals(row1)).toBe(true);
      expect(row1.equals(row2)).toBe(false);
      expect(row1.equals(row3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const row: Row = Row.of(num).get();

      expect(row.toString()).toBe(num.toString());
    });
  });
});
