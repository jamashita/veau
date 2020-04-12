import sinon, { SinonSpy } from 'sinon';
import { RowError } from '../../Error/RowError';
import { Try } from '../../General/Try/Try';
import { Row } from '../Row';

describe('Row', () => {
  describe('of', () => {
    it('returns Failure when the argument is less than 0', () => {
      const trial1: Try<Row, RowError> = Row.of(0);
      const trial2: Try<Row, RowError> = Row.of(-1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial2.match<void>(() => {
        spy1();
      }, (err: RowError) => {
        spy2();
        expect(err).toBeInstanceOf(RowError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when the argument is not integer', () => {
      const trial1: Try<Row, RowError> = Row.of(0.1);
      const trial2: Try<Row, RowError> = Row.of(1.5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (err: RowError) => {
        spy2();
        expect(err).toBeInstanceOf(RowError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (err: RowError) => {
        spy4();
        expect(err).toBeInstanceOf(RowError);
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

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const row1: Row = Row.of(1).get();
      const row2: Row = Row.of(2).get();
      const row3: Row = Row.of(1).get();

      expect(row1.equals(row1)).toEqual(true);
      expect(row1.equals(row2)).toEqual(false);
      expect(row1.equals(row3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const row: Row = Row.of(num).get();

      expect(row.toString()).toEqual(num.toString());
    });
  });
});