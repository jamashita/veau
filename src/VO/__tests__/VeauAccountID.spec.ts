import sinon, { SinonSpy } from 'sinon';
import { VeauAccountIDError } from '../../Error/VeauAccountIDError';
import { Try } from '../../General/Try/Try';
import { UUID } from '../../General/UUID/UUID';
import { VeauAccountID } from '../VeauAccountID';

// DONE
describe('VeauAccountID', () => {
  describe('ofString', () => {
    it('normal case', () => {
      const uuid: string = '998106de-b2e7-4981-9643-22cd30cd74de';

      const veauAccountID: VeauAccountID = VeauAccountID.of(UUID.of(uuid));

      expect(veauAccountID.get().get()).toEqual(uuid);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const trial: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.ofString('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<VeauAccountID, VeauAccountIDError> = VeauAccountID.ofString('cinq');

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
        expect(VeauAccountID.generate().get().get().length).toEqual(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const veauAccountID1: VeauAccountID = VeauAccountID.ofString('998106de-b2e7-4981-9643-22cd30cd74de').get();
      const veauAccountID2: VeauAccountID = VeauAccountID.ofString('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get();
      const veauAccountID3: VeauAccountID = VeauAccountID.ofString('998106de-b2e7-4981-9643-22cd30cd74de').get();

      expect(veauAccountID1.equals(veauAccountID1)).toEqual(true);
      expect(veauAccountID1.equals(veauAccountID2)).toEqual(false);
      expect(veauAccountID1.equals(veauAccountID3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const veauAccountID: VeauAccountID = VeauAccountID.ofString(id).get();

      expect(veauAccountID.get().toString()).toEqual(id);
    });
  });
});
