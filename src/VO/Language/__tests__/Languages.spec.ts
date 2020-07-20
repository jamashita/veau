import { ImmutableProject, MockAProject } from '@jamashita/publikum-collection';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import sinon, { SinonSpy } from 'sinon';

import { LanguageError } from '../Error/LanguageError';
import { LanguagesError } from '../Error/LanguagesError';
import { ISO639 } from '../ISO639';
import { Language, LanguageJSON, LanguageRow } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Languages } from '../Languages';
import { MockISO639 } from '../Mock/MockISO639';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockLanguageName } from '../Mock/MockLanguageName';
import { MockLanguages } from '../Mock/MockLanguages';

describe('Languages', () => {
  describe('of', () => {
    it('when the ImmutableProject is zero size, returns Languages.empty()', () => {
      const languages: Languages = Languages.of(ImmutableProject.empty<LanguageID, Language>());

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', () => {
      const array: Array<MockLanguage> = [new MockLanguage(), new MockLanguage()];

      const languages: Languages = Languages.ofArray(array);

      expect(languages.size()).toBe(array.length);
      for (let i: number = 0; i < languages.size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        expect(languages.get(array[i].getLanguageID())).toBe(array[i]);
      }
    });
  });

  describe('ofSuperposition', () => {
    it('when empty Array given, returns Alive, and Languages.empty()', async () => {
      const superposition: Superposition<Languages, LanguagesError> = Languages.ofSuperposition([]);
      const schrodinger: Schrodinger<Languages, LanguagesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Languages.empty());
    });

    it('normal case', async () => {
      const array: Array<MockLanguage> = [new MockLanguage(), new MockLanguage()];

      const superposition: Superposition<Languages, LanguagesError> = Languages.ofSuperposition([
        Superposition.alive<Language, LanguageError>(array[0]),
        Superposition.alive<Language, LanguageError>(array[1])
      ]);
      const schrodinger: Schrodinger<Languages, LanguagesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const languages: Languages = schrodinger.get();

      expect(languages.size()).toBe(array.length);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(array[i].getLanguageID())).toBe(array[i]);
      }
    });

    it('contains failure', async () => {
      const language: MockLanguage = new MockLanguage();

      const superposition1: Superposition<Language, LanguageError> = Superposition.alive<Language, LanguageError>(
        language,
        LanguageError
      );
      const superposition2: Superposition<Language, LanguageError> = Superposition.dead<Language, LanguageError>(
        new LanguageError('test failed'),
        LanguageError
      );
      const superposition: Superposition<Languages, LanguagesError> = Languages.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<Languages, LanguagesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguagesError);
    });

    it('contains 2 failures', async () => {
      const superposition1: Superposition<Language, LanguageError> = Superposition.dead<Language, LanguageError>(
        new LanguageError('test failed 1'),
        LanguageError
      );
      const superposition2: Superposition<Language, LanguageError> = Superposition.dead<Language, LanguageError>(
        new LanguageError('test failed 2'),
        LanguageError
      );
      const superposition: Superposition<Languages, LanguagesError> = Languages.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<Languages, LanguagesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(LanguagesError);
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns Languages.empty()', async () => {
      const superposition: Superposition<Languages, LanguagesError> = Languages.ofJSON([]);
      const schrodinger: Schrodinger<Languages, LanguagesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const languages: Languages = schrodinger.get();

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', async () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: UUID.v4().get(),
          name: 'language name',
          englishName: 'english language name',
          iso639: 'aa'
        }
      ];

      const superposition: Superposition<Languages, LanguagesError> = Languages.ofJSON(json);
      const schrodinger: Schrodinger<Languages, LanguagesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const languages: Languages = schrodinger.get();

      expect(languages.size()).toBe(json.length);
      for (let i: number = 0; i < languages.size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        const language: Nullable<Language> = languages.get(await LanguageID.ofString(json[i].languageID).get());

        expect(language?.getLanguageID().get().get()).toBe(json[i].languageID);
        expect(language?.getName().get()).toBe(json[i].name);
        expect(language?.getEnglishName().get()).toBe(json[i].englishName);
        expect(language?.getISO639().get()).toBe(json[i].iso639);
      }
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns Languages.empty()', async () => {
      const superposition: Superposition<Languages, LanguagesError> = Languages.ofRow([]);
      const schrodinger: Schrodinger<Languages, LanguagesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const languages: Languages = schrodinger.get();

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', async () => {
      const rows: Array<LanguageRow> = [
        {
          languageID: UUID.v4().get(),
          name: 'language name',
          englishName: 'english language name',
          iso639: 'aa'
        }
      ];

      const superposition: Superposition<Languages, LanguagesError> = Languages.ofJSON(rows);
      const schrodinger: Schrodinger<Languages, LanguagesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const languages: Languages = schrodinger.get();

      expect(languages.size()).toBe(rows.length);
      for (let i: number = 0; i < languages.size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        const language: Nullable<Language> = languages.get(await LanguageID.ofString(rows[i].languageID).get());

        expect(language?.getLanguageID().get().get()).toBe(rows[i].languageID);
        expect(language?.getName().get()).toBe(rows[i].name);
        expect(language?.getEnglishName().get()).toBe(rows[i].englishName);
        expect(language?.getISO639().get()).toBe(rows[i].iso639);
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns Languages.empty()', () => {
      const languages: Languages = Languages.ofArray([]);

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', () => {
      const langs: Array<MockLanguage> = [new MockLanguage(), new MockLanguage()];

      const languages: Languages = Languages.ofArray(langs);

      expect(languages.size()).toBe(langs.length);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(langs[i].getLanguageID())).toBe(langs[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns Languages.empty()', () => {
      const languages: Languages = Languages.ofSpread();

      expect(languages).toBe(Languages.empty());
    });

    it('normal case', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const langs: Array<MockLanguage> = [language1, language2];

      const languages: Languages = Languages.ofSpread(language1, language2);

      expect(languages.size()).toBe(langs.length);
      for (let i: number = 0; i < languages.size(); i++) {
        expect(languages.get(langs[i].getLanguageID())).toBe(langs[i]);
      }
    });
  });

  describe('empty', () => {
    it('generates 0-length Languages', () => {
      expect(Languages.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(Languages.empty()).toBe(Languages.empty());
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.get = spy;

      const languages: Languages = Languages.of(project);

      languages.get(new MockLanguageID());

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.contains = spy;

      const languages: Languages = Languages.of(project);

      languages.contains(language1);

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.size = spy;

      const languages: Languages = Languages.of(project);

      languages.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.forEach = spy;

      const languages: Languages = Languages.of(project);

      languages.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('normal case', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const languages: Languages = Languages.of(project);

      const arr: Array<ISO639> = languages.map<ISO639>((language: Language) => {
        return language.getISO639();
      });

      expect(arr.length).toBe(3);
    });
  });

  describe('find', () => {
    it('returns Language if the element exists', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const language1: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(uuid1)
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(uuid2)
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(uuid1)
      });
      const language4: MockLanguage = new MockLanguage({
        languageID: new MockLanguageID(uuid3)
      });

      const languages: Languages = Languages.ofArray([language1, language2]);

      expect(
        languages.find((language: Language) => {
          return language1.equals(language);
        })
      ).toBe(language1);
      expect(
        languages.find((language: Language) => {
          return language2.equals(language);
        })
      ).toBe(language2);
      expect(
        languages.find((language: Language) => {
          return language3.equals(language);
        })
      ).toBe(language1);
      expect(
        languages.find((language: Language) => {
          return language4.equals(language);
        })
      ).toBe(null);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.isEmpty = spy;

      const languages: Languages = Languages.of(project);

      languages.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        name: new MockLanguageName('language'),
        iso639: new MockISO639('ab')
      });

      const languages: Languages = Languages.ofArray([language1, language2]);

      expect(languages.equals(languages)).toBe(true);
    });

    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.equals = spy;

      const languages: Languages = Languages.of(project);

      languages.equals(new MockLanguages());

      expect(spy.called).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();
      const languages: Languages = Languages.ofArray([
        Language.of(
          LanguageID.of(uuid),
          LanguageName.of('language 1'),
          LanguageName.of('english language 1'),
          ISO639.of('aa')
        )
      ]);

      expect(languages.toJSON()).toEqual([
        {
          languageID: uuid.get(),
          name: 'language 1',
          englishName: 'english language 1',
          iso639: 'aa'
        }
      ]);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.toString = spy;

      const languages: Languages = Languages.of(project);

      languages.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const arr: Array<MockLanguage> = [language1, language2, language3];

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const languages: Languages = Languages.of(project);
      let i: number = 0;

      for (const pair of languages) {
        expect(pair.getValue()).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.every = spy;

      const languages: Languages = Languages.of(project);

      languages.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', async () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockAProject<MockLanguageID, MockLanguage> = new MockAProject<MockLanguageID, MockLanguage>(new Map<MockLanguageID, MockLanguage>(
        [
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.some = spy;

      const languages: Languages = Languages.of(project);

      languages.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});
