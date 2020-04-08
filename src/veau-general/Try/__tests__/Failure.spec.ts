import sinon, { SinonSpy } from 'sinon';
import { MockError } from '../../MockError';
import { Failure } from '../Failure';

describe('Failure', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());

      expect(() => {
        failure.get();
      }).toThrow(MockError);
    });
  });

  describe('getError', () => {
    it('normal case', () => {
      const e1: MockError = new MockError();
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(e1);

      expect(failure.getError()).toBe(e1);
    });
  });

  describe('isSuccess', () => {
    it('always returns false', () => {
      const failure1: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());
      const failure2: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());

      expect(failure1.isSuccess()).toEqual(false);
      expect(failure2.isSuccess()).toEqual(false);
    });
  });

  describe('isFailure', () => {
    it('always returns true', () => {
      const failure1: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());
      const failure2: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());

      expect(failure1.isFailure()).toEqual(true);
      expect(failure2.isFailure()).toEqual(true);
    });
  });

  describe('match', () => {
    it('excuses failure block', () => {
      const e1: MockError = new MockError();
      const v1: number = 1234;
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(e1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = failure.match<number>((n: number) => {
        spy1();
        return n;
      }, (err: MockError) => {
        spy2();
        expect(err).toBe(e1);
        return v1 * 2;
      });

      expect(res).toEqual(v1 * 2);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
