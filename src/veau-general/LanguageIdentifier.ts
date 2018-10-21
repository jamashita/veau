import {message, Messages} from './Messages';

export class LanguageIdentifier {
  private static split(locale: string): string {
    const lang = locale.split('-')[0];
    return lang;
  }

  public static toISO639(locale: string): string {
    const smallLocale = locale.toLowerCase();
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

  public static message(locale: string): message {
    const newLocale = LanguageIdentifier.toISO639(locale);

    return Messages[newLocale];
  }
}
