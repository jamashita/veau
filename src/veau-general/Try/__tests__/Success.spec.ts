import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { Success } from '../Success';
import { Try } from '../Try';

describe('Success', () => {
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
    it('excuses success block', () => {
      const v1: number = 100;
      const success: Success<number, Error> = Success.of<number, Error>(v1);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = success.complete<number>((s: number) => {
        spy1(s);
        return s;
      }, (e: Error) => {
        spy2(e);
        return v1 ** 2;
      });

      expect(res).toEqual(v1);
      expect(spy1.calledWith(v1)).toEqual(true);
      expect(spy2.called).toEqual(false);
    });
  });

  describe('filter', () => {
    it('returns self if the predicate returns true', () => {
      const v1: number = 100;
      const success: Success<number, Error> = Success.of<number, Error>(v1);

      const trial: Try<number, Error> = success.filter(() => {
        return true;
      });

      expect(success).toEqual(trial);
    });

    it('returns Failure if the predicate returns false', () => {
      const v1: number = 100;
      const success: Success<number, Error> = Success.of<number, Error>(v1);

      const trial: Try<number, Error> = success.filter(() => {
        return false;
      });

      expect(trial.isFailure()).toEqual(true);
    });
  });

  describe('map', () => {
    it('successfully mapped into a next one', () => {
      const v1: number = 100;
      const success1: Success<number, Error> = Success.of<number, Error>(v1);

      const success2: Try<string, Error> = success1.map<string>((v: number) => {
        return v.toString();
      });

      expect(success1).not.toEqual(success2);
      expect(success2.get()).toEqual(v1.toString());
    });
  });
});
