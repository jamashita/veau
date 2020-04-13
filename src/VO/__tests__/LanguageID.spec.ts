import { LanguageID } from '../LanguageID';

// DONE
describe('LanguageID', () => {
  describe('empty', () => {
    it('always returns 0', () => {
      expect(LanguageID.empty().get()).toEqual(0);
    });

    it('returns singleton instance', () => {
      expect(LanguageID.empty()).toBe(LanguageID.empty());
    });
  });

  describe('of', () => {
    it('returns LanguageID.empty() when 0 is given', () => {
      expect(LanguageID.of(0)).toEqual(LanguageID.empty());
    });

    it('normal case', () => {
      const id1: number = 1;
      const id2: number = 10;

      expect(LanguageID.of(id1).get()).toEqual(id1);
      expect(LanguageID.of(id2).get()).toEqual(id2);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const languageID1: LanguageID = LanguageID.of(1);
      const languageID2: LanguageID = LanguageID.of(2);
      const languageID3: LanguageID = LanguageID.of(1);

      expect(languageID1.equals(languageID1)).toEqual(true);
      expect(languageID1.equals(languageID2)).toEqual(false);
      expect(languageID1.equals(languageID3)).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('when LanguageID.empty() given , returns true', () => {
      expect(LanguageID.empty().isEmpty()).toEqual(true);
    });

    it('when negative values given , returns true', () => {
      expect(LanguageID.of(-1).isEmpty()).toEqual(true);
      expect(LanguageID.of(-11).isEmpty()).toEqual(true);
    });

    it('when double value is given, returns true', () => {
      expect(LanguageID.of(1.1).isEmpty()).toEqual(true);
      expect(LanguageID.of(2.5).isEmpty()).toEqual(true);
    });

    it('otherwise returns false', () => {
      expect(LanguageID.of(1).isEmpty()).toEqual(false);
      expect(LanguageID.of(105).isEmpty()).toEqual(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id: number = 2;
      const languageID: LanguageID = LanguageID.of(id);

      expect(languageID.toString()).toEqual(id.toString());
    });
  });
});
