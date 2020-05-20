import { ImmutableProject, Project } from 'publikum';

import { Language } from '../Language';
import { LanguageID } from '../LanguageID';
import { Languages } from '../Languages';

export class MockLanguages extends Languages {
  private static toProject(languages: Array<Language>): Project<LanguageID, Language> {
    const map: Map<LanguageID, Language> = new Map<LanguageID, Language>();

    languages.forEach((language: Language) => {
      map.set(language.getLanguageID(), language);
    });

    return ImmutableProject.of<LanguageID, Language>(map);
  }

  public constructor(...languages: Array<Language>) {
    super(MockLanguages.toProject(languages));
  }
}
