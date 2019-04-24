/* tslint:disable */
import 'jest';
import { NoSuchElementError } from '../../../veau-general/Error/NoSuchElementError';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { Region } from '../../../veau-vo/Region';
import { RegionID } from '../../../veau-vo/RegionID';
import { LocaleMemoryQuery } from '../LocaleMemoryQuery';

describe('LocaleMemoryQuery', () => {
  it('findByISO639', () => {
    const iso6391: ISO639 = ISO639.of('ab');
    const iso6392: ISO639 = ISO639.of('aa');
    const iso6393: ISO639 = ISO639.of('af');
    const language1: Language = Language.of(LanguageID.of(1), 'language1', 'language1', iso6391);
    const language2: Language = Language.of(LanguageID.of(2), 'language2', 'language2', iso6392);
    const language3: Language = Language.of(LanguageID.of(3), 'language3', 'language3', iso6393);

    const localeQuery: LocaleMemoryQuery = LocaleMemoryQuery.getInstance(
      [
        language1,
        language2,
        language3
      ],
      [
      ]
    );

    const language: Language = localeQuery.findByISO639(iso6393);

    expect(language.equals(language3)).toEqual(true);
  });

  it('findByISO639: throws error', () => {
    const iso6391: ISO639 = ISO639.of('ab');
    const iso6392: ISO639 = ISO639.of('aa');
    const iso6393: ISO639 = ISO639.of('af');
    const language1: Language = Language.of(LanguageID.of(1), 'language1', 'language1', iso6391);
    const language2: Language = Language.of(LanguageID.of(2), 'language2', 'language2', iso6392);

    const localeQuery: LocaleMemoryQuery = LocaleMemoryQuery.getInstance(
      [
        language1,
        language2
      ],
      [
      ]
    );

    expect(() => {
      localeQuery.findByISO639(iso6393);
    }).toThrow(NoSuchElementError);
  });

  it('findByISO3166', () => {
    const iso31661: ISO3166 = ISO3166.of('AFG');
    const iso31662: ISO3166 = ISO3166.of('ALB');
    const iso31663: ISO3166 = ISO3166.of('DZA');
    const region1: Region = Region.of(RegionID.of(1), 'region1', iso31661);
    const region2: Region = Region.of(RegionID.of(2), 'region2', iso31662);
    const region3: Region = Region.of(RegionID.of(3), 'region3', iso31663);

    const localeQuery: LocaleMemoryQuery = LocaleMemoryQuery.getInstance(
      [
      ],
      [
        region1,
        region2,
        region3
      ]
    );

    const region: Region = localeQuery.findByISO3166(iso31662);

    expect(region.equals(region2)).toEqual(true);
  });

  it('findByISO3166: throws error', () => {
    const iso31661: ISO3166 = ISO3166.of('AFG');
    const iso31662: ISO3166 = ISO3166.of('ALB');
    const iso31663: ISO3166 = ISO3166.of('DZA');
    const region1: Region = Region.of(RegionID.of(1), 'region1', iso31661);
    const region2: Region = Region.of(RegionID.of(2), 'region2', iso31662);

    const localeQuery: LocaleMemoryQuery = LocaleMemoryQuery.getInstance(
      [
      ],
      [
        region1,
        region2
      ]
    );

    expect(() => {
      localeQuery.findByISO3166(iso31663);
    }).toThrow(NoSuchElementError);
  });
});
