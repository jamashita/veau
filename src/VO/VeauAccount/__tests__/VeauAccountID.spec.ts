import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { VeauAccountIDError } from '../Error/VeauAccountIDError';
import { VeauAccountID } from '../VeauAccountID';

describe('VeauAccountID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const veauAccountID: VeauAccountID = VeauAccountID.of(uuid);

      expect(veauAccountID.get()).toBe(uuid);
    });
  });

  describe('ofString', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();

      const superposition: Superposition<VeauAccountID, VeauAccountIDError> = VeauAccountID.ofString(uuid.get());
      const schrodinger: Schrodinger<VeauAccountID, VeauAccountIDError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead when uuid length string is not given', async () => {
      const superposition: Superposition<VeauAccountID, VeauAccountIDError> = VeauAccountID.ofString('cinq');
      const schrodinger: Schrodinger<VeauAccountID, VeauAccountIDError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(VeauAccountIDError);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(VeauAccountID.generate().get().get().length).toBe(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const veauAccountID1: VeauAccountID = VeauAccountID.of(uuid1);
      const veauAccountID2: VeauAccountID = VeauAccountID.of(uuid2);
      const veauAccountID3: VeauAccountID = VeauAccountID.of(uuid1);

      expect(veauAccountID1.equals(veauAccountID1)).toBe(true);
      expect(veauAccountID1.equals(veauAccountID2)).toBe(false);
      expect(veauAccountID1.equals(veauAccountID3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const veauAccountID: VeauAccountID = VeauAccountID.of(uuid);

      expect(veauAccountID.toString()).toBe(uuid.toString());
    });
  });
});
