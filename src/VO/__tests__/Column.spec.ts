import sinon, { SinonSpy } from 'sinon';
import { ColumnError } from '../../Error/ColumnError';
import { Superposition } from '../../General/Superposition/Superposition';
import { Column } from '../Column';

// DONE
describe('Column', () => {
  describe('origin', () => {
    it('always returns 0', () => {
      expect(Column.origin().get()).toEqual(0);
    });

    it('returns singleton instance', () => {
      expect(Column.origin()).toBe(Column.origin());
    });
  });

  describe('of', () => {
    it('returns Failure when the argument is less than 0', () => {
      const superposition1: Superposition<Column, ColumnError> = Column.of(-1);
      const superposition2: Superposition<Column, ColumnError> = Column.of(-2.1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isFailure()).toEqual(true);
      expect(superposition2.isFailure()).toEqual(true);

      superposition2.match<void>(() => {
        spy1();
      }, (err: ColumnError) => {
        spy2();
        expect(err).toBeInstanceOf(ColumnError);
      });

      superposition2.match<void>(() => {
        spy3();
      }, (err: ColumnError) => {
        spy4();
        expect(err).toBeInstanceOf(ColumnError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });

    it('returns Success and its value is Column.origin() when the argument 0', () => {
      const superposition: Superposition<Column, ColumnError> = Column.of(0);

      expect(superposition.isSuccess()).toEqual(true);
      expect(superposition.get()).toBe(Column.origin());
    });

    it('returns Failure when the argument is not integer', () => {
      const superposition1: Superposition<Column, ColumnError> = Column.of(0.1);
      const superposition2: Superposition<Column, ColumnError> = Column.of(1.5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isFailure()).toEqual(true);
      expect(superposition2.isFailure()).toEqual(true);

      superposition1.match<void>(() => {
        spy1();
      }, (err: ColumnError) => {
        spy2();
        expect(err).toBeInstanceOf(ColumnError);
      });

      superposition2.match<void>(() => {
        spy3();
      }, (err: ColumnError) => {
        spy4();
        expect(err).toBeInstanceOf(ColumnError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });

    it('returns Success when the argument is positive and integer', () => {
      const value1: number = 31;
      const value2: number = 101;
      const superposition1: Superposition<Column, ColumnError> = Column.of(value1);
      const superposition2: Superposition<Column, ColumnError> = Column.of(value2);

      expect(superposition1.isSuccess()).toEqual(true);
      expect(superposition2.isSuccess()).toEqual(true);

      expect(superposition1.get().get()).toEqual(value1);
      expect(superposition2.get().get()).toEqual(value2);
    });
  });

  describe('isOrigin', () => {
    it('Column.origin() returns true', () => {
      expect(Column.origin().isOrigin()).toEqual(true);
    });

    it('returns true when the value is 0, otherwise returns false', () => {
      const column1: Column = Column.of(0).get();
      const column2: Column = Column.of(1).get();
      const column3: Column = Column.of(2).get();

      expect(column1.isOrigin()).toEqual(true);
      expect(column2.isOrigin()).toEqual(false);
      expect(column3.isOrigin()).toEqual(false);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const column1: Column = Column.of(1).get();
      const column2: Column = Column.of(2).get();
      const column3: Column = Column.of(1).get();

      expect(column1.equals(column1)).toEqual(true);
      expect(column1.equals(column2)).toEqual(false);
      expect(column1.equals(column3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 1231;
      const column: Column = Column.of(num).get();

      expect(column.toString()).toEqual(num.toString());
    });
  });
});
