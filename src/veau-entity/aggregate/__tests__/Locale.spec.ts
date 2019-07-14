import 'jest';
import { LanguageJSON } from '../../Language';
import { RegionJSON } from '../../Region';
import { Locale } from '../Locale';

describe('Locale', () => {
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
