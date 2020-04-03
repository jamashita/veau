import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { VeauAccountIDError } from '../../veau-error/VeauAccountIDError';
import { Try } from '../../veau-general/Try/Try';
import { UUID } from '../../veau-general/UUID';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccountID', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const account1: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');
      const account2: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9');
      const account3: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(account1.get().equals(account1.get())).toEqual(true);
      expect(account1.get().equals(account2.get())).toEqual(false);
      expect(account1.get().equals(account3.get())).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const veauAccountID: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.of(id);

      expect(veauAccountID.get().toString()).toEqual(id);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const veauAccountID: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.of('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(veauAccountID.isSuccess()).toEqual(true);
    });

    it('throws VeauAccountIDError when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const veauAccountID: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.of('cinq');

      expect(veauAccountID.isFailure()).toEqual(true);
      veauAccountID.match<void>(() => {
        spy1();
      }, (e: VeauAccountIDError) => {
        spy2();
        expect(e).toBeInstanceOf(VeauAccountIDError);
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
