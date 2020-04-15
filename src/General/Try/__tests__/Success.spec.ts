import sinon, { SinonSpy } from 'sinon';
import { MockError } from '../../Mock/MockError';
import { MySQLError } from '../../MySQL/MySQLError';
import { Success } from '../Success';

describe('Success', () => {
  describe('of', () => {
    it('no argument call', () => {
      const success: Success<void, MockError> = Success.of<MockError>();

      expect(success.get()).toEqual(undefined);
    });

    it('normal case', () => {
      const value: number = 113;
      const success: Success<number, MockError> = Success.of<number, MockError>(value);

      expect(success.get()).toEqual(value);
    });
  });

  describe('get', () => {
    it('returns the inside value', () => {
      const value: string = 'the lazy fox';
      const success: Success<string, MockError> = Success.of<string, MockError>(value);

      expect(success.get()).toEqual(value);
    });
  });

  describe('isSuccess', () => {
    it('always returns true', () => {
      const value1: number = 1;
      const value2: string = 'aiutare';
      const success1: Success<number, MockError> = Success.of<number, MockError>(value1);
      const success2: Success<string, MockError> = Success.of<string, MockError>(value2);

      expect(success1.isSuccess()).toEqual(true);
      expect(success1.get()).toEqual(value1);
      expect(success2.isSuccess()).toEqual(true);
      expect(success2.get()).toEqual(value2);
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
      const value: number = 100;
      const success: Success<number, MockError> = Success.of<number, MockError>(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = success.match<number>((n: number, s: Success<number, MockError>) => {
        spy1();
        expect(n).toEqual(value);
        expect(s).toBe(success);
        return n * 2;
      }, () => {
        spy2();
        return value ** 2;
      });

      expect(res).toEqual(value * 2);
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
