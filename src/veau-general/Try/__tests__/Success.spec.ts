import sinon, { SinonSpy } from 'sinon';
import { Failure } from '../Failure';
import { MockError } from '../MockError';
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
    it('can chain methods', () => {
      const success: Success<number, MockError> = Success.of<number, MockError>(100);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<string, MockError> = success.complete<number>((s: number) => {
        spy1();
        return s * 2;
      }).complete<string>((s: number) => {
        spy2();
        return `${s}`
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual('200');
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
    });

    it('will not nothing when Failure is returned', () => {
      const success: Success<number, MockError> = Success.of<number, MockError>(100);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const res: Try<void, MockError> = success.complete<number>((s: number) => {
        spy1();
        return s * 2;
      }).complete<symbol>(() => {
        spy2();
        return Failure.of<symbol, MockError>(new MockError('test failed'));
      }).complete<void>(() => {
        spy3();
      });

      expect(res.isFailure()).toEqual(true);
      expect(() => {
        res.get();
      }).toThrow(MockError);
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
    });
  });

  describe('recover', () => {
    it('do not invoked', () => {
      const success: Success<number, MockError> = Success.of<number, MockError>(100);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<string, MockError> = success.recover<number>(() => {
        spy1();
        return 35469;
      }).complete<string>((s: number) => {
        spy2();
        return `${s}`
      });

      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual('100');
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('will not nothing when Failure is returned', () => {
      const success: Success<number, MockError> = Success.of<number, MockError>(100);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const res: Try<void, MockError> = success.complete<number>((s: number) => {
        spy1();
        return s * 2;
      }).recover<string>(() => {
        spy2();
        return '1';
      }).complete<void>((va) => {
        spy3();
        expect(va).toEqual(200);
      });

      expect(res.isSuccess()).toEqual(true);
      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
      expect(spy3.called).toEqual(true);
    });
  });
});
