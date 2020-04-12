import sinon, { SinonSpy } from 'sinon';
import { ColumnError } from '../../Error/ColumnError';
import { Try } from '../../General/Try/Try';
import { Column } from '../Column';

describe('Column', () => {
  describe('of', () => {
    it('returns Failure when the argument is less than 0', () => {
      const trial1: Try<Column, ColumnError> = Column.of(0);
      const trial2: Try<Column, ColumnError> = Column.of(-1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial2.match<void>(() => {
        spy1();
      }, (err: ColumnError) => {
        spy2();
        expect(err).toBeInstanceOf(ColumnError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when the argument is not integer', () => {
      const trial1: Try<Column, ColumnError> = Column.of(0.1);
      const trial2: Try<Column, ColumnError> = Column.of(1.5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (err: ColumnError) => {
        spy2();
        expect(err).toBeInstanceOf(ColumnError);
      });

      trial2.match<void>(() => {
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
