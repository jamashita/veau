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
      const statsItemID1: StatsItemID = StatsItemID.of(uuid1).get();
      const statsItemID2: StatsItemID = StatsItemID.of(uuid2).get();
      const statsItemID3: StatsItemID = StatsItemID.of(uuid1).get();

      expect(statsItemID1.equals(statsItemID1)).toEqual(true);
      expect(statsItemID1.equals(statsItemID2)).toEqual(false);
      expect(statsItemID1.equals(statsItemID3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
      const statsItemID: StatsItemID = StatsItemID.of(uuid).get();

      expect(statsItemID.get().toString()).toEqual(uuid);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const uuid: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
      const trial: Try<StatsItemID, StatsItemIDError> = StatsItemID.of(uuid);

      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial: Try<StatsItemID, StatsItemIDError> = StatsItemID.of('quatre');

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemIDError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemIDError);
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
