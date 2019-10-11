import 'jest';
import { ISO3166 } from '../../ISO3166';
import { ISO639 } from '../../ISO639';
import { LanguageID } from '../../LanguageID';
import { LanguageName } from '../../LanguageName';
import { RegionID } from '../../RegionID';
import { RegionName } from '../../RegionName';
import { Languages } from '../../collection/Languages';
import { Regions } from '../../collection/Regions';
import { Language, LanguageJSON } from '../../Language';
import { Region, RegionJSON } from '../../Region';
import { Locale } from '../Locale';

describe('Locale', () => {
  describe('equals', () => {
    it('returns true if languages and regions are the same', () => {
      const languages1: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa')),
        Language.of(LanguageID.of(2), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions1: Regions = Regions.from([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb')),
        Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale1: Locale = Locale.from(languages1, regions1);

      const languages2: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions2: Regions = Regions.from([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb')),
        Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale2: Locale = Locale.from(languages2, regions2);

      const languages3: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa')),
        Language.of(LanguageID.of(2), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions3: Regions = Regions.from([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale3: Locale = Locale.from(languages3, regions3);

      const languages4: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions4: Regions = Regions.from([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale4: Locale = Locale.from(languages4, regions4);

      const languages5: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa')),
        Language.of(LanguageID.of(2), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('aa'))
      ]);
      const regions5: Regions = Regions.from([
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('bb')),
        Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('bb'))
      ]);
      const locale5: Locale = Locale.from(languages5, regions5);

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

      const locale: Locale = Locale.fromJSON({
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
});
