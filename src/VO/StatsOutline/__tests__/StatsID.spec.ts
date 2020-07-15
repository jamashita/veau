import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { StatsIDError } from '../Error/StatsIDError';
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
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();

      const superposition: Superposition<StatsID, StatsIDError> = StatsID.ofString(uuid.get());
      const schrodinger: Schrodinger<StatsID, StatsIDError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead when uuid length string is not given', async () => {
      const superposition: Superposition<StatsID, StatsIDError> = StatsID.ofString('trois');
      const schrodinger: Schrodinger<StatsID, StatsIDError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsIDError);
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
