import { ISO639 } from '../ISO639';
import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';

type LanguageArgs = Partial<Readonly<{
  languageID: LanguageID;
  name: LanguageName;
  englishName: LanguageName;
  iso639: ISO639;
}>>;

export class MockLanguage extends Language {
  public constructor({
    languageID = LanguageID.ofString('28279001-df8e-4385-9154-76c16896d7ff'),
    name = LanguageName.of('EIG'),
    englishName = LanguageName.of('EIGNEI'),
    iso639 = ISO639.of('EIG')
  }: LanguageArgs = {}) {
    super(languageID, name, englishName, iso639);
  }
}
