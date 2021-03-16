import { LanguageIdentificationService } from '../LanguageIdentificationService';

describe('LanguageIdentificationService', () => {
  describe('toSupportLanguage', () => {
    it('in case of supporting language, returns that language', () => {
      expect.assertions(5);

      expect(LanguageIdentificationService.toSupportLanguage('ja-JP')).toBe('ja');
      expect(LanguageIdentificationService.toSupportLanguage('en-US')).toBe('en');
      expect(LanguageIdentificationService.toSupportLanguage('en-GB')).toBe('en');
      expect(LanguageIdentificationService.toSupportLanguage('fr')).toBe('fr');
      expect(LanguageIdentificationService.toSupportLanguage('es-ES')).toBe('es');
    });

    it('in case of not supporting language, returns en', () => {
      expect.assertions(2);

      expect(LanguageIdentificationService.toSupportLanguage('ru-MI')).toBe('en');
      expect(LanguageIdentificationService.toSupportLanguage('sr')).toBe('en');
    });
  });
});
