import sinon, { SinonSpy } from 'sinon';
import { MockError } from '../../Mock/MockError';
import { MySQLError } from '../../MySQL/MySQLError';
import { Failure } from '../Failure';

describe('Failure', () => {
  describe('of', () => {
    it('one generic call', () => {
      const failure: Failure<void, MockError> = Failure.of<MockError>(new MockError());

      expect(() => {
        failure.get();
      }).toThrow(MockError);
    });

    it('normal case', () => {
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());

      expect(() => {
        failure.get();
      }).toThrow(MockError);
    });
  });

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
      const error: MockError = new MockError();
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(error);

      expect(failure.getError()).toBe(error);
    });
  });

  describe('isSuccess', () => {
    it('always returns false', () => {
      const failure1: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());
      const failure2: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());

      expect(failure1.isSuccess()).toBe(false);
      expect(failure2.isSuccess()).toBe(false);
    });
  });

  describe('isFailure', () => {
    it('always returns true', () => {
      const failure1: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());
      const failure2: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());

      expect(failure1.isFailure()).toBe(true);
      expect(failure2.isFailure()).toBe(true);
    });
  });

  describe('match', () => {
    it('excuses failure block', () => {
      const error: MockError = new MockError();
      const value: number = 1234;
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(error);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = failure.match<number>((n: number) => {
        spy1();
        return n;
      }, (err: MockError, f: Failure<number, MockError>) => {
        spy2();
        expect(err).toBe(error);
        expect(f).toBe(failure);
        return value * 2;
      });

      expect(res).toBe(value * 2);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('transpose', () => {
    it('does nothing', () => {
      const success: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());

      expect(success.transpose<MySQLError>()).toBe(success);
    });
  });
});
