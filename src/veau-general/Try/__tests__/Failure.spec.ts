import sinon, { SinonSpy } from 'sinon';
import { MockError } from '../../MockError';
import { MySQLError } from '../../MySQL/MySQLError';
import { Failure } from '../Failure';
import { Success } from '../Success';
import { Try } from '../Try';

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

  describe('complete', () => {
    it('does nothing', () => {
      const v1: number = 2500;
      const e1: MockError = new MockError();
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(e1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<number | string, MockError> = failure.complete<string>(() => {
        spy1();
        return '100';
      }).recover<number>((err: MockError) => {
        spy2();
        expect(err).toEqual(e1);

        return v1;
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual(v1);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('recover', () => {
    it('can chain', () => {
      const v1: number = 2500;
      const e1: MockError = new MockError();
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(e1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<string | number, MockError> = failure.recover<string>((err: MockError) => {
        spy1();
        expect(err).toEqual(e1);
        return `${v1 / 100}`;
      }).complete<number>((f: number | string) => {
        spy2();
        expect(f).toEqual('25');

        return Number(f);
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual(v1 / 100);
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
    });

    it('if it returns Success in the complete context, next one can be invoked', () => {
      const v1: number = 200;
      const e1: MockError = new MockError();
      const failure: Failure<number, MockError> = Failure.of<number, MockError>(e1);
      const success: Success<number, MockError> = Success.of<number, MockError>(v1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<string | number, MockError> = failure.recover<number>(() => {
        spy1();
        return success;
      }).complete<string>((f: number, t: Success<number, MockError>) => {
        spy2();
        expect(f).toEqual(v1);
        expect(t).toBe(success);

        return `${f}`;
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual('200');
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
    });

    it('if it returns Failure in the complete context, next one cannot be invoked', () => {
      const v1: number = 2500;
      const e1: MockError = new MockError();
      const e2: MockError = new MockError();
      const failure1: Failure<number, MockError> = Failure.of<number, MockError>(e1);
      const failure2: Failure<number, MockError> = Failure.of<number, MockError>(e2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<number, MockError> = failure1.recover<number>(() => {
        spy1();
        return failure2
      }).complete<number>(() => {
        spy2();
        return v1;
      });

      expect(res.isFailure()).toEqual(true);
      expect(() => {
        res.get();
      }).toThrow(MockError);
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
    });

    it('Failure chain', () => {
      const v1: number = 250;
      const e1: MockError = new MockError();
      const e2: MockError = new MockError();
      const failure1: Failure<number, MockError> = Failure.of<number, MockError>(e1);
      const failure2: Failure<number, MockError> = Failure.of<number, MockError>(e2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<number, MockError> = failure1.recover<number>(() => {
        spy1();
        return failure2;
      }).recover<number>((f: MockError, t: Failure<number, MockError>) => {
        spy2();
        expect(t).toBe(failure2);
        return v1;
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual(v1);
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('transpose', () => {
    it('does nothing', () => {
      const success: Failure<number, MockError> = Failure.of<number, MockError>(new MockError());

      expect(success.transpose<MySQLError>()).toBe(success);
    });
  });
});
