import { ISO639 } from '../ISO639';
import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { MockISO639 } from './MockISO639';
import { MockLanguageID } from './MockLanguageID';
import { MockLanguageName } from './MockLanguageName';

type LanguageArgs = Partial<Readonly<{
  languageID: LanguageID;
  name: LanguageName;
  englishName: LanguageName;
  iso639: ISO639;
}>>;

export class MockLanguage extends Language {

  public constructor({
    languageID = new MockLanguageID(),
    name = new MockLanguageName(),
    englishName = new MockLanguageName(),
    iso639 = new MockISO639()
  }: LanguageArgs = {}) {
    super(languageID, name, englishName, iso639);
  }
}
