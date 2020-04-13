import { LanguageID } from '../LanguageID';

// DONE
describe('LanguageID', () => {
  describe('default', () => {
    it('always returns 0', () => {
      expect(LanguageID.default().get()).toEqual(0);
    });

    it('returns singleton instance', () => {
      expect(LanguageID.default()).toEqual(LanguageID.default());
    });
  });

  describe('of', () => {
    it('returns LanguageID.default() when 0 is given', () => {
      expect(LanguageID.of(0)).toEqual(LanguageID.default());
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

  describe('toString', () => {
    it('normal case', () => {
      const id: number = 2;
      const languageID: LanguageID = LanguageID.of(id);

      expect(languageID.toString()).toEqual(id.toString());
    });
  });
});
