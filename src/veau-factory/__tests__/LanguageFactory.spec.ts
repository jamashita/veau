/* tslint:disable */
import 'jest';
import { Language, LanguageJSON, LanguageRow } from '../../veau-entity/Language';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageFactory } from '../LanguageFactory';

describe('LanguageFactory', () => {
  it('from', () => {
    const languageID: LanguageID = LanguageID.of(1);
    const name: string = 'Afaraf';
    const englishName: string = 'Afar';
    const iso639: ISO639 = ISO639.of('aa');

    const languageFactory: LanguageFactory = LanguageFactory.getInstance();
    const language: Language = languageFactory.from(languageID, name, englishName, iso639);

    expect(language.getLanguageID()).toEqual(languageID);
    expect(language.getName()).toEqual(name);
    expect(language.getEnglishName()).toEqual(englishName);
    expect(language.getISO639()).toEqual(iso639);
  });

  it('fromJSON', () => {
    const json: LanguageJSON = {
      languageID: 2,
      name: 'Afaraf',
      englishName: 'Afar',
      iso639: 'aa'
    };

    const languageFactory: LanguageFactory = LanguageFactory.getInstance();
    const language: Language = languageFactory.fromJSON(json);

    expect(language.getLanguageID().get()).toEqual(json.languageID);
    expect(language.getName()).toEqual(json.name);
    expect(language.getEnglishName()).toEqual(json.englishName);
    expect(language.getISO639().get()).toEqual(json.iso639);
  });

  it('fromRow', () => {
    const row: LanguageRow = {
      languageID: 2,
      name: 'Afaraf',
      englishName: 'Afar',
      iso639: 'aa'
    };

    const languageFactory: LanguageFactory = LanguageFactory.getInstance();
    const language: Language = languageFactory.fromRow(row);

    expect(language.getLanguageID().get()).toEqual(row.languageID);
    expect(language.getName()).toEqual(row.name);
    expect(language.getEnglishName()).toEqual(row.englishName);
    expect(language.getISO639().get()).toEqual(row.iso639);
  });
});
