import sinon, { SinonSpy } from 'sinon';
import { MockError } from '../../MockError';
import { MySQLError } from '../../MySQL/MySQLError';
import { Success } from '../Success';

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

      const res: number = success.match<number>((s: number, t: Success<number, MockError>) => {
        spy1();
        expect(t).toBe(success);
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

  describe('transpose', () => {
    it('does nothing', () => {
      const success: Success<number, MockError> = Success.of<number, MockError>(100);

      expect(success.transpose<MySQLError>()).toBe(success);
    });
  });
});
