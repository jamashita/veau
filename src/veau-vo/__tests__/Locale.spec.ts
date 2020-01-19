import 'jest';
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

describe('Locale', () => {
  describe('equals', () => {
    it('returns true if languages and regions are the same', () => {
      const languages1: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa')),
        Language.of(LanguageID.of(2), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions1: Regions = Regions.of([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb')),
        Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale1: Locale = Locale.of(languages1, regions1);

      const languages2: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions2: Regions = Regions.of([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb')),
        Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale2: Locale = Locale.of(languages2, regions2);

      const languages3: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa')),
        Language.of(LanguageID.of(2), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions3: Regions = Regions.of([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale3: Locale = Locale.of(languages3, regions3);

      const languages4: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions4: Regions = Regions.of([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale4: Locale = Locale.of(languages4, regions4);

      const languages5: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa')),
        Language.of(LanguageID.of(2), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions5: Regions = Regions.of([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb')),
        Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale5: Locale = Locale.of(languages5, regions5);

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
      const language1: Language = Language.of(LanguageID.of(id1), LanguageName.of(name1), LanguageName.of(englishName1), ISO639.of(iso6391));
      const language2: Language = Language.of(LanguageID.of(id2), LanguageName.of(name2), LanguageName.of(englishName2), ISO639.of(iso6392));
      const region1: Region = Region.of(RegionID.of(id3), RegionName.of(name3), ISO3166.of(iso31661));
      const region2: Region = Region.of(RegionID.of(id4), RegionName.of(name4), ISO3166.of(iso31662));
      const languages: Languages = Languages.of([language1, language2]);
      const regions: Regions = Regions.of([region1, region2]);

      const locale: Locale = Locale.of(languages, regions);

      expect(locale.toString()).toEqual(`${id1} ${name1} ${englishName1} ${iso6391}, ${id2} ${name2} ${englishName2} ${iso6392} ${id3} ${name3} ${iso31661}, ${id4} ${name4} ${iso31662}`);
    });
  });

  describe('default', () => {
    it('generates 0-length Regions , and Languages', () => {
      const locale: Locale = Locale.default();
      expect(locale.getRegions().size()).toEqual(0);
      expect(locale.getLanguages().size()).toEqual(0);
    });
  });
});
