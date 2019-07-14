import 'jest';
import * as moment from 'moment';
import { StatsItems } from '../../veau-entity/collection/StatsItems';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { Stats, StatsJSON, StatsRow } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { Term } from '../../veau-enum/Term';
import { StatsValues } from '../../veau-vo/collection/StatsValues';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsFactory } from '../StatsFactory';

describe('StatsFactory', () => {
  describe('from', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of('af272303-df5d-4d34-8604-398920b7d2bb');
      const language: Language = Language.from(LanguageID.of(1), 'language1', 'language english name 1', ISO639.of('lang1'));
      const region: Region = new Region(RegionID.of(1), 'region1', ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: string = 'name1';
      const unit: string = 'unit1';
      const updatedAt: moment.Moment = moment('2000-01-01');
      const items: StatsItems = StatsItems.of([
        new StatsItem(StatsItemID.of('a28eceac-0451-4339-b1c5-0c298b3905f6'), 'stats1', StatsValues.of([]))
      ]);

      const statsFactory: StatsFactory = StatsFactory.getInstance();
      const stats: Stats = statsFactory.from(statsID, language, region, term, name, unit, updatedAt, items);

      expect(stats.getStatsID()).toEqual(statsID);
      expect(stats.getLanguage()).toEqual(language);
      expect(stats.getRegion()).toEqual(region);
      expect(stats.getTerm()).toEqual(term);
      expect(stats.getName()).toEqual(name);
      expect(stats.getUnit()).toEqual(unit);
      expect(stats.getUpdatedAt()).toEqual(updatedAt);
      expect(stats.getItems().equals(items)).toEqual(true);
    });
  });

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: StatsJSON = {
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
        updatedAt: '2000-01-01T00:00:00.000',
        items: [
          {
            statsItemID: '04166d3c-be62-4e13-8231-e718b5b96683',
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: '',
            name: 'stats item2',
            values: [
              {
                asOf: '2002-01-01',
                value: 10
              },
              {
                asOf: '2002-01-02',
                value: 100
              }
            ]
          }
        ]
      };

      const statsFactory: StatsFactory = StatsFactory.getInstance();
      const stats: Stats = statsFactory.fromJSON(json);

      expect(stats.getStatsID().get()).toEqual(json.statsID);
      expect(stats.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(stats.getLanguage().getName()).toEqual(json.language.name);
      expect(stats.getLanguage().getEnglishName()).toEqual(json.language.englishName);
      expect(stats.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(stats.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(stats.getRegion().getName()).toEqual(json.region.name);
      expect(stats.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
      expect(stats.getTerm().getID()).toEqual(json.termID);
      expect(stats.getName()).toEqual(json.name);
      expect(stats.getUnit()).toEqual(json.unit);
      expect(stats.getUpdatedAt().get('seconds')).toEqual(moment(json.updatedAt).get('seconds'));
      expect(stats.getItems().length()).toEqual(json.items.length);
      for (let i = 0; i < stats.getItems().length(); i++) {
        expect(stats.getItems().get(i).getStatsItemID().get()).toEqual(json.items[i].statsItemID);
        expect(stats.getItems().get(i).getName()).toEqual(json.items[i].name);
        expect(stats.getItems().get(i).getValues().length()).toEqual(json.items[i].values.length);
        for (let j = 0; j < stats.getItems().get(i).getValues().length(); j++) {
          expect(stats.getItems().get(i).getValues().get(j).getAsOfAsString()).toEqual(json.items[i].values[j].asOf);
          expect(stats.getItems().get(i).getValues().get(j).getValue()).toEqual(json.items[i].values[j].value);
        }
      }
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const row: StatsRow = {
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
      const items: Array<StatsItem> = [
        new StatsItem(
          StatsItemID.of('610b532b-5711-461a-b44a-7387e8d08596'),
          'stats item1',
          StatsValues.of([
            StatsValue.of(moment('2000-01-01'), 1),
            StatsValue.of(moment('2000-01-02'), 2)
          ])
        ),
        new StatsItem(
          StatsItemID.of('530e0e07-654f-4764-a3ac-77ce12a2a5e4'),
          'stats item2',
          StatsValues.of([
          ])
        )
      ];

      const statsFactory: StatsFactory = StatsFactory.getInstance();
      const stats: Stats = statsFactory.fromRow(row, items);

      expect(stats.toJSON()).toEqual({
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
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '610b532b-5711-461a-b44a-7387e8d08596',
            name: 'stats item1',
            values: [
              {
                asOf: '2000-01-01',
                value: 1
              },
              {
                asOf: '2000-01-02',
                value: 2
              }
            ]
          },
          {
            statsItemID: '530e0e07-654f-4764-a3ac-77ce12a2a5e4',
            name: 'stats item2',
            values: [
            ]
          }
        ]
      });
    });
  });
});
