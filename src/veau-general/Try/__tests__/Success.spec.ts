import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { RuntimeError } from '../../RuntimeError';
import { Success } from '../Success';
import { Try } from '../Try';

describe('Success', () => {
  describe('get', () => {
    it('returns the inside value', () => {
      const v: string = 'the lazy fox';
      const success: Success<string, Error> = Success.of<string, Error>(v);

      expect(success.get()).toEqual(v);
    });
  });

  describe('isSuccess', () => {
    it('always returns true', () => {
      const success1: Success<number, Error> = Success.of<number, Error>(1);
      const success2: Success<string, Error> = Success.of<string, Error>('aiutare');

      expect(success1.isSuccess()).toEqual(true);
      expect(success2.isSuccess()).toEqual(true);
    });
  });

  describe('isFailure', () => {
    it('always returns false', () => {
      const success1: Success<number, Error> = Success.of<number, Error>(1);
      const success2: Success<string, Error> = Success.of<string, Error>('aiutare');

      expect(success1.isFailure()).toEqual(false);
      expect(success2.isFailure()).toEqual(false);
    });
  });

  describe('complete', () => {
    it('transforms containing value', () => {
      const v1: number = 100;
      const success: Success<number, Error> = Success.of<number, Error>(v1);
      const spy: SinonSpy = sinon.spy();

      const res: Try<string, Error> = success.complete<string>((s: number) => {
        const c1: number = s ** 2;
        spy(c1);
        return c1.toString();
      });

      const c2: number = v1 ** 2;
      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual(c2.toString());
      expect(spy.calledWith(c2)).toEqual(true);
    });
  });

  describe('recover', () => {
    it('does nothing', () => {
      const v1: number = 100;
      const success: Success<number, Error> = Success.of<number, Error>(v1);
      const spy: SinonSpy = sinon.spy();

      const res: Try<number, RuntimeError> = success.recover<RuntimeError>(() => {
        spy();
        return new RuntimeError('test failed');
      });

      expect(res.isSuccess()).toEqual(true);
      expect(spy.called).toEqual(false);
    });
  });

  describe('match', () => {
    it('excuses success block', () => {
      const v1: number = 100;
      const success: Success<number, Error> = Success.of<number, Error>(v1);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = success.match<number>((s: number) => {
        spy1(s);
        return s * 2;
      }, (e: Error) => {
        spy2(e);
        return v1 ** 2;
      });

      expect(res).toEqual(v1 * 2);
      expect(spy1.calledWith(v1)).toEqual(true);
      expect(spy2.called).toEqual(false);
    });
  });
});
