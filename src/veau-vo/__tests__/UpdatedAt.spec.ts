import 'jest';
import moment from 'moment';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { UpdatedAtError } from '../../veau-error/UpdatedAtError';
import { Try } from '../../veau-general/Try/Try';
import { UpdatedAt } from '../UpdatedAt';

describe('UpdatedAt', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const at1: UpdatedAt = UpdatedAt.of(moment('2000-01-01 00:00:00'));
      const at2: UpdatedAt = UpdatedAt.of(moment('2000-01-02 00:00:00'));
      const at3: UpdatedAt = UpdatedAt.of(moment('2000-01-01 00:00:00'));

      expect(at1.equals(at1)).toEqual(true);
      expect(at1.equals(at2)).toEqual(false);
      expect(at1.equals(at3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const at: string = '2000-01-01 00:01:02';
      const updatedAt: UpdatedAt = UpdatedAt.ofString(at).get();

      expect(updatedAt.toString()).toEqual(at);
    });
  });

  describe('ofString', () => {
    it('throws UpdatedAtError if the parameter is not date format', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<UpdatedAt, UpdatedAtError> = UpdatedAt.ofString('this is not date');

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: UpdatedAtError) => {
        spy2();
        expect(e).toBeInstanceOf(UpdatedAtError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('normal case', () => {
      const trial: Try<UpdatedAt, UpdatedAtError> = UpdatedAt.ofString('2000-01-01 00:00:00');

      expect(trial.isSuccess()).toEqual(true);
    });
  });

  describe('now', () => {
    it('returns current utc time', () => {
      const stub: SinonStub = sinon.stub();
      moment.utc = stub;
      stub.returns(moment('2000-01-01 00:00:00'));

      expect(UpdatedAt.now().toString()).toEqual('2000-01-01 00:00:00');
    });
  });
});
