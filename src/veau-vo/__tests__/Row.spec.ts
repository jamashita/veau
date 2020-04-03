import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { RowError } from '../../veau-error/RowError';
import { Try } from '../../veau-general/Try/Try';
import { Row } from '../Row';

describe('Row', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const row1: Try<Row, RowError> = Row.of(1);
      const row2: Try<Row, RowError> = Row.of(2);
      const row3: Try<Row, RowError> = Row.of(1);

      expect(row1.get().equals(row1.get())).toEqual(true);
      expect(row1.get().equals(row2.get())).toEqual(false);
      expect(row1.get().equals(row3.get())).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const row: Try<Row, RowError> = Row.of(num);

      expect(row.get().toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws RowError when the argument is less than 0', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const row1: Try<Row, RowError> = Row.of(0);
      const row2: Try<Row, RowError> = Row.of(-1);

      expect(row1.isSuccess()).toEqual(true);
      expect(row2.isFailure()).toEqual(true);

      row2.match<void>(() => {
        spy1();
      }, (e: RowError) => {
        spy2();
        expect(e).toBeInstanceOf(RowError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throw RowError when the argument is not integer', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const row1: Try<Row, RowError> = Row.of(0.1);
      const row2: Try<Row, RowError> = Row.of(1.5);

      expect(row1.isFailure()).toEqual(true);
      expect(row2.isFailure()).toEqual(true);

      row1.match<void>(() => {
        spy1();
      }, (e: RowError) => {
        spy2();
        expect(e).toBeInstanceOf(RowError);
      });

      row2.match<void>(() => {
        spy3();
      }, (e: RowError) => {
        spy4();
        expect(e).toBeInstanceOf(RowError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });

  describe('default', () => {
    it('always gives 0 value', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(Row.default().get()).toEqual(0);
      }
    });
  });
});
