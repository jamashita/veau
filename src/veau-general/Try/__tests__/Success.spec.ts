import sinon, { SinonSpy } from 'sinon';
import { Success } from '../Success';

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

  describe('match', () => {
    it('excuses success block', () => {
      const v1: number = 100;
      const success: Success<number, Error> = Success.of<number, Error>(v1);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = success.match<number>((s: number) => {
        spy1(s);
        return s * 2;
      }, (err: Error) => {
        spy2(err);
        return v1 ** 2;
      });

      expect(res).toEqual(v1 * 2);
      expect(spy1.calledWith(v1)).toEqual(true);
      expect(spy2.called).toEqual(false);
    });
  });
});
