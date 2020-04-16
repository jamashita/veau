import sinon, { SinonSpy } from 'sinon';
import { StatsIDError } from '../../Error/StatsIDError';
import { Superposition } from '../../General/Superposition/Superposition';
import { UUID } from '../../General/UUID/UUID';
import { StatsID } from '../StatsID';

// DONE
describe('StatsID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: string = '998106de-b2e7-4981-9643-22cd30cd74de';

      const statsID: StatsID = StatsID.of(UUID.of(uuid));

      expect(statsID.get().get()).toEqual(uuid);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const superposition: Superposition<StatsID, StatsIDError> = StatsID.ofString('db9c9de2-1fc6-4072-8348-b8894239b2b0');

      expect(superposition.isSuccess()).toEqual(true);
    });

    it('returns Failure when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsID, StatsIDError> = StatsID.ofString('trois');

      expect(superposition.isFailure()).toEqual(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsIDError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsIDError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(StatsID.generate().get().get().length).toEqual(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const statsID1: StatsID = StatsID.ofString('db9c9de2-1fc6-4072-8348-b8894239b2b0').get();
      const statsID2: StatsID = StatsID.ofString('b5203963-d996-40a7-9adb-f05ea9524af0').get();
      const statsID3: StatsID = StatsID.ofString('db9c9de2-1fc6-4072-8348-b8894239b2b0').get();

      expect(statsID1.equals(statsID1)).toEqual(true);
      expect(statsID1.equals(statsID2)).toEqual(false);
      expect(statsID1.equals(statsID3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
      const statsID: StatsID = StatsID.ofString(uuid).get();

      expect(statsID.get().toString()).toEqual(uuid);
    });
  });
});
