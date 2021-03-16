import { UUID } from '@jamashita/publikum-uuid';
import { LanguageError } from '../Error/LanguageError';
import { LanguageID } from '../LanguageID';

describe('LanguageID', () => {
  describe('empty', () => {
    it('always returns 36 length string', () => {
      expect.assertions(1);

      expect(LanguageID.empty().get().get()).toHaveLength(36);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(LanguageID.empty()).toBe(LanguageID.empty());
    });
  });

  describe('of', () => {
    it('normal case', () => {
      expect.assertions(2);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();

      expect(LanguageID.of(uuid1).get()).toBe(uuid1);
      expect(LanguageID.of(uuid2).get()).toBe(uuid2);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();

      const language: LanguageID = LanguageID.ofString(uuid.get());

      expect(language.get().get()).toHaveLength(36);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect.assertions(1);

      expect(() => {
        LanguageID.ofString('quasi');
      }).toThrow(LanguageError);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      expect.assertions(3);

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
      expect.assertions(1);

      expect(LanguageID.empty().isEmpty()).toBe(true);
    });

    it('normal case', () => {
      expect.assertions(2);

      expect(LanguageID.of(UUID.v4()).isEmpty()).toBe(false);
      expect(LanguageID.of(UUID.v4()).isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const languageID: LanguageID = LanguageID.of(uuid);

      expect(languageID.toString()).toBe(uuid.toString());
    });
  });
});
