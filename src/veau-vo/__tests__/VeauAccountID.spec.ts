import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { VeauAccountIDError } from '../../veau-error/VeauAccountIDError';
import { Try } from '../../veau-general/Try/Try';
import { UUID } from '../../veau-general/UUID';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccountID', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const account1: VeauAccountID = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de').get();
      const account2: VeauAccountID = VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get();
      const account3: VeauAccountID = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de').get();

      expect(account1.equals(account1)).toEqual(true);
      expect(account1.equals(account2)).toEqual(false);
      expect(account1.equals(account3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const veauAccountID: VeauAccountID = VeauAccountID.of(id).get();

      expect(veauAccountID.get().toString()).toEqual(id);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const trial: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.of('cinq');

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: VeauAccountIDError) => {
        spy2();
        expect(err).toBeInstanceOf(VeauAccountIDError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(VeauAccountID.generate().get().length).toEqual(UUID.size());
      }
    });
  });
});
