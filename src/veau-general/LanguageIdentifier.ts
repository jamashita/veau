import {message, Messages} from './Messages';

export class LanguageIdentifier {
  private static split(language: string): string {
    const lang = language.split('-')[0];
    return lang;
  }

  public static toISO639(language: string): string {
    const smallLocale = language.toLowerCase();
    // ぴったり一致するものがあればそれを利用する
    switch (smallLocale) {
      case 'en':
      case 'fr':
      case 'es':
      case 'ja': {
        return smallLocale;
      }
      default: {
        const lang = LanguageIdentifier.split(smallLocale);
        // 未対応言語
        if (lang === smallLocale) {
          return 'en';
        }
        return LanguageIdentifier.toISO639(lang);
      }
    }
  }

  public static message(language: string): message {
    const newLocale = LanguageIdentifier.toISO639(language);

    return Messages[newLocale];
  }
}
