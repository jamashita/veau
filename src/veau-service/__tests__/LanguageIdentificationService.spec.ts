import { LanguageIdentificationService } from '../LanguageIdentificationService';

describe('LanguageIdentificationService', () => {
  describe('toISO639', () => {
    it('in case of supporting language, returns that language', () => {
      expect(LanguageIdentificationService.toISO639('ja-JP')).toEqual('ja');
      expect(LanguageIdentificationService.toISO639('en-US')).toEqual('en');
      expect(LanguageIdentificationService.toISO639('en-GB')).toEqual('en');
      expect(LanguageIdentificationService.toISO639('fr')).toEqual('fr');
      expect(LanguageIdentificationService.toISO639('es-ES')).toEqual('es');
    });

    it('in case of not supporting language, returns en', () => {
      expect(LanguageIdentificationService.toISO639('ru-MI')).toEqual('en');
      expect(LanguageIdentificationService.toISO639('sr')).toEqual('en');
    });
  });
});
