import { LanguageIdentificationService } from '../LanguageIdentificationService';

describe('LanguageIdentificationService', () => {
  describe('toSupportLanguage', () => {
    it('in case of supporting language, returns that language', () => {
      expect(LanguageIdentificationService.toSupportLanguage('ja-JP')).toEqual('ja');
      expect(LanguageIdentificationService.toSupportLanguage('en-US')).toEqual('en');
      expect(LanguageIdentificationService.toSupportLanguage('en-GB')).toEqual('en');
      expect(LanguageIdentificationService.toSupportLanguage('fr')).toEqual('fr');
      expect(LanguageIdentificationService.toSupportLanguage('es-ES')).toEqual('es');
    });

    it('in case of not supporting language, returns en', () => {
      expect(LanguageIdentificationService.toSupportLanguage('ru-MI')).toEqual('en');
      expect(LanguageIdentificationService.toSupportLanguage('sr')).toEqual('en');
    });
  });
});
