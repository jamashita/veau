import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import { ISO639 } from '../../Language/ISO639';
import { Language, LanguageJSON } from '../../Language/Language';
import { LanguageID } from '../../Language/LanguageID';
import { LanguageName } from '../../Language/LanguageName';
import { Languages } from '../../Language/Languages';
import { MockLanguage } from '../../Language/Mock/MockLanguage';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockLanguages } from '../../Language/Mock/MockLanguages';
import { ISO3166 } from '../../Region/ISO3166';
import { MockRegion } from '../../Region/Mock/MockRegion';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { MockRegions } from '../../Region/Mock/MockRegions';
import { Region, RegionJSON } from '../../Region/Region';
import { RegionID } from '../../Region/RegionID';
import { RegionName } from '../../Region/RegionName';
import { Regions } from '../../Region/Regions';
import { LocaleError } from '../Error/LocaleError';
import { Locale } from '../Locale';

describe('Locale', () => {
  describe('empty', () => {
    it('generates 0-length Regions, and Languages', () => {
      expect.assertions(2);

      const locale: Locale = Locale.empty();

      expect(locale.getLanguages()).toBe(Languages.empty());
      expect(locale.getRegions()).toBe(Regions.empty());
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Locale.empty()).toBe(Locale.empty());
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      expect.assertions(9);

      const languages: Array<LanguageJSON> = [
        {
          languageID: UUID.v4().get(),
          name: 'language name',
          englishName: 'english language name',
          iso639: 'ab'
        }
      ];
      const regions: Array<RegionJSON> = [
        {
          regionID: UUID.v4().get(),
          name: 'region name',
          iso3166: 'abc'
        }
      ];

      const locale: Locale = Locale.ofJSON({
        languages,
        regions
      });

      expect(locale.getLanguages().size()).toBe(languages.length);
      for (let i: number = 0; i < locale.getLanguages().size(); i++) {
        const language: Nullable<Language> = locale.getLanguages().get(LanguageID.ofString(languages[i].languageID));

        expect(language?.getLanguageID().get().get()).toBe(languages[i].languageID);
        expect(language?.getName().get()).toBe(languages[i].name);
        expect(language?.getEnglishName().get()).toBe(languages[i].englishName);
        expect(language?.getISO639().get()).toBe(languages[i].iso639);
      }

      expect(locale.getRegions().size()).toBe(regions.length);
      for (let i: number = 0; i < locale.getRegions().size(); i++) {
        const region: Nullable<Region> = locale.getRegions().get(RegionID.ofString(regions[i].regionID));

        expect(region?.getRegionID().get().get()).toBe(regions[i].regionID);
        expect(region?.getName().get()).toBe(regions[i].name);
        expect(region?.getISO3166().get()).toBe(regions[i].iso3166);
      }
    });

    it('has malformat languageID', () => {
      expect.assertions(1);

      const languages: Array<LanguageJSON> = [
        {
          languageID: 'cinque',
          name: 'language name',
          englishName: 'english language name',
          iso639: 'ab'
        }
      ];
      const regions: Array<RegionJSON> = [
        {
          regionID: UUID.v4().get(),
          name: 'region name',
          iso3166: 'abc'
        }
      ];

      expect(() => {
        Locale.ofJSON({
          languages,
          regions
        });
      }).toThrow(LocaleError);
    });

    it('has malformat regionID', () => {
      expect.assertions(1);

      const languages: Array<LanguageJSON> = [
        {
          languageID: UUID.v4().get(),
          name: 'language name',
          englishName: 'english language name',
          iso639: 'ab'
        }
      ];
      const regions: Array<RegionJSON> = [
        {
          regionID: 'cinque',
          name: 'region name',
          iso3166: 'abc'
        }
      ];

      expect(() => {
        Locale.ofJSON({
          languages,
          regions
        });
      }).toThrow(LocaleError);
    });
  });

  describe('equals', () => {
    it('returns true if languages and regions are the same', () => {
      expect.assertions(5);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const locale1: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(uuid1)
          }),
          new MockLanguage({
            languageID: new MockLanguageID(uuid2)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(uuid1)
          }),
          new MockRegion({
            regionID: new MockRegionID(uuid2)
          })
        )
      );
      const locale2: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(uuid1)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(uuid1)
          }),
          new MockRegion({
            regionID: new MockRegionID(uuid2)
          })
        )
      );
      const locale3: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(uuid1)
          }),
          new MockLanguage({
            languageID: new MockLanguageID(uuid2)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(uuid2)
          })
        )
      );
      const locale4: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(uuid1)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(uuid1)
          })
        )
      );
      const locale5: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(uuid1)
          }),
          new MockLanguage({
            languageID: new MockLanguageID(uuid2)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(uuid1)
          }),
          new MockRegion({
            regionID: new MockRegionID(uuid2)
          })
        )
      );

      expect(locale1.equals(locale1)).toBe(true);
      expect(locale1.equals(locale2)).toBe(false);
      expect(locale1.equals(locale3)).toBe(false);
      expect(locale1.equals(locale4)).toBe(false);
      expect(locale1.equals(locale5)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const languages: Array<LanguageJSON> = [
        {
          languageID: uuid1.get(),
          name: 'language name',
          englishName: 'english language name',
          iso639: 'ab'
        }
      ];
      const regions: Array<RegionJSON> = [
        {
          regionID: uuid2.get(),
          name: 'region name',
          iso3166: 'abc'
        }
      ];

      const locale: Locale = Locale.ofJSON({
        languages,
        regions
      });

      expect(locale.toJSON()).toStrictEqual({
        languages: [
          {
            languageID: uuid1.get(),
            name: 'language name',
            englishName: 'english language name',
            iso639: 'ab'
          }
        ],
        regions: [
          {
            regionID: uuid2.get(),
            name: 'region name',
            iso3166: 'abc'
          }
        ]
      });
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

      const n: unknown = {
        languages: [
          {
            languageID: 'qui',
            name: 'language name',
            englishName: 'english language name',
            iso639: 'ab'
          }
        ],
        regions: [
          {
            regionID: 'qua',
            name: 'region name',
            iso3166: 'abc'
          }
        ]
      };

      expect(Locale.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(Locale.validate(null)).toBe(false);
      expect(Locale.validate(undefined)).toBe(false);
      expect(Locale.validate(56)).toBe(false);
      expect(Locale.validate('fjafsd')).toBe(false);
      expect(Locale.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect.assertions(1);

      expect(Locale.validate({})).toBe(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const name1: string = 'language 1';
      const name2: string = 'language 2';
      const name3: string = 'region 3';
      const name4: string = 'region 4';
      const englishName1: string = 'english language 1';
      const englishName2: string = 'english language 2';
      const iso6391: string = 'aa';
      const iso6392: string = 'ab';
      const iso31661: string = 'abc';
      const iso31662: string = 'abd';

      const locale: Locale = Locale.of(
        Languages.ofArray([
          Language.of(LanguageID.of(uuid1), LanguageName.of(name1), LanguageName.of(englishName1), ISO639.of(iso6391)),
          Language.of(LanguageID.of(uuid2), LanguageName.of(name2), LanguageName.of(englishName2), ISO639.of(iso6392))
        ]),
        Regions.ofArray([
          Region.of(RegionID.of(uuid3), RegionName.of(name3), ISO3166.of(iso31661)),
          Region.of(RegionID.of(uuid4), RegionName.of(name4), ISO3166.of(iso31662))
        ])
      );

      expect(locale.toString()).toBe(`{${uuid1.get()}: ${uuid1.get()} ${name1} ${englishName1} ${iso6391}}, {${uuid2.get()}: ${uuid2.get()} ${name2} ${englishName2} ${iso6392}} {${uuid3.get()}: ${uuid3.get()} ${name3} ${iso31661}}, {${uuid4.get()}: ${uuid4.get()} ${name4} ${iso31662}}`);
    });
  });
});
