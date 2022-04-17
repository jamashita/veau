import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { Language, LanguageJSON } from '../../Language/Language';
import { LanguageID } from '../../Language/LanguageID';
import { Languages } from '../../Language/Languages';
import { MockLanguage } from '../../Language/mock/MockLanguage';
import { MockRegion } from '../../Region/mock/MockRegion';
import { Region, RegionJSON } from '../../Region/Region';
import { RegionID } from '../../Region/RegionID';
import { Regions } from '../../Region/Regions';
import { Locale } from '../Locale';
import { LocaleError } from '../LocaleError';

describe('Locale', () => {
  describe('empty', () => {
    it('generates 0-length Regions, and Languages', () => {
      const locale: Locale = Locale.empty();

      expect(locale.getLanguages()).toBe(Languages.empty());
      expect(locale.getRegions()).toBe(Regions.empty());
    });

    it('returns singleton instance', () => {
      expect(Locale.empty()).toBe(Locale.empty());
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
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
      expect(locale.getRegions().size()).toBe(regions.length);

      languages.forEach((json: LanguageJSON) => {
        const l: Nullable<Language> = locale.getLanguages().get(LanguageID.ofString(json.languageID));

        expect(json.languageID).toBe(l?.getLanguageID().toString());
        expect(json.name).toBe(l?.getName().toString());
        expect(json.englishName).toBe(l?.getEnglishName().toString());
        expect(json.iso639).toBe(l?.getISO639().toString());
      });

      regions.forEach((json: RegionJSON) => {
        const r: Nullable<Region> = locale.getRegions().get(RegionID.ofString(json.regionID));

        expect(json.regionID).toBe(r?.getRegionID().toString());
        expect(json.name).toBe(r?.getName().toString());
        expect(json.iso3166).toBe(r?.getISO3166().toString());
      });
    });

    it('has malformat languageID', () => {
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
    it('returns false if others given', () => {
      const locale: Locale = Locale.empty();

      expect(locale.equals(null)).toBe(false);
      expect(locale.equals(undefined)).toBe(false);
      expect(locale.equals('')).toBe(false);
      expect(locale.equals('123')).toBe(false);
      expect(locale.equals('abcd')).toBe(false);
      expect(locale.equals(123)).toBe(false);
      expect(locale.equals(0)).toBe(false);
      expect(locale.equals(-12)).toBe(false);
      expect(locale.equals(0.3)).toBe(false);
      expect(locale.equals(false)).toBe(false);
      expect(locale.equals(true)).toBe(false);
      expect(locale.equals(Symbol('p'))).toBe(false);
      expect(locale.equals(20n)).toBe(false);
      expect(locale.equals({})).toBe(false);
      expect(locale.equals([])).toBe(false);
      expect(locale.equals(Object.create(null))).toBe(false);
    });

    it('returns true if languages and regions are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const locale1: Locale = Locale.of(
        Languages.ofSpread(
          new MockLanguage({
            languageID: LanguageID.of(uuid1)
          }),
          new MockLanguage({
            languageID: LanguageID.of(uuid2)
          })
        ),
        Regions.ofSpread(
          new MockRegion({
            regionID: RegionID.of(uuid1)
          }),
          new MockRegion({
            regionID: RegionID.of(uuid2)
          })
        )
      );
      const locale2: Locale = Locale.of(
        Languages.ofSpread(
          new MockLanguage({
            languageID: LanguageID.of(uuid1)
          })
        ),
        Regions.ofSpread(
          new MockRegion({
            regionID: RegionID.of(uuid1)
          }),
          new MockRegion({
            regionID: RegionID.of(uuid2)
          })
        )
      );
      const locale3: Locale = Locale.of(
        Languages.ofSpread(
          new MockLanguage({
            languageID: LanguageID.of(uuid1)
          }),
          new MockLanguage({
            languageID: LanguageID.of(uuid2)
          })
        ),
        Regions.ofSpread(
          new MockRegion({
            regionID: RegionID.of(uuid2)
          })
        )
      );
      const locale4: Locale = Locale.of(
        Languages.ofSpread(
          new MockLanguage({
            languageID: LanguageID.of(uuid1)
          })
        ),
        Regions.ofSpread(
          new MockRegion({
            regionID: RegionID.of(uuid1)
          })
        )
      );
      const locale5: Locale = Locale.of(
        Languages.ofSpread(
          new MockLanguage({
            languageID: LanguageID.of(uuid1)
          }),
          new MockLanguage({
            languageID: LanguageID.of(uuid2)
          })
        ),
        Regions.ofSpread(
          new MockRegion({
            regionID: RegionID.of(uuid1)
          }),
          new MockRegion({
            regionID: RegionID.of(uuid2)
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
      expect(Locale.validate(null)).toBe(false);
      expect(Locale.validate(undefined)).toBe(false);
      expect(Locale.validate(56)).toBe(false);
      expect(Locale.validate('fjafsd')).toBe(false);
      expect(Locale.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect(Locale.validate({})).toBe(false);
    });
  });
});
