import dayjs from 'dayjs';
import sinon, { SinonSpy } from 'sinon';
import { UpdatedAtError } from '../../Error/UpdatedAtError';
import { Try } from '../../General/Superposition/Try';
import { Zeit } from '../../General/Zeit/Zeit';
import { UpdatedAt } from '../UpdatedAt';

// DONE
describe('UpdatedAt', () => {
  describe('ofString', () => {
    it('returns Failure if the parameter is not date format', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<UpdatedAt, UpdatedAtError> = UpdatedAt.ofString('this is not date');

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: UpdatedAtError) => {
        spy2();
        expect(err).toBeInstanceOf(UpdatedAtError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('normal case', () => {
      const trial: Try<UpdatedAt, UpdatedAtError> = UpdatedAt.ofString('2000-01-01 00:00:00');

      expect(trial.isSuccess()).toEqual(true);
    });
  });

  describe('format', () => {
    it('returns YYYY-MM-DD HH:mm:ss', () => {
      expect(UpdatedAt.format()).toEqual('YYYY-MM-DD HH:mm:ss');
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const at1: UpdatedAt = UpdatedAt.of(Zeit.of(dayjs('2000-01-01 00:00:00'), 'YYYY-MM-DD HH:mm:ss'));
      const at2: UpdatedAt = UpdatedAt.of(Zeit.of(dayjs('2000-01-02 00:00:00'), 'YYYY-MM-DD HH:mm:ss'));
      const at3: UpdatedAt = UpdatedAt.of(Zeit.of(dayjs('2000-01-01 00:00:00'), 'YYYY-MM-DD HH:mm:ss'));

      expect(at1.equals(at1)).toEqual(true);
      expect(at1.equals(at2)).toEqual(false);
      expect(at1.equals(at3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const at: string = '2345-06-07 08:09:10';
      const updatedAt: UpdatedAt = UpdatedAt.ofString(at).get();

      expect(updatedAt.toString()).toEqual(at);
    });
  });
});
