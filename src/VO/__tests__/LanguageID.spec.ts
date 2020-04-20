import { LanguageID } from '../LanguageID';

describe('LanguageID', () => {
  describe('empty', () => {
    it('always returns 0', () => {
      expect(LanguageID.empty().get()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(LanguageID.empty()).toBe(LanguageID.empty());
    });
  });

  describe('of', () => {
    it('returns LanguageID.empty() when 0 is given', () => {
      expect(LanguageID.of(0)).toBe(LanguageID.empty());
    });

    it('returns LanguageID.empty() when negative values are given', () => {
      expect(LanguageID.of(-9)).toBe(LanguageID.empty());
      expect(LanguageID.of(-53)).toBe(LanguageID.empty());
    });

    it('returns LanguageID.empty() when doble values are given', () => {
      expect(LanguageID.of(0.8)).toBe(LanguageID.empty());
      expect(LanguageID.of(12.45)).toBe(LanguageID.empty());
    });

    it('normal case', () => {
      const id1: number = 1;
      const id2: number = 10;

      expect(LanguageID.of(id1).get()).toBe(id1);
      expect(LanguageID.of(id2).get()).toBe(id2);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const languageID1: LanguageID = LanguageID.of(1);
      const languageID2: LanguageID = LanguageID.of(2);
      const languageID3: LanguageID = LanguageID.of(1);

      expect(languageID1.equals(languageID1)).toBe(true);
      expect(languageID1.equals(languageID2)).toBe(false);
      expect(languageID1.equals(languageID3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('when LanguageID.empty() given , returns true', () => {
      expect(LanguageID.empty().isEmpty()).toBe(true);
    });

    it('when negative values given , returns true', () => {
      expect(LanguageID.of(-1).isEmpty()).toBe(true);
      expect(LanguageID.of(-11).isEmpty()).toBe(true);
    });

    it('when double value is given, returns true', () => {
      expect(LanguageID.of(1.1).isEmpty()).toBe(true);
      expect(LanguageID.of(2.5).isEmpty()).toBe(true);
    });

    it('otherwise returns false', () => {
      expect(LanguageID.of(1).isEmpty()).toBe(false);
      expect(LanguageID.of(105).isEmpty()).toBe(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id: number = 2;
      const languageID: LanguageID = LanguageID.of(id);

      expect(languageID.toString()).toBe(id.toString());
    });
  });
});
