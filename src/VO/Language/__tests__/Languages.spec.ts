import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { ImmutableProject, MockProject } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { ISO639 } from '../ISO639';
import { Language, LanguageJSON, LanguageRow } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Languages } from '../Languages';
import { MockISO639 } from '../Mock/MockISO639';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockLanguageName } from '../Mock/MockLanguageName';

describe('Languages', () => {
  describe('of', () => {
    it('returns Languages.empty() if the size is 0', () => {
      expect.assertions(1);

      const languages: Languages = Languages.of(ImmutableProject.empty<LanguageID, Language>());

      expect(languages).toBe(Languages.empty());
    });

    it('returns normal-length project', () => {
      expect.assertions(3);

      const array: Array<MockLanguage> = [new MockLanguage(), new MockLanguage()];
      const languages: Languages = Languages.ofArray(array);

      expect(languages.size()).toBe(array.length);

      array.forEach((l: MockLanguage) => {
        expect(l).toBe(languages.get(l.getLanguageID()));
      });
    });
  });
  describe('ofArray', () => {
    it('returns normal-length project', () => {
      expect.assertions(3);

      const array: Array<MockLanguage> = [new MockLanguage(), new MockLanguage()];
      const languages: Languages = Languages.ofArray(array);

      expect(languages.size()).toBe(array.length);

      array.forEach((l: MockLanguage) => {
        expect(l).toBe(languages.get(l.getLanguageID()));
      });
    });
  });

  describe('ofJSON', () => {
    it('returns parsed class instance', () => {
      expect.assertions(13);

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
      expect.assertions(5);

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
      expect.assertions(1);

      expect(Languages.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Languages.empty()).toBe(Languages.empty());
    });
  });

  describe('validate', () => {
    it('returns true if given parameter is json', () => {
      expect.assertions(1);

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
      expect.assertions(5);

      expect(Languages.validate(null)).toBe(false);
      expect(Languages.validate(undefined)).toBe(false);
      expect(Languages.validate(56)).toBe(false);
      expect(Languages.validate('fjafsd')).toBe(false);
      expect(Languages.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect.assertions(1);

      expect(Languages.validate({})).toBe(false);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.get = spy;
      languages.get(new MockLanguageID());

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.contains = spy;
      languages.contains(language1);

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.size = spy;
      languages.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.forEach = spy;
      languages.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.isEmpty = spy;
      languages.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

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
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage({
        name: new MockLanguageName('language'),
        iso639: new MockISO639('ab')
      });

      const languages: Languages = Languages.ofArray([language1, language2]);

      expect(languages.equals(languages)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.equals = spy;
      languages.equals(Languages.empty());

      expect(spy.called).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

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

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.toString = spy;
      languages.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('returns [LanguageID, Language]', () => {
      expect.assertions(3);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const arr: Array<MockLanguage> = [language1, language2, language3];

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
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
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.every = spy;
      languages.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.some = spy;
      languages.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.values = spy;
      languages.values();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('returns matching element by predicate', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage({
        name: new MockLanguageName('name 1')
      });
      const language2: MockLanguage = new MockLanguage({
        name: new MockLanguageName('name 2')
      });
      const language3: MockLanguage = new MockLanguage({
        name: new MockLanguageName('name 1')
      });

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const languages: Languages = Languages.of(project);

      const filtered: Languages = languages.filter((l: Language) => {
        return l.getName().get() === 'name 1';
      });

      expect(filtered.size()).toBe(2);
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const languages: Languages = Languages.of(project);

      // @ts-expect-error
      languages.languages.find = spy;
      languages.find(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('does not affect the length, only change the instance', () => {
      expect.assertions(1);

      const language1: MockLanguage = new MockLanguage();
      const language2: MockLanguage = new MockLanguage();
      const language3: MockLanguage = new MockLanguage();

      const project: MockProject<MockLanguageID, MockLanguage> = new MockProject<MockLanguageID, MockLanguage>(
        new Map<MockLanguageID, MockLanguage>([
          [language1.getLanguageID(), language1],
          [language2.getLanguageID(), language2],
          [language3.getLanguageID(), language3]
        ])
      );

      const languages: Languages = Languages.of(project);

      const mapped: ImmutableProject<LanguageID, ISO639> = languages.map<ISO639>((language: Language) => {
        return language.getISO639();
      });

      expect(mapped.size()).toBe(3);
    });
  });
});
