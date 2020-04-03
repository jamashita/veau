import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { Failure } from '../Failure';
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
    it('excuses success section', () => {
      const v1: number = 100;
      const success: Success<number, Error> = Success.of<number, Error>(v1);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: Try<string, Error> = success.complete<string, Error>((s: number) => {
        const c1: number = s ** 2;
        spy1(c1);
        return Success.of<string, Error>(c1.toString());
      }, (e: Error) => {
        spy2();
        return Failure.of<string, Error>(e);
      });

      const c2: number = v1 ** 2;
      expect(res.isSuccess()).toEqual(true);
      expect(res.get()).toEqual(c2.toString());
      expect(spy1.calledWith(c2)).toEqual(true);
      expect(spy2.called).toEqual(false);
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
