import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { ColumnError } from '../../veau-error/ColumnError';
import { Try } from '../../veau-general/Try/Try';
import { Column } from '../Column';

describe('Column', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const column1: Try<Column, ColumnError> = Column.of(1);
      const column2: Try<Column, ColumnError> = Column.of(2);
      const column3: Try<Column, ColumnError> = Column.of(1);

      expect(column1.get().equals(column1.get())).toEqual(true);
      expect(column1.get().equals(column2.get())).toEqual(false);
      expect(column1.get().equals(column3.get())).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 1231;
      const column: Try<Column, ColumnError> = Column.of(num);

      expect(column.get().toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws ColumnError when the argument is less than 0', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const column1: Try<Column, ColumnError> = Column.of(0);
      const column2: Try<Column, ColumnError> = Column.of(-1);

      expect(column1.isSuccess()).toEqual(true);
      expect(column2.isFailure()).toEqual(true);

      column2.match<void>(() => {
        spy1();
      }, (e: ColumnError) => {
        spy2();
        expect(e).toBeInstanceOf(ColumnError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws ColumnError when the argument is not integer', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const column1: Try<Column, ColumnError> = Column.of(0.1);
      const column2: Try<Column, ColumnError> = Column.of(1.5);

      expect(column1.isFailure()).toEqual(true);
      expect(column2.isFailure()).toEqual(true);

      column1.match<void>(() => {
        spy1();
      }, (e: ColumnError) => {
        spy2();
        expect(e).toBeInstanceOf(ColumnError);
      });

      column2.match<void>(() => {
        spy3();
      }, (e: ColumnError) => {
        spy4();
        expect(e).toBeInstanceOf(ColumnError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });
});
