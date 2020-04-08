import sinon, { SinonSpy } from 'sinon';
import { Failure } from '../Failure';
import { Success } from '../Success';
import { Try } from '../Try';
import { tryAll } from '../TryAll';

describe('Try', () => {
  describe('all', () => {
    it('all are Success', () => {
      const tries: Array<Try<number, Error>> = [
        Success.of<number, Error>(0),
        Success.of<number, Error>(1),
        Success.of<number, Error>(2)
      ];

      const ret: Try<Array<number>, Error> = tryAll<number, Error>(tries);

      expect(ret.isSuccess()).toEqual(true);
      const array: Array<number> = ret.get();
      expect(array.length).toEqual(tries.length);
      for (let i: number = 0; i < array.length; i++) {
        expect(array[i]).toEqual(tries[i].get());
      }
    });

    it('no tries', () => {
      const tries: Array<Try<number, Error>> = [
      ];

      const ret: Try<Array<number>, Error> = tryAll<number, Error>(tries);

      expect(ret.isSuccess()).toEqual(true);
      const array: Array<number> = ret.get();
      expect(array.length).toEqual(tries.length);
    });

    it('contains Failure on first position', () => {
      const error: Error = new Error();
      const tries: Array<Try<number, Error>> = [
        Failure.of<number, Error>(error),
        Success.of<number, Error>(1),
        Success.of<number, Error>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const ret: Try<Array<number>, Error> = tryAll<number, Error>(tries);

      expect(ret.isFailure()).toEqual(true);
      ret.match<void>(() => {
        spy1();
      }, (err: Error) => {
        spy2();
        expect(err).toBe(error);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains Failure on second position', () => {
      const error: Error = new Error();
      const tries: Array<Try<number, Error>> = [
        Success.of<number, Error>(0),
        Failure.of<number, Error>(error),
        Success.of<number, Error>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const ret: Try<Array<number>, Error> = tryAll<number, Error>(tries);

      expect(ret.isFailure()).toEqual(true);
      ret.match<void>(() => {
        spy1();
      }, (err: Error) => {
        spy2();
        expect(err).toBe(error);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains Failure on last position', () => {
      const error: Error = new Error();
      const tries: Array<Try<number, Error>> = [
        Success.of<number, Error>(0),
        Success.of<number, Error>(1),
        Failure.of<number, Error>(error)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const ret: Try<Array<number>, Error> = tryAll<number, Error>(tries);

      expect(ret.isFailure()).toEqual(true);
      ret.match<void>(() => {
        spy1();
      }, (err: Error) => {
        spy2();
        expect(err).toBe(error);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains more than 1 Failure, returns the first one', () => {
      const error1: Error = new Error();
      const error2: Error = new Error();
      const tries: Array<Try<number, Error>> = [
        Failure.of<number, Error>(error1),
        Failure.of<number, Error>(error2),
        Success.of<number, Error>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const ret: Try<Array<number>, Error> = tryAll<number, Error>(tries);

      expect(ret.isFailure()).toEqual(true);
      ret.match<void>(() => {
        spy1();
      }, (err: Error) => {
        spy2();
        expect(err).toBe(error1);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains more than 1 Failure, returns the first one - 2', () => {
      const error1: Error = new Error();
      const error2: Error = new Error();
      const tries: Array<Try<number, Error>> = [
        Failure.of<number, Error>(error1),
        Success.of<number, Error>(1),
        Failure.of<number, Error>(error2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const ret: Try<Array<number>, Error> = tryAll<number, Error>(tries);

      expect(ret.isFailure()).toEqual(true);
      ret.match<void>(() => {
        spy1();
      }, (err: Error) => {
        spy2();
        expect(err).toBe(error1);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains more than 1 Failure, returns the first one - 4', () => {
      const error1: Error = new Error();
      const error2: Error = new Error();
      const error3: Error = new Error();
      const tries: Array<Try<number, Error>> = [
        Failure.of<number, Error>(error1),
        Failure.of<number, Error>(error2),
        Failure.of<number, Error>(error3)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const ret: Try<Array<number>, Error> = tryAll<number, Error>(tries);

      expect(ret.isFailure()).toEqual(true);
      ret.match<void>(() => {
        spy1();
      }, (err: Error) => {
        spy2();
        expect(err).toBe(error1);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
