import 'jest';
import { Term } from '../../veau-enum/Term';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { UpdatedAt } from '../../veau-vo/UpdatedAt';
import { Language } from '../../veau-vo/Language';
import { Region } from '../Region';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../StatsOutline';

describe('StatsOutline', () => {
  describe('equals', () => {
    it('returns true if the ids equals', () => {
      const statsOutline1: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline2: StatsOutline = StatsOutline.from(
        StatsID.of('f19bca43-511f-4d8c-bd12-af27bf0cd429'),
        Language.of(LanguageID.of(2), LanguageName.of('language2'), LanguageName.of('LANGUAGE2'), ISO639.of('lang2')),
        Region.from(RegionID.of(2), RegionName.of('region2'), ISO3166.of('REGION2')),
        Term.WEEKLY,
        StatsName.of('name2'),
        StatsUnit.of('unit2'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline3: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(2), LanguageName.of('language2'), LanguageName.of('LANGUAGE2'), ISO639.of('lang2')),
        Region.from(RegionID.of(2), RegionName.of('region2'), ISO3166.of('REGION2')),
        Term.WEEKLY,
        StatsName.of('name2'),
        StatsUnit.of('unit2'),
        UpdatedAt.ofString('2000-01-01')
      );

      expect(statsOutline1.equals(statsOutline1)).toEqual(true);
      expect(statsOutline1.equals(statsOutline2)).toEqual(false);
      expect(statsOutline1.equals(statsOutline3)).toEqual(true);
    });
  });

  describe('isSame', () => {
    it('returns true if all the properties are the same', () => {
      const statsOutline1: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline2: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120f'),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline3: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(2), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline4: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(2), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline5: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.WEEKLY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline6: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name2'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline7: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit2'),
        UpdatedAt.ofString('2000-01-01')
      );
      const statsOutline8: StatsOutline = StatsOutline.from(
        StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'),
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-02')
      );

      expect(statsOutline1.isSame(statsOutline1)).toEqual(true);
      expect(statsOutline1.isSame(statsOutline2)).toEqual(false);
      expect(statsOutline1.isSame(statsOutline3)).toEqual(false);
      expect(statsOutline1.isSame(statsOutline4)).toEqual(false);
      expect(statsOutline1.isSame(statsOutline5)).toEqual(false);
      expect(statsOutline1.isSame(statsOutline6)).toEqual(false);
      expect(statsOutline1.isSame(statsOutline7)).toEqual(false);
      expect(statsOutline1.isSame(statsOutline8)).toEqual(false);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of('bfb0ebff-fc8c-450e-9265-82fa4938ae94');
      const statsOutline: StatsOutline = StatsOutline.from(
        statsID,
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('englishname1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01')
      );

      expect(statsOutline.toJSON()).toEqual({
        statsID: 'bfb0ebff-fc8c-450e-9265-82fa4938ae94',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'englishname1',
          iso639: 'lang1'
        },
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'name1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      });
    });
  });

  describe('isFilled', () => {
    it('returns true is language, region, name and unit are filled', () => {
      const statsOutline1: StatsOutline = StatsOutline.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.default(), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'));
      const statsOutline2: StatsOutline = StatsOutline.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'));
      const statsOutline3: StatsOutline = StatsOutline.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.default(), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'));
      const statsOutline4: StatsOutline = StatsOutline.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'));
      const statsOutline5: StatsOutline = StatsOutline.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'));
      const statsOutline6: StatsOutline = StatsOutline.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'));
      const statsOutline7: StatsOutline = StatsOutline.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'));

      expect(statsOutline1.isFilled()).toEqual(false);
      expect(statsOutline2.isFilled()).toEqual(false);
      expect(statsOutline3.isFilled()).toEqual(false);
      expect(statsOutline4.isFilled()).toEqual(false);
      expect(statsOutline5.isFilled()).toEqual(false);
      expect(statsOutline6.isFilled()).toEqual(false);
      expect(statsOutline7.isFilled()).toEqual(true);
    });
  });

  describe('copy', () => {
    it('every properties are copied', () => {
      const statsID: StatsID = StatsID.of('f330c618-6127-46d1-ba10-a9f6af458b4c');
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(2), RegionName.of('region'), ISO3166.of('AFG'));
      const term: Term = Term.DAILY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01');

      const statsOutline: StatsOutline = StatsOutline.from(statsID, language, region, term, name, unit, updatedAt);
      const copy: StatsOutline = statsOutline.copy();

      expect(statsOutline).not.toBe(copy);
      expect(statsOutline.getStatsID()).toEqual(statsID);
      expect(statsOutline.getLanguage()).toEqual(language);
      expect(statsOutline.getRegion()).toEqual(region);
      expect(statsOutline.getTerm()).toEqual(term);
      expect(statsOutline.getName()).toEqual(name);
      expect(statsOutline.getUnit()).toEqual(unit);
      expect(statsOutline.getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('from', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of('af272303-df5d-4d34-8604-398920b7d2bb');
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language english name 1'), ISO639.of('lang1'));
      const region: Region = Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: StatsName = StatsName.of('name1');
      const unit: StatsUnit = StatsUnit.of('unit1');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01');

      const statsOutline: StatsOutline = StatsOutline.from(statsID, language, region, term, name, unit, updatedAt);

      expect(statsOutline.getStatsID()).toEqual(statsID);
      expect(statsOutline.getLanguage()).toEqual(language);
      expect(statsOutline.getRegion()).toEqual(region);
      expect(statsOutline.getTerm()).toEqual(term);
      expect(statsOutline.getName()).toEqual(name);
      expect(statsOutline.getUnit()).toEqual(unit);
      expect(statsOutline.getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: StatsOutlineJSON = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
        },
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      const statsOutline: StatsOutline = StatsOutline.fromJSON(json);

      expect(statsOutline.getStatsID().get()).toEqual(json.statsID);
      expect(statsOutline.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(statsOutline.getLanguage().getName().get()).toEqual(json.language.name);
      expect(statsOutline.getLanguage().getEnglishName().get()).toEqual(json.language.englishName);
      expect(statsOutline.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(statsOutline.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(statsOutline.getRegion().getName().get()).toEqual(json.region.name);
      expect(statsOutline.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
      expect(statsOutline.getTerm().getID()).toEqual(json.termID);
      expect(statsOutline.getName().get()).toEqual(json.name);
      expect(statsOutline.getUnit().get()).toEqual(json.unit);
      expect(statsOutline.getUpdatedAt().getString()).toEqual(json.updatedAt);
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const row: StatsOutlineRow = {
        statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
        languageID: 1,
        languageName: 'language1',
        languageEnglishName: 'englishLanguage1',
        iso639: 'lang1',
        regionID: 2,
        regionName: 'region1',
        iso3166: 'regn1',
        termID: 3,
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };

      const statsOutline: StatsOutline = StatsOutline.fromRow(row);

      expect(statsOutline.toJSON()).toEqual({
        statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'englishLanguage1',
          iso639: 'lang1'
        },
        region: {
          regionID: 2,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 3,
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      });
    });
  });
});
