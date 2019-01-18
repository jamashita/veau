export class LanguageIdentifier {
  private static split(language: string): string {
    const lang = language.split('-')[0];
    return lang;
  }

  public static toISO639(language: string): string {
    const smallLocale = language.toLowerCase();
    switch (smallLocale) {
      case 'en':
      case 'fr':
      case 'es':
      case 'ja': {
        return smallLocale;
      }
      default: {
        const lang = LanguageIdentifier.split(smallLocale);
        if (lang === smallLocale) {
          return 'en';
        }
        return LanguageIdentifier.toISO639(lang);
      }
    }
  }
}
