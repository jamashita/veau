import sinon, { SinonSpy } from 'sinon';
import { MockError } from '../../Mock/MockError';
import { Failure } from '../Failure';
import { manoeuvre } from '../Manoeuvre';
import { Success } from '../Success';
import { Try } from '../Try';

describe('Manoeuvre', () => {
  describe('all', () => {
    it('all are Success', () => {
      const tries: Array<Try<number, MockError>> = [
        Success.of<number, MockError>(0),
        Success.of<number, MockError>(1),
        Success.of<number, MockError>(2)
      ];

      const values: Try<Array<number>, MockError> = manoeuvre<number, MockError>(tries);

      expect(values.isSuccess()).toEqual(true);
      const array: Array<number> = values.get();
      expect(array.length).toEqual(tries.length);
      for (let i: number = 0; i < array.length; i++) {
        expect(array[i]).toBe(tries[i].get());
      }
    });

    it('no tries', () => {
      const tries: Array<Try<number, MockError>> = [];

      const values: Try<Array<number>, MockError> = manoeuvre<number, MockError>(tries);

      expect(values.isSuccess()).toEqual(true);
      const array: Array<number> = values.get();
      expect(array.length).toEqual(tries.length);
    });

    it('contains Failure on first position', () => {
      const error: MockError = new MockError();
      const tries: Array<Try<number, MockError>> = [
        Failure.of<number, MockError>(error),
        Success.of<number, MockError>(1),
        Success.of<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Try<Array<number>, MockError> = manoeuvre<number, MockError>(tries);

      expect(values.isFailure()).toEqual(true);
      values.match<void>(() => {
        spy1();
      }, (err: MockError) => {
        spy2();
        expect(err).toBe(error);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains Failure on second position', () => {
      const error: MockError = new MockError();
      const tries: Array<Try<number, MockError>> = [
        Success.of<number, MockError>(0),
        Failure.of<number, MockError>(error),
        Success.of<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Try<Array<number>, MockError> = manoeuvre<number, MockError>(tries);

      expect(values.isFailure()).toEqual(true);
      values.match<void>(() => {
        spy1();
      }, (err: MockError) => {
        spy2();
        expect(err).toBe(error);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains Failure on last position', () => {
      const error: MockError = new MockError();
      const tries: Array<Try<number, MockError>> = [
        Success.of<number, MockError>(0),
        Success.of<number, MockError>(1),
        Failure.of<number, MockError>(error)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Try<Array<number>, MockError> = manoeuvre<number, MockError>(tries);

      expect(values.isFailure()).toEqual(true);
      values.match<void>(() => {
        spy1();
      }, (err: MockError) => {
        spy2();
        expect(err).toBe(error);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains more than 1 Failure, returns the first one', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const tries: Array<Try<number, MockError>> = [
        Failure.of<number, MockError>(error1),
        Failure.of<number, MockError>(error2),
        Success.of<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Try<Array<number>, MockError> = manoeuvre<number, MockError>(tries);

      expect(values.isFailure()).toEqual(true);
      values.match<void>(() => {
        spy1();
      }, (err: MockError) => {
        spy2();
        expect(err).toBe(error1);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains more than 1 Failure, returns the first one - 2', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const tries: Array<Try<number, MockError>> = [
        Failure.of<number, MockError>(error1),
        Success.of<number, MockError>(1),
        Failure.of<number, MockError>(error2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Try<Array<number>, MockError> = manoeuvre<number, MockError>(tries);

      expect(values.isFailure()).toEqual(true);
      values.match<void>(() => {
        spy1();
      }, (err: MockError) => {
        spy2();
        expect(err).toBe(error1);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains more than 1 Failure, returns the first one - 4', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const tries: Array<Try<number, MockError>> = [
        Failure.of<number, MockError>(error1),
        Failure.of<number, MockError>(error2),
        Failure.of<number, MockError>(error3)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Try<Array<number>, MockError> = manoeuvre<number, MockError>(tries);

      expect(values.isFailure()).toEqual(true);
      values.match<void>(() => {
        spy1();
      }, (err: MockError) => {
        spy2();
        expect(err).toBe(error1);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
