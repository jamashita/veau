import sinon, { SinonSpy } from 'sinon';

import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { Column } from '../Column';
import { ColumnError } from '../Error/ColumnError';

describe('Column', () => {
  describe('origin', () => {
    it('always returns 0', () => {
      expect(Column.origin().get()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(Column.origin()).toBe(Column.origin());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 0', async () => {
      const superposition1: Superposition<Column, ColumnError> = Column.of(-1);
      const superposition2: Superposition<Column, ColumnError> = Column.of(-2.1);
      const schrodinger1: Schrodinger<Column, ColumnError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Column, ColumnError> = await superposition2.terminate();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(schrodinger1.isDead()).toBe(true);
      expect(schrodinger2.isDead()).toBe(true);

      await superposition2.transform<void>(
        () => {
          spy1();
        },
        (err: ColumnError) => {
          spy2();
          expect(err).toBeInstanceOf(ColumnError);
        }
      ).terminate();

      await superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: ColumnError) => {
          spy4();
          expect(err).toBeInstanceOf(ColumnError);
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive and its value is Column.origin() when the argument 0', async () => {
      const superposition: Superposition<Column, ColumnError> = Column.of(0);
      const schrodinger: Schrodinger<Column, ColumnError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Column.origin());
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<Column, ColumnError> = Column.of(0.1);
      const superposition2: Superposition<Column, ColumnError> = Column.of(1.5);
      const schrodinger1: Schrodinger<Column, ColumnError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Column, ColumnError> = await superposition2.terminate();

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
        (err: ColumnError) => {
          spy2();
          expect(err).toBeInstanceOf(ColumnError);
        }
      ).terminate();

      await superposition2.transform<void>(
        () => {
          spy3();
        },
        (err: ColumnError) => {
          spy4();
          expect(err).toBeInstanceOf(ColumnError);
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
      const superposition1: Superposition<Column, ColumnError> = Column.of(value1);
      const superposition2: Superposition<Column, ColumnError> = Column.of(value2);
      const schrodinger1: Schrodinger<Column, ColumnError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Column, ColumnError> = await superposition2.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isAlive()).toBe(true);

      expect(schrodinger1.get()).toBe(value1);
      expect(schrodinger2.get()).toBe(value2);
    });
  });

  describe('isOrigin', () => {
    it('Column.origin() returns true', () => {
      expect(Column.origin().isOrigin()).toBe(true);
    });

    it('returns true when the value is 0, otherwise returns false', async () => {
      const column1: Column = await Column.of(0).get();
      const column2: Column = await Column.of(1).get();
      const column3: Column = await Column.of(2).get();

      expect(column1.isOrigin()).toBe(true);
      expect(column2.isOrigin()).toBe(false);
      expect(column3.isOrigin()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', async () => {
      const column1: Column = await Column.of(1).get();
      const column2: Column = await Column.of(2).get();
      const column3: Column = await Column.of(1).get();

      expect(column1.equals(column1)).toBe(true);
      expect(column1.equals(column2)).toBe(false);
      expect(column1.equals(column3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const num: number = 1231;
      const column: Column = await Column.of(num).get();

      expect(column.toString()).toBe(num.toString());
    });
  });
});
