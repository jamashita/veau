import { UUID } from '@jamashita/anden-uuid';
import { LanguageError } from '../LanguageError';
import { LanguageID } from '../LanguageID';

describe('LanguageID', () => {
  describe('empty', () => {
    it('always returns 36 length string', () => {
      expect(LanguageID.empty().get().get()).toHaveLength(36);
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
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const language: LanguageID = LanguageID.ofString(uuid.get());

      expect(language.get().get()).toHaveLength(36);
    });

    it('returns Dead when uuid length string is not given', () => {
      expect(() => {
        LanguageID.ofString('quasi');
      }).toThrow(LanguageError);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const uuid: UUID = UUID.v4();
      const languageID: LanguageID = LanguageID.of(uuid);

      expect(languageID.equals(null)).toBe(false);
      expect(languageID.equals(undefined)).toBe(false);
      expect(languageID.equals('')).toBe(false);
      expect(languageID.equals('123')).toBe(false);
      expect(languageID.equals('abcd')).toBe(false);
      expect(languageID.equals(123)).toBe(false);
      expect(languageID.equals(0)).toBe(false);
      expect(languageID.equals(-12)).toBe(false);
      expect(languageID.equals(0.3)).toBe(false);
      expect(languageID.equals(false)).toBe(false);
      expect(languageID.equals(true)).toBe(false);
      expect(languageID.equals(Symbol('p'))).toBe(false);
      expect(languageID.equals(20n)).toBe(false);
      expect(languageID.equals({})).toBe(false);
      expect(languageID.equals([])).toBe(false);
      expect(languageID.equals(Object.create(null))).toBe(false);
    });

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
});
