import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { ImmutableProject, MutableProject, Project } from '@jamashita/lluvia-project';
import { ISO639 } from '../ISO639';
import { Language, LanguageJSON, LanguageRow } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Languages } from '../Languages';
import { MockLanguage } from '../mock/MockLanguage';

describe('Languages', () => {
  describe('of', () => {
    it('returns Languages.empty() if the size is 0', () => {
      const languages: Languages = Languages.of(ImmutableProject.empty());

      expect(languages).toBe(Languages.empty());
    });

    it('returns normal-length project', () => {
      const array: Array<MockLanguage> = [
        new MockLanguage({
          languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
        }),
        new MockLanguage({
          languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
        })
      ];
      const languages: Languages = Languages.ofArray(array);

      expect(languages.size()).toBe(array.length);

      array.forEach((l: MockLanguage) => {
        expect(l).toBe(languages.get(l.getLanguageID()));
      });
    });
  });
  describe('ofArray', () => {
    it('returns normal-length project', () => {
      const array: Array<MockLanguage> = [
        new MockLanguage({
          languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
        }),
        new MockLanguage({
          languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
        })
      ];
      const languages: Languages = Languages.ofArray(array);

      expect(languages.size()).toBe(array.length);

      array.forEach((l: MockLanguage) => {
        expect(l).toBe(languages.get(l.getLanguageID()));
      });
    });
  });

  describe('ofJSON', () => {
    it('returns parsed class instance', () => {
      const json: Array<LanguageJSON> = [
        {
          languageID: UUID.v4().get(),
          name: 'language name 1',
          englishName: 'english language name 1',
          iso639: 'aa'
        },
        {
          languageID: UUID.v4().get(),
          name: 'language name 2',
          englishName: 'english language name 2',
          iso639: 'bb'
        },
        {
          languageID: UUID.v4().get(),
          name: 'language name 3',
          englishName: 'english language name 3',
          iso639: 'cc'
        }
      ];
      const languages: Languages = Languages.ofJSON(json);

      expect(languages.size()).toBe(json.length);

      json.forEach((j: LanguageJSON) => {
        const l: Nullable<Language> = languages.get(LanguageID.ofString(j.languageID));

        expect(j.languageID).toBe(l?.getLanguageID().toString());
        expect(j.name).toBe(l?.getName().toString());
        expect(j.englishName).toBe(l?.getEnglishName().toString());
        expect(j.iso639).toBe(l?.getISO639().toString());
      });
    });
  });

  describe('ofRow', () => {
    it('returns parsed class instance', () => {
      const rows: Array<LanguageRow> = [
        {
          languageID: UUID.v4().get(),
          name: 'language name',
          englishName: 'english language name',
          iso639: 'aa'
        }
      ];
      const languages: Languages = Languages.ofRow(rows);

      expect(languages.size()).toBe(rows.length);

      rows.forEach((r: LanguageRow) => {
        const id: LanguageID = LanguageID.ofString(r.languageID);

        expect(r.languageID).toBe(languages.get(id)?.getLanguageID().toString());
        expect(r.name).toBe(languages.get(id)?.getName().toString());
        expect(r.englishName).toBe(languages.get(id)?.getEnglishName().toString());
        expect(r.iso639).toBe(languages.get(id)?.getISO639().toString());
      });
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

  describe('validate', () => {
    it('returns true if given parameter is json', () => {
      const n: unknown = [
        {
          languageID: 'tis tis',
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];

      expect(Languages.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(Languages.validate(null)).toBe(false);
      expect(Languages.validate(undefined)).toBe(false);
      expect(Languages.validate(56)).toBe(false);
      expect(Languages.validate('fjafsd')).toBe(false);
      expect(Languages.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect(Languages.validate({})).toBe(false);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'get');

      // @ts-expect-error
      languages.languages = project;
      languages.get(LanguageID.ofString('0a518e9f-f49e-4d7b-8103-5d52ffc3c330'));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'contains');

      // @ts-expect-error
      languages.languages = project;
      languages.contains(language1);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'size');

      // @ts-expect-error
      languages.languages = project;
      languages.size();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'forEach');

      // @ts-expect-error
      languages.languages = project;
      languages.forEach(() => {
        // NOOP
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'isEmpty');

      // @ts-expect-error
      languages.languages = project;
      languages.isEmpty();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const languages: Languages = Languages.empty();

      expect(languages.equals(null)).toBe(false);
      expect(languages.equals(undefined)).toBe(false);
      expect(languages.equals('')).toBe(false);
      expect(languages.equals('123')).toBe(false);
      expect(languages.equals('abcd')).toBe(false);
      expect(languages.equals(123)).toBe(false);
      expect(languages.equals(0)).toBe(false);
      expect(languages.equals(-12)).toBe(false);
      expect(languages.equals(0.3)).toBe(false);
      expect(languages.equals(false)).toBe(false);
      expect(languages.equals(true)).toBe(false);
      expect(languages.equals(Symbol('p'))).toBe(false);
      expect(languages.equals(20n)).toBe(false);
      expect(languages.equals({})).toBe(false);
      expect(languages.equals([])).toBe(false);
      expect(languages.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the same instance given', () => {
      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        name: LanguageName.of('language'),
        iso639: ISO639.of('ab')
      });

      const languages: Languages = Languages.ofArray([language1, language2]);

      expect(languages.equals(languages)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'equals');

      // @ts-expect-error
      languages.languages = project;
      languages.equals(Languages.ofArray([language2]));

      expect(spy).toHaveBeenCalled();
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

      expect(languages.toJSON()).toStrictEqual([
        {
          languageID: uuid.get(),
          name: 'language 1',
          englishName: 'english language 1',
          iso639: 'aa'
        }
      ]);
    });
  });

  describe('iterator', () => {
    it('returns [LanguageID, Language]', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const arr: Array<MockLanguage> = [language1, language2, language3];

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const languages: Languages = Languages.of(project);
      let i: number = 0;

      for (const [, v] of languages) {
        expect(v).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'every');

      // @ts-expect-error
      languages.languages = project;
      languages.every(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'some');

      // @ts-expect-error
      languages.languages = project;
      languages.some(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'values');

      // @ts-expect-error
      languages.languages = project;
      languages.values();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('returns matching elements by predicate', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'filter');

      // @ts-expect-error
      languages.languages = project;
      languages.filter(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'find');

      // @ts-expect-error
      languages.languages = project;
      languages.find(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('does not affect the length, only change the instance', () => {
      const language1: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d01ef031-9421-4eeb-87aa-a44e166dd02c')
      });
      const language2: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('337ddba2-7b99-4739-9933-6593063dbeda')
      });
      const language3: MockLanguage = new MockLanguage({
        languageID: LanguageID.ofString('d9a2f9a5-fb0f-497a-983c-dbe3304a9277')
      });

      const project: Project<LanguageID, MockLanguage> = MutableProject.ofMap(
        new Map([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );
      const languages: Languages = Languages.of(project);
      const spy: jest.SpyInstance = jest.spyOn(project, 'map');

      // @ts-expect-error
      languages.languages = project;
      languages.map((language: Language): Language => {
        return language;
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});
