import sinon, { SinonSpy } from 'sinon';
import { StatsItemIDError } from '../../Error/StatsItemIDError';
import { Superposition } from '../../General/Superposition/Superposition';
import { UUID } from '../../General/UUID/UUID';
import { StatsItemID } from '../StatsItemID';

describe('StatsItemID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const statsItemID: StatsItemID = StatsItemID.of(uuid);

      expect(statsItemID.get().get()).toBe(uuid.get());
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const superposition: Superposition<StatsItemID, StatsItemIDError> = StatsItemID.ofString(
        uuid.get()
      );

      expect(superposition.isSuccess()).toBe(true);
    });

    it('returns Failure when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsItemID, StatsItemIDError> = StatsItemID.ofString('quatre');

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsItemIDError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemIDError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(StatsItemID.generate().get().get().length).toBe(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const statsItemID1: StatsItemID = StatsItemID.of(uuid1);
      const statsItemID2: StatsItemID = StatsItemID.of(uuid2);
      const statsItemID3: StatsItemID = StatsItemID.of(uuid1);

      expect(statsItemID1.equals(statsItemID1)).toBe(true);
      expect(statsItemID1.equals(statsItemID2)).toBe(false);
      expect(statsItemID1.equals(statsItemID3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const statsItemID: StatsItemID = StatsItemID.of(uuid);

      expect(statsItemID.get().toString()).toBe(uuid.get());
    });
  });
});
