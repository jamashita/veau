import { ImmutableProject } from '@jamashita/lluvia-collection';
import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { Languages } from '../Languages';

export class MockLanguages extends Languages {
  private static toProject(languages: Array<Language>): ImmutableProject<LanguageID, Language> {
    const map: Map<LanguageID, Language> = new Map<LanguageID, Language>();

    languages.forEach((language: Language) => {
      map.set(language.getLanguageID(), language);
    });

    return ImmutableProject.ofMap<LanguageID, Language>(map);
  }

  public constructor(...languages: ReadonlyArray<Language>) {
    super(MockLanguages.toProject([...languages]));
  }
}
