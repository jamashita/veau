import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { LanguageIDError } from '../Error/LanguageIDError';
import { LanguageID } from '../LanguageID';

describe('LanguageID', () => {
  describe('empty', () => {
    it('always returns 36 length string', () => {
      expect(LanguageID.empty().get().get().length).toBe(36);
    });

    it('returns singleton instance', () => {
      expect(LanguageID.empty()).toBe(LanguageID.empty());
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();

      expect(LanguageID.of(uuid1).get()).toBe(uuid1);
      expect(LanguageID.of(uuid2).get()).toBe(uuid2);
    });
  });

  describe('ofString', () => {
    it('normal case', async () => {
      const uuid: UUID = UUID.v4();

      const superposition: Superposition<LanguageID, LanguageIDError> = LanguageID.ofString(uuid.get());
      const schrodinger: Schrodinger<LanguageID, LanguageIDError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead when uuid length string is not given', async () => {
      const superposition: Superposition<LanguageID, LanguageIDError> = LanguageID.ofString('quasi');
      const schrodinger: Schrodinger<LanguageID, LanguageIDError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguageIDError);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const languageID1: LanguageID = LanguageID.of(uuid1);
      const languageID2: LanguageID = LanguageID.of(uuid2);
      const languageID3: LanguageID = LanguageID.of(uuid1);

      expect(languageID1.equals(languageID1)).toBe(true);
      expect(languageID1.equals(languageID2)).toBe(false);
      expect(languageID1.equals(languageID3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('when LanguageID.empty() given , returns true', () => {
      expect(LanguageID.empty().isEmpty()).toBe(true);
    });

    it('normal case', () => {
      expect(LanguageID.of(UUID.v4()).isEmpty()).toBe(false);
      expect(LanguageID.of(UUID.v4()).isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();
      const languageID: LanguageID = LanguageID.of(uuid);

      expect(languageID.toString()).toBe(uuid.toString());
    });
  });
});
