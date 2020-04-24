import { Superposition, UUID } from 'publikum';
import sinon, { SinonSpy } from 'sinon';
import { StatsIDError } from '../../Error/StatsIDError';
import { StatsID } from '../StatsID';

describe('StatsID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const statsID: StatsID = StatsID.of(uuid);

      expect(statsID.get().get()).toBe(uuid.get());
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const superposition: Superposition<StatsID, StatsIDError> = StatsID.ofString(
        uuid.get()
      );

      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<StatsID, StatsIDError> = StatsID.ofString('trois');

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsIDError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsIDError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(StatsID.generate().get().get().length).toBe(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const statsID1: StatsID = StatsID.of(uuid1);
      const statsID2: StatsID = StatsID.of(uuid2);
      const statsID3: StatsID = StatsID.of(uuid1);

      expect(statsID1.equals(statsID1)).toBe(true);
      expect(statsID1.equals(statsID2)).toBe(false);
      expect(statsID1.equals(statsID3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const statsID: StatsID = StatsID.of(uuid);

      expect(statsID.get().toString()).toBe(uuid.get());
    });
  });
});
