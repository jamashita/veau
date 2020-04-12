import { ISO3166 } from '../ISO3166';
import { ISO639 } from '../ISO639';
import { Language, LanguageJSON } from '../Language';
import { LanguageID } from '../LanguageID';
import { LanguageName } from '../LanguageName';
import { Languages } from '../Languages';
import { Locale } from '../Locale';
import { Region, RegionJSON } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { Regions } from '../Regions';
import { MockLanguages } from '../Mock/MockLanguages';
import { MockLanguage } from '../Mock/MockLanguage';
import { MockLanguageID } from '../Mock/MockLanguageID';
import { MockRegions } from '../Mock/MockRegions';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';

describe('Locale', () => {
  describe('ofJSON', () => {
    it('normal case', () => {
      const languages: Array<LanguageJSON> = [
        {
          languageID: 1,
          name: 'language name',
          englishName: 'english language name',
          iso639: 'ab'
        }
      ];
      const regions: Array<RegionJSON> = [
        {
          regionID: 2,
          name: 'region name',
          iso3166: 'abc'
        }
      ];

      const locale: Locale = Locale.ofJSON({
        languages,
        regions
      });

      expect(locale.getLanguages().size()).toEqual(languages.length);
      for (let i: number = 0; i < locale.getLanguages().size(); i++) {
        const language: Language = locale.getLanguages().get(i).get();
        expect(language.getLanguageID().get()).toEqual(languages[i].languageID);
        expect(language.getName().get()).toEqual(languages[i].name);
        expect(language.getEnglishName().get()).toEqual(languages[i].englishName);
        expect(language.getISO639().get()).toEqual(languages[i].iso639);
      }
      expect(locale.getRegions().size()).toEqual(regions.length);
      for (let i: number = 0; i < locale.getRegions().size(); i++) {
        const region: Region = locale.getRegions().get(i).get();
        expect(region.getRegionID().get()).toEqual(regions[i].regionID);
        expect(region.getName().get()).toEqual(regions[i].name);
        expect(region.getISO3166().get()).toEqual(regions[i].iso3166);
      }
    });
  });

  describe('default', () => {
    it('generates 0-length Regions, and Languages', () => {
      const locale: Locale = Locale.default();
      expect(locale.getRegions().size()).toEqual(0);
      expect(locale.getLanguages().size()).toEqual(0);
    });
  });

  describe('equals', () => {
    it('returns true if languages and regions are the same', () => {
      const locale1: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(1)
          }),
          new MockLanguage({
            languageID: new MockLanguageID(2)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(1)
          }),
          new MockRegion({
            regionID: new MockRegionID(2)
          })
        )
      );
      const locale2: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(1)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(1)
          }),
          new MockRegion({
            regionID: new MockRegionID(2)
          })
        )
      );
      const locale3: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(1)
          }),
          new MockLanguage({
            languageID: new MockLanguageID(2)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(2)
          })
        )
      );
      const locale4: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(1)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(1)
          })
        )
      );
      const locale5: Locale = Locale.of(
        new MockLanguages(
          new MockLanguage({
            languageID: new MockLanguageID(1)
          }),
          new MockLanguage({
            languageID: new MockLanguageID(2)
          })
        ),
        new MockRegions(
          new MockRegion({
            regionID: new MockRegionID(1)
          }),
          new MockRegion({
            regionID: new MockRegionID(2)
          })
        )
      );

      expect(locale1.equals(locale1)).toEqual(true);
      expect(locale1.equals(locale2)).toEqual(false);
      expect(locale1.equals(locale3)).toEqual(false);
      expect(locale1.equals(locale4)).toEqual(false);
      expect(locale1.equals(locale5)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const languages: Array<LanguageJSON> = [
        {
          languageID: 1,
          name: 'language name',
          englishName: 'english language name',
          iso639: 'ab'
        }
      ];
      const regions: Array<RegionJSON> = [
        {
          regionID: 2,
          name: 'region name',
          iso3166: 'abc'
        }
      ];

      const locale: Locale = Locale.ofJSON({
        languages,
        regions
      });

      expect(locale.toJSON()).toEqual({
        languages: [
          {
            languageID: 1,
            name: 'language name',
            englishName: 'english language name',
            iso639: 'ab'
          }
        ],
        regions: [
          {
            regionID: 2,
            name: 'region name',
            iso3166: 'abc'
          }
        ]
      });
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id1: number = 1;
      const id2: number = 2;
      const id3: number = 3;
      const id4: number = 4;
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
        Languages.ofSpread(
          Language.of(
            LanguageID.of(id1),
            LanguageName.of(name1),
            LanguageName.of(englishName1),
            ISO639.of(iso6391)
          ),
          Language.of(
            LanguageID.of(id2),
            LanguageName.of(name2),
            LanguageName.of(englishName2),
            ISO639.of(iso6392)
          )
        ),
        Regions.ofSpread(
          Region.of(
            RegionID.of(id3),
            RegionName.of(name3),
            ISO3166.of(iso31661)
          ),
          Region.of(
            RegionID.of(id4),
            RegionName.of(name4),
            ISO3166.of(iso31662)
          )
        )
      );

      expect(locale.toString()).toEqual(`${id1} ${name1} ${englishName1} ${iso6391}, ${id2} ${name2} ${englishName2} ${iso6392} ${id3} ${name3} ${iso31661}, ${id4} ${name4} ${iso31662}`);
    });
  });
});
