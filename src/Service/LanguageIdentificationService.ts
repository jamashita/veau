import { SystemSupportLanguage } from '../domain/vo/System/SystemSupportLanguage';

export class LanguageIdentificationService {
  private static split(language: string): string {
    return language.split('-')[0]!;
  }

  public static toSupportLanguage(language: string): SystemSupportLanguage {
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

        return LanguageIdentificationService.toSupportLanguage(lang);
      }
    }
  }

  private constructor() {
    // NOOP
  }
}
