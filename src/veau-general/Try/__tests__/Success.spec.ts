import sinon, { SinonSpy } from 'sinon';
import { MockError } from '../../MockError';
import { MySQLError } from '../../MySQL/MySQLError';
import { Failure } from '../Failure';
import { Success } from '../Success';
import { Try } from '../Try';

describe('Success', () => {
  describe('get', () => {
    it('returns the inside value', () => {
      const v: string = 'the lazy fox';
      const success: Success<string, MockError> = Success.of<string, MockError>(v);

      expect(success.get()).toEqual(v);
    });
  });

  describe('isSuccess', () => {
    it('always returns true', () => {
      const v1: number = 1;
      const v2: string = 'aiutare';
      const success1: Success<number, MockError> = Success.of<number, MockError>(v1);
      const success2: Success<string, MockError> = Success.of<string, MockError>(v2);

      expect(success1.isSuccess()).toEqual(true);
      expect(success1.get()).toEqual(v1);
      expect(success2.isSuccess()).toEqual(true);
      expect(success2.get()).toEqual(v2);
    });
  });

  describe('isFailure', () => {
    it('always returns false', () => {
      const success1: Success<number, MockError> = Success.of<number, MockError>(1);
      const success2: Success<string, MockError> = Success.of<string, MockError>('aiutare');

      expect(success1.isFailure()).toEqual(false);
      expect(success2.isFailure()).toEqual(false);
    });
  });

  describe('match', () => {
    it('excuses success block', () => {
      const v1: number = 100;
      const success: Success<number, MockError> = Success.of<number, MockError>(v1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = success.match<number>((s: number) => {
        spy1();
        return s * 2;
      }, () => {
        spy2();
        return v1 ** 2;
      });

      expect(res).toEqual(v1 * 2);
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
    });
  });

  describe('complete', () => {
    it('can chain', () => {
      const v1: number = 100;
      const success: Success<number, MockError> = Success.of<number, MockError>(v1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<string | number, MockError> = success.complete<string>((s: number, t: Success<number, MockError>) => {
        spy1();
        expect(s).toEqual(v1);
        expect(t).toBe(success);
        return `${s * 2}`;
      }).complete<number>((s: number | string) => {
        spy2();
        expect(s).toEqual('200');

        return Number(s);
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual(v1 * 2);
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
    });

    it('if it returns Success in the complete context, next one can be invoked', () => {
      const v1: number = 100;
      const v2: number = 200;
      const success1: Success<number, MockError> = Success.of<number, MockError>(v1);
      const success2: Success<number, MockError> = Success.of<number, MockError>(v2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<string | number, MockError> = success1.complete<number>((s: number) => {
        spy1();
        expect(s).toEqual(v1);
        return success2;
      }).complete<string>((s: number, t: Success<number, MockError>) => {
        spy2();
        expect(s).toEqual(v2);
        expect(t).toBe(success2);

        return `${s}`;
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual('200');
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
    });

    it('if it returns Failure in the complete context, next one cannot be invoked', () => {
      const v1: number = 100;
      const success: Success<number, MockError> = Success.of<number, MockError>(v1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<number, MockError> = success.complete<number>((s: number) => {
        spy1();
        expect(s).toEqual(v1);
        return Failure.of<number, MockError>(new MockError());
      }).complete<number>((s: number) => {
        spy2();
        return Number(s);
      });

      expect(res.isFailure()).toEqual(true);
      expect(() => {
        res.get();
      }).toThrow(MockError);
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
    });
  });

  describe('recover', () => {
    it('does nothing', () => {
      const v1: number = 100;
      const success: Success<number, MockError> = Success.of<number, MockError>(v1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<number, MockError> = success.recover<number>(() => {
        spy1();
        return v1 ** 2;
      }).complete<number>((s: number) => {
        spy2();
        expect(s).toEqual(v1);

        return s * 2;
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual(v1 * 2);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('transpose', () => {
    it('does nothing', () => {
      const success: Success<number, MockError> = Success.of<number, MockError>(100);

      expect(success.transpose<MySQLError>()).toBe(success);
    });
  });
});
