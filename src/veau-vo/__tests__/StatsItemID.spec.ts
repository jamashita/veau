import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { StatsItemIDError } from '../../veau-error/StatsItemIDError';
import { Try } from '../../veau-general/Try/Try';
import { UUID } from '../../veau-general/UUID';
import { StatsItemID } from '../StatsItemID';

describe('StatsItemID', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
      const uuid2: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
      const statsItemID1: Try<StatsItemID, StatsItemIDError> = StatsItemID.of(uuid1);
      const statsItemID2: Try<StatsItemID, StatsItemIDError> = StatsItemID.of(uuid2);
      const statsItemID3: Try<StatsItemID, StatsItemIDError> = StatsItemID.of(uuid1);

      expect(statsItemID1.get().equals(statsItemID1.get())).toEqual(true);
      expect(statsItemID1.get().equals(statsItemID2.get())).toEqual(false);
      expect(statsItemID1.get().equals(statsItemID3.get())).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
      const statsItemID: Try<StatsItemID, StatsItemIDError> = StatsItemID.of(uuid);

      expect(statsItemID.get().toString()).toEqual(uuid);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const uuid: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
      const statsItemID: Try<StatsItemID, StatsItemIDError> = StatsItemID.of(uuid);

      expect(statsItemID.isSuccess()).toEqual(true);
    });

    it('throws StatsItemIDError when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsItemID: Try<StatsItemID, StatsItemIDError> = StatsItemID.of('quatre');

      expect(statsItemID.isFailure()).toEqual(true);
      statsItemID.match<void>(() => {
        spy1();
      }, (e: StatsItemIDError) => {
        spy2();
        expect(e).toBeInstanceOf(StatsItemIDError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(StatsItemID.generate().get().length).toEqual(UUID.size());
      }
    });
  });
});
