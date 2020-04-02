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
    it('excuses failure block', () => {
      const e1: Error = new Error();
      const v1: number = 2040;
      const failure: Failure<number, Error> = Failure.of<number, Error>(e1);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = failure.complete<number>((s: number) => {
        spy1(s);
        return v1;
      }, (e: Error) => {
        spy2(e);
        return v1 ** 2;
      });

      expect(res).toEqual(v1 ** 2);
      expect(spy1.called).toEqual(false);
      expect(spy2.calledWith(e1)).toEqual(true);
    });
  });

  describe('map', () => {
    it('retains error object', () => {
      const e1: Error = new Error();
      const failure1: Failure<number, Error> = Failure.of<number, Error>(e1);

      const failure2: Try<string, Error> = failure1.map<string>((n: number) => {
        return n.toString();
      });

      expect(failure1).not.toBe(failure2);
      try {
        failure2.get();
      }
      catch (e) {
        expect(e).toEqual(e1);
      }
    });
  });
});
