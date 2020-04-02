import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { RuntimeError } from '../../RuntimeError';
import { Failure } from '../Failure';
import { Try } from '../Try';

describe('Failure', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      const e: RuntimeError = new RuntimeError('test failed');
      const failure: Failure<number, RuntimeError> = Failure.of<number, RuntimeError>(e);

      expect(() => {
        failure.get();
      }).toThrow(RuntimeError);
    });
  });

  describe('isSuccess', () => {
    it('always returns false', () => {
      const failure1: Failure<number, Error> = Failure.of<number, Error>(new Error('failure'));
      const failure2: Failure<number, RuntimeError> = Failure.of<number, RuntimeError>(new RuntimeError('failure'));

      expect(failure1.isSuccess()).toEqual(false);
      expect(failure2.isSuccess()).toEqual(false);
    });
  });

  describe('isFailure', () => {
    it('always returns true', () => {
      const failure1: Failure<number, Error> = Failure.of<number, Error>(new Error('failure'));
      const failure2: Failure<number, RuntimeError> = Failure.of<number, RuntimeError>(new RuntimeError('failure'));

      expect(failure1.isFailure()).toEqual(true);
      expect(failure2.isFailure()).toEqual(true);
    });
  });

  describe('complete', () => {
    it('does nothing', () => {
      const e1: Error = new Error();
      const v1: number = 2040;
      const failure: Failure<number, Error> = Failure.of<number, Error>(e1);
      const spy: SinonSpy = sinon.spy();

      const res: Try<number, Error> = failure.complete<number>((s: number): number => {
        spy();
        return s ** 3;
      });

      expect(res.isFailure()).toEqual(true);
      expect(spy.called).toEqual(false);
    });
  });

  describe('recover', () => {
    it('transforms containing value', () => {
      const e1: Error = new Error();
      const failure: Failure<number, Error> = Failure.of<number, Error>(e1);
      const spy: SinonSpy = sinon.spy();

      const res: Try<number, RuntimeError> = failure.recover<RuntimeError>((e: Error): RuntimeError => {
        spy(e);
        return new RuntimeError('test failed');
      });

      expect(res.isFailure()).toEqual(true);
      expect(() => {
        res.get();
      }).toThrow(RuntimeError);
      expect(spy.calledWith(e1)).toEqual(true);
    });
  });

  describe('match', () => {
    it('excuses failure block', () => {
      const e1: Error = new Error();
      const v1: number = 1234;
      const failure: Failure<number, Error> = Failure.of<number, Error>(e1);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = failure.match<number>((n: number): number => {
        spy1();
        return n;
      }, (e: Error) => {
        spy2(e);
        return v1 * 2;
      });

      expect(res).toEqual(v1 * 2);
      expect(spy1.called).toEqual(false);
      expect(spy2.calledWith(e1)).toEqual(true);
    });
  });
});
