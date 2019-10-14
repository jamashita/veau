export class LanguageIdentificationService {

  private static split(language: string): string {
    return language.split('-')[0];
  }

  public static toISO639(language: string): string {
    const smallLocale: string = language.toLowerCase();
    switch (smallLocale) {
      case 'en':
      case 'fr':
      case 'es':
      case 'ja': {
        return smallLocale;
      }
      default: {
        const lang: string = LanguageIdentificationService.split(smallLocale);
        if (lang === smallLocale) {
          return 'en';
        }
        return LanguageIdentificationService.toISO639(lang);
      }
    }
  }

  private constructor() {
  }
}
