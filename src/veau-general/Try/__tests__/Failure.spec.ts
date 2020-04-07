import sinon, { SinonSpy } from 'sinon';
import { Failure } from '../Failure';
import { MockError } from '../MockError';

describe('Failure', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      const e: MockError = new MockError('test failed');
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(e);

      expect(() => {
        failure.get();
      }).toThrow(MockError);
    });
  });

  describe('isSuccess', () => {
    it('always returns false', () => {
      const failure1: Failure<number, Error> = Failure.of<number, Error>(new Error('failure'));
      const failure2: Failure<number, MockError> = Failure.of<number, MockError>(new MockError('failure'));

      expect(failure1.isSuccess()).toEqual(false);
      expect(failure2.isSuccess()).toEqual(false);
    });
  });

  describe('isFailure', () => {
    it('always returns true', () => {
      const failure1: Failure<number, Error> = Failure.of<number, Error>(new Error('failure'));
      const failure2: Failure<number, MockError> = Failure.of<number, MockError>(new MockError('failure'));

      expect(failure1.isFailure()).toEqual(true);
      expect(failure2.isFailure()).toEqual(true);
    });
  });

  describe('match', () => {
    it('excuses failure block', () => {
      const e1: MockError = new MockError('test failed');
      const v1: number = 1234;
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(e1);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = failure.match<number>((n: number) => {
        spy1();
        return n;
      }, (err: Error) => {
        spy2(err);
        return v1 * 2;
      });

      expect(res).toEqual(v1 * 2);
      expect(spy1.called).toEqual(false);
      expect(spy2.calledWith(e1)).toEqual(true);
    });
  });

  describe('getMessage', () => {
    it('normal case', () => {
      const message: string = 'los perros';
      const e1: MockError = new MockError(message);
      const failure: Failure<number, Error> = Failure.of<number, MockError>(e1);

      expect(failure.getMessage()).toEqual(message);
    });
  });
});
