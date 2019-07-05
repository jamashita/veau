import 'jest';
import * as moment from 'moment';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../../veau-entity/StatsOutline';
import { Term } from '../../veau-enum/Term';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsOutlineFactory } from '../StatsOutlineFactory';

describe('StatsOutlineFactory', () => {
  describe('from', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of('af272303-df5d-4d34-8604-398920b7d2bb');
      const language: Language = new Language(LanguageID.of(1), 'language1', 'language english name 1', ISO639.of('lang1'));
      const region: Region = new Region(RegionID.of(1), 'region1', ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: string = 'name1';
      const unit: string = 'unit1';
      const updatedAt: moment.Moment = moment('2000-01-01');

      const statsOutlineFactory: StatsOutlineFactory = StatsOutlineFactory.getInstance();
      const statsOutline: StatsOutline = statsOutlineFactory.from(statsID, language, region, term, name, unit, updatedAt);

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
        updatedAt: '2000-01-01T00:00:00.000'
      };

      const statsOutlineFactory: StatsOutlineFactory = StatsOutlineFactory.getInstance();
      const statsOutline: StatsOutline = statsOutlineFactory.fromJSON(json);

      expect(statsOutline.getStatsID().get()).toEqual(json.statsID);
      expect(statsOutline.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(statsOutline.getLanguage().getName()).toEqual(json.language.name);
      expect(statsOutline.getLanguage().getEnglishName()).toEqual(json.language.englishName);
      expect(statsOutline.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(statsOutline.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(statsOutline.getRegion().getName()).toEqual(json.region.name);
      expect(statsOutline.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
      expect(statsOutline.getTerm().getID()).toEqual(json.termID);
      expect(statsOutline.getName()).toEqual(json.name);
      expect(statsOutline.getUnit()).toEqual(json.unit);
      expect(statsOutline.getUpdatedAt().get('seconds')).toEqual(moment(json.updatedAt).get('seconds'));
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
        updatedAt: '2000-01-01T00:00:00.000Z'
      };

      const statsOutlineFactory: StatsOutlineFactory = StatsOutlineFactory.getInstance();
      const statsOutline: StatsOutline = statsOutlineFactory.fromRow(row);

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
