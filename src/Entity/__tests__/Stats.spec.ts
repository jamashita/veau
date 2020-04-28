import { Present, Superposition, UUID } from 'publikum';
import { StatsError } from '../../Error/StatsError';
import { AsOf } from '../../VO/AsOf';
import { AsOfs } from '../../VO/AsOfs';
import { Column } from '../../VO/Column';
import { Coordinate } from '../../VO/Coordinate';
import { ISO3166 } from '../../VO/ISO3166';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { LanguageID } from '../../VO/LanguageID';
import { LanguageName } from '../../VO/LanguageName';
import { MockAsOf } from '../../VO/Mock/MockAsOf';
import { MockLanguage } from '../../VO/Mock/MockLanguage';
import { MockLanguageID } from '../../VO/Mock/MockLanguageID';
import { MockNumericalValue } from '../../VO/Mock/MockNumericalValue';
import { MockRegion } from '../../VO/Mock/MockRegion';
import { MockRegionID } from '../../VO/Mock/MockRegionID';
import { MockStatsID } from '../../VO/Mock/MockStatsID';
import { MockStatsItemID } from '../../VO/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../VO/Mock/MockStatsItemName';
import { MockStatsName } from '../../VO/Mock/MockStatsName';
import { MockStatsUnit } from '../../VO/Mock/MockStatsUnit';
import { MockStatsValue } from '../../VO/Mock/MockStatsValue';
import { MockStatsValues } from '../../VO/Mock/MockStatsValues';
import { MockTerm } from '../../VO/Mock/MockTerm';
import { MockUpdatedAt } from '../../VO/Mock/MockUpdatedAt';
import { NumericalValue } from '../../VO/NumericalValue';
import { Region } from '../../VO/Region';
import { RegionID } from '../../VO/RegionID';
import { RegionName } from '../../VO/RegionName';
import { Row } from '../../VO/Row';
import { StatsID } from '../../VO/StatsID';
import { StatsItemID } from '../../VO/StatsItemID';
import { StatsItemName } from '../../VO/StatsItemName';
import { StatsItemNames } from '../../VO/StatsItemNames';
import { StatsName } from '../../VO/StatsName';
import { StatsUnit } from '../../VO/StatsUnit';
import { StatsValue } from '../../VO/StatsValue';
import { StatsValues } from '../../VO/StatsValues';
import { Term } from '../../VO/Term';
import { UpdatedAt } from '../../VO/UpdatedAt';
import { MockStatsItem } from '../Mock/MockStatsItem';
import { MockStatsItems } from '../Mock/MockStatsItems';
import { Stats, StatsJSON, StatsRow } from '../Stats';
import { StatsItem } from '../StatsItem';
import { StatsItems } from '../StatsItems';

describe('Stats', () => {
  describe('of', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.ofString('af272303-df5d-4d34-8604-398920b7d2bb').get();
      const language: Language = Language.of(
        LanguageID.of(1),
        LanguageName.of('language1'),
        LanguageName.of('language english name 1'),
        ISO639.of('lang1')
      );
      const region: Region = Region.of(
        RegionID.of(1),
        RegionName.of('region1'),
        ISO3166.of('regn1')
      );
      const term: Term = Term.ANNUAL;
      const name: StatsName = StatsName.of('name1');
      const unit: StatsUnit = StatsUnit.of('unit1');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 02:02:02').get();
      const items: StatsItems = StatsItems.ofArray([
        StatsItem.of(
          StatsItemID.ofString('a28eceac-0451-4339-b1c5-0c298b3905f6').get(),
          StatsItemName.of('stats1'),
          StatsValues.empty()
        )
      ]);

      const stats: Stats = Stats.of(
        statsID,
        language,
        region,
        term,
        name,
        unit,
        updatedAt,
        items
      );

      expect(stats.getStatsID()).toBe(statsID);
      expect(stats.getLanguage()).toBe(language);
      expect(stats.getRegion()).toBe(region);
      expect(stats.getTerm()).toBe(term);
      expect(stats.getName()).toBe(name);
      expect(stats.getUnit()).toBe(unit);
      expect(stats.getUpdatedAt()).toBe(updatedAt);
      expect(stats.getItems()).toBe(items);
    });
  });

  describe('ofJSON', () => {
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
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      const superposition: Superposition<Stats, StatsError> = Stats.ofJSON(json);

      expect(superposition.isAlive()).toBe(true);
      const stats: Stats = superposition.get();
      expect(stats.getStatsID().get().get()).toBe(json.statsID);
      expect(stats.getLanguage().getLanguageID().get()).toBe(json.language.languageID);
      expect(stats.getLanguage().getName().get()).toBe(json.language.name);
      expect(stats.getLanguage().getEnglishName().get()).toBe(json.language.englishName);
      expect(stats.getLanguage().getISO639().get()).toBe(json.language.iso639);
      expect(stats.getRegion().getRegionID().get()).toBe(json.region.regionID);
      expect(stats.getRegion().getName().get()).toBe(json.region.name);
      expect(stats.getRegion().getISO3166().get()).toBe(json.region.iso3166);
      expect(stats.getTerm().getID()).toBe(json.termID);
      expect(stats.getName().get()).toBe(json.name);
      expect(stats.getUnit().get()).toBe(json.unit);
      expect(stats.getUpdatedAt().toString()).toBe(json.updatedAt);
      expect(stats.getItems().size()).toBe(json.items.length);
      for (let i: number = 0; i < stats.getItems().size(); i++) {
        expect(stats.getItems().get(i).get().getStatsItemID().get().get()).toBe(json.items[i].statsItemID);
        expect(stats.getItems().get(i).get().getName().get()).toBe(json.items[i].name);
        expect(stats.getItems().get(i).get().getValues().size()).toBe(json.items[i].values.length);
        for (let j: number = 0; j < stats.getItems().get(i).get().getValues().size(); j++) {
          const asOf: AsOf = AsOf.ofString(json.items[i].values[j].asOf).get();
          expect(stats.getItems().get(i).get().getValues().get(asOf).get().getAsOf().toString()).toBe(json.items[i].values[j].asOf);
          expect(stats.getItems().get(i).get().getValues().get(asOf).get().getValue().get()).toBe(json.items[i].values[j].value);
        }
      }
    });
  });

  describe('ofRow', () => {
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
        updatedAt: '2000-01-01 00:00:00'
      };
      const items: Array<StatsItem> = [
        StatsItem.of(
          StatsItemID.ofString('610b532b-5711-461a-b44a-7387e8d08596').get(),
          StatsItemName.of('stats item1'),
          StatsValues.ofArray([
            StatsValue.of(
              AsOf.ofString('2000-01-01').get(),
              NumericalValue.of(1)
            ),
            StatsValue.of(
              AsOf.ofString('2000-01-02').get(),
              NumericalValue.of(2)
            )
          ])
        ),
        StatsItem.of(
          StatsItemID.ofString('530e0e07-654f-4764-a3ac-77ce12a2a5e4').get(),
          StatsItemName.of('stats item2'),
          StatsValues.ofArray([])
        )
      ];

      const superposition: Superposition<Stats, StatsError> = Stats.ofRow(row, StatsItems.ofArray(items));

      expect(superposition.isAlive()).toBe(true);
      const stats: Stats = superposition.get();
      expect(stats.getStatsID().get().get()).toBe(row.statsID);
      expect(stats.getLanguage().getLanguageID().get()).toBe(row.languageID);
      expect(stats.getLanguage().getName().get()).toBe(row.languageName);
      expect(stats.getLanguage().getEnglishName().get()).toBe(row.languageEnglishName);
      expect(stats.getLanguage().getISO639().get()).toBe(row.iso639);
      expect(stats.getRegion().getRegionID().get()).toBe(row.regionID);
      expect(stats.getRegion().getName().get()).toBe(row.regionName);
      expect(stats.getRegion().getISO3166().get()).toBe(row.iso3166);
      expect(stats.getTerm().getID()).toBe(row.termID);
      expect(stats.getName().get()).toBe(row.name);
      expect(stats.getUnit().get()).toBe(row.unit);
      expect(stats.getUpdatedAt().toString()).toBe(row.updatedAt);
      expect(stats.getItems().size()).toBe(items.length);
      for (let i: number = 0; i < items.length; i++) {
        expect(stats.getItems().get(i).get().getStatsItemID()).toBe(items[i].getStatsItemID());
        expect(stats.getItems().get(i).get().getName()).toBe(items[i].getName());
        expect(stats.getItems().get(i).get().getValues().size()).toBe(items[i].getValues().size());
        for (let j: number = 0; j < stats.getItems().get(i).get().getValues().size(); j++) {
          const asOf: AsOf = items[i].getValues().getAsOfs().get(j).get();
          expect(stats.getItems().get(i).get().getValues().get(asOf).get().getValue()).toBe(items[i].getValues().get(asOf).get().getValue());
        }
      }
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
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
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(Stats.isJSON(null)).toBe(false);
      expect(Stats.isJSON(undefined)).toBe(false);
      expect(Stats.isJSON(56)).toBe(false);
      expect(Stats.isJSON('fjafsd')).toBe(false);
      expect(Stats.isJSON(false)).toBe(false);
    });

    it('returns false because statsID is missing', () => {
      const n: unknown = {
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
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because statsID is not string', () => {
      const n: unknown = {
        statsID: false,
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
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because language is missing', () => {
      const n: unknown = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because language is LanguageJSON', () => {
      const n: unknown = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: true,
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false region statsID is missing', () => {
      const n: unknown = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
        },
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because region is not RegionJSON', () => {
      const n: unknown = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
        },
        region: 8,
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because termID is missing', () => {
      const n: unknown = {
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
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because termID is not number', () => {
      const n: unknown = {
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
        termID: 'soixante',
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because name is missing', () => {
      const n: unknown = {
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
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because name is not string', () => {
      const n: unknown = {
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
        name: null,
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because unit is missing', () => {
      const n: unknown = {
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
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because unit is not string', () => {
      const n: unknown = {
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
        unit: null,
        updatedAt: '2000-01-01 00:00:00',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because updatedAt is missing', () => {
      const n: unknown = {
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because updatedAt is not string', () => {
      const n: unknown = {
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
        updatedAt: 2000,
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because items is missing', () => {
      const n: unknown = {
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

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because items is not array', () => {
      const n: unknown = {
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
        updatedAt: '2000-01-01 00:00:00',
        items: {
          c: {
            statsItemID: '04166d3c-be62-4e13-8231-e718b5b96683',
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          d: {
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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
        }
      };

      expect(Stats.isJSON(n)).toBe(false);
    });
  });

  describe('default', () => {
    it('id will be generated, data are empty', () => {
      const stats: Stats = Stats.default();

      expect(stats.getStatsID().get().get().length).toBe(UUID.size());
      expect(stats.getLanguage().getLanguageID()).toBe(LanguageID.empty());
      expect(stats.getRegion().getRegionID()).toBe(RegionID.empty());
      expect(stats.getTerm()).toBe(Term.DAILY);
      expect(stats.getName()).toBe(StatsName.empty());
      expect(stats.getUnit()).toBe(StatsUnit.empty());
      expect(stats.getItems()).toBe(StatsItems.empty());
      expect(stats.getStartDate().isPresent()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const statsID1: MockStatsID = new MockStatsID(uuid1);
      const statsID2: MockStatsID = new MockStatsID(uuid2);
      const stats1: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        statsID2,
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(2)
        }),
        new MockTerm({
          id: 5
        }),
        new MockStatsName('not default'),
        new MockStatsUnit('anpersand'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem()
        )
      );
      const stats3: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(2)
        }),
        new MockTerm({
          id: 5
        }),
        new MockStatsName('not default'),
        new MockStatsUnit('anpersand'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem()
        )
      );

      expect(stats1.equals(stats1)).toBe(true);
      expect(stats1.equals(stats2)).toBe(false);
      expect(stats1.equals(stats3)).toBe(true);
    });
  });

  describe('isSame', () => {
    it('returns true if all the properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const statsID1: MockStatsID = new MockStatsID(uuid1);
      const statsID2: MockStatsID = new MockStatsID(uuid2);
      const stats1: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats2: Stats = Stats.of(
        statsID2,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats3: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats4: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(4)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats5: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 50
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats6: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 2'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats7: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unirse'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats8: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 2
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats9: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems()
      );
      const stats10: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid4),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats11: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 2')
          })
        )
      );
      const stats12: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1'),
            values: new MockStatsValues(
              new MockStatsValue()
            )
          })
        )
      );
      const stats13: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        )
      );
      const stats14: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        ),
        Present.of<AsOf>(new MockAsOf({
          day: 3
        }))
      );
      const stats15: Stats = Stats.of(
        statsID1,
        new MockLanguage({
          languageID: new MockLanguageID(1)
        }),
        new MockRegion({
          regionID: new MockRegionID(1)
        }),
        new MockTerm({
          id: 1
        }),
        new MockStatsName('stats name 1'),
        new MockStatsUnit('unit'),
        new MockUpdatedAt({
          day: 1
        }),
        new MockStatsItems(
          new MockStatsItem({
            statsItemID: new MockStatsItemID(uuid3),
            name: new MockStatsItemName('item name 1')
          })
        ),
        Present.of<AsOf>(new MockAsOf({
          day: 4
        }))
      );

      expect(stats1.isSame(stats1)).toBe(true);
      expect(stats1.isSame(stats2)).toBe(false);
      expect(stats1.isSame(stats3)).toBe(false);
      expect(stats1.isSame(stats4)).toBe(false);
      expect(stats1.isSame(stats5)).toBe(false);
      expect(stats1.isSame(stats6)).toBe(false);
      expect(stats1.isSame(stats7)).toBe(false);
      expect(stats1.isSame(stats8)).toBe(false);
      expect(stats1.isSame(stats9)).toBe(false);
      expect(stats1.isSame(stats10)).toBe(false);
      expect(stats1.isSame(stats11)).toBe(false);
      expect(stats1.isSame(stats12)).toBe(false);
      expect(stats1.isSame(stats13)).toBe(true);
      expect(stats1.isSame(stats14)).toBe(true);
      expect(stats1.isSame(stats15)).toBe(true);
      expect(stats14.isSame(stats14)).toBe(true);
      expect(stats14.isSame(stats15)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.ofString('bfb0ebff-fc8c-450e-9265-82fa4938ae94').get();
      const statsItemID: StatsItemID = StatsItemID.ofString('2e787bad-6727-47d0-af9a-9c8189342a50').get();
      const stats: Stats = Stats.of(
        statsID,
        Language.of(
          LanguageID.of(1),
          LanguageName.of('language1'),
          LanguageName.of('englishname1'),
          ISO639.of('lang1')
        ),
        Region.of(
          RegionID.of(1),
          RegionName.of('region1'),
          ISO3166.of('regn1')
        ),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.ofArray([
          StatsItem.of(
            statsItemID,
            StatsItemName.of('stats1'),
            StatsValues.ofArray([
              StatsValue.of(
                AsOf.ofString('2000-01-01').get(),
                NumericalValue.of(10))
            ])
          )
        ])
      );

      expect(stats.toJSON()).toEqual({
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
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '2e787bad-6727-47d0-af9a-9c8189342a50',
            name: 'stats1',
            values: [
              {
                asOf: '2000-01-01',
                value: 10
              }
            ]
          }
        ]
      });
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id1: string = 'bfb0ebff-fc8c-450e-9265-82fa4938ae94';
      const id2: string = '2e787bad-6727-47d0-af9a-9c8189342a50';
      const name1: string = 'stats1';
      const name2: string = 'name1';
      const at1: string = '2000-01-02';
      const at2: string = '2000-01-01 02:03:04';
      const value1: number = 10;
      const term: Term = Term.DAILY;
      const unit: string = 'unit1';
      const statsID: StatsID = StatsID.ofString(id1).get();
      const statsItemID: StatsItemID = StatsItemID.ofString(id2).get();
      const stats: Stats = Stats.of(
        statsID,
        Language.empty(),
        Region.empty(),
        term,
        StatsName.of(name2),
        StatsUnit.of(unit),
        UpdatedAt.ofString(at2).get(),
        StatsItems.ofArray([
          StatsItem.of(
            statsItemID,
            StatsItemName.of(name1),
            StatsValues.ofArray([
              StatsValue.of(
                AsOf.ofString(at1).get(),
                NumericalValue.of(value1)
              )
            ])
          )
        ])
      );

      expect(stats.toString()).toBe(`${id1} ${Language.empty().toString()} ${Region.empty().toString()} ${term.toString()} ${name2} ${unit} ${at2}`);
    });
  });

  describe('getColumns', () => {
    it('asOfs are taken and their duplicated values are eliminated', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(4)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 5
                }),
                value: new MockNumericalValue(6)
              })
            )
          })
        )
      );

      const columns: AsOfs = stats.getColumns();
      expect(columns.size()).toBe(7);
      expect(columns.get(0).get().toString()).toBe('1999-12-31');
      expect(columns.get(1).get().toString()).toBe('2000-01-01');
      expect(columns.get(2).get().toString()).toBe('2000-01-02');
      expect(columns.get(3).get().toString()).toBe('2000-01-03');
      expect(columns.get(4).get().toString()).toBe('2000-01-04');
      expect(columns.get(5).get().toString()).toBe('2000-01-05');
      expect(columns.get(6).get().toString()).toBe('2000-01-06');
    });

    it('startDate is present', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(4)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 5
                }),
                value: new MockNumericalValue(6)
              })
            )
          })
        ),
        Present.of<AsOf>(AsOf.ofString('2000-01-08').get())
      );

      const columns: AsOfs = stats.getColumns();
      expect(columns.size()).toBe(10);
      expect(columns.get(0).get().toString()).toBe('1999-12-31');
      expect(columns.get(1).get().toString()).toBe('2000-01-01');
      expect(columns.get(2).get().toString()).toBe('2000-01-02');
      expect(columns.get(3).get().toString()).toBe('2000-01-03');
      expect(columns.get(4).get().toString()).toBe('2000-01-04');
      expect(columns.get(5).get().toString()).toBe('2000-01-05');
      expect(columns.get(6).get().toString()).toBe('2000-01-06');
      expect(columns.get(7).get().toString()).toBe('2000-01-07');
      expect(columns.get(8).get().toString()).toBe('2000-01-08');
      expect(columns.get(9).get().toString()).toBe('2000-01-09');
    });

    it('no AsOfs', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );

      const columns: AsOfs = stats.getColumns();
      expect(columns.isEmpty()).toBe(true);
    });
  });

  describe('getColumn', () => {
    it('properly bring the very correct AsOf', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(4)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 5
                }),
                value: new MockNumericalValue(6)
              })
            )
          })
        )
      );

      expect(stats.getColumn(Column.of(0).get()).get().toString()).toBe('1999-12-31');
      expect(stats.getColumn(Column.of(1).get()).get().toString()).toBe('2000-01-01');
      expect(stats.getColumn(Column.of(2).get()).get().toString()).toBe('2000-01-02');
      expect(stats.getColumn(Column.of(3).get()).get().toString()).toBe('2000-01-03');
      expect(stats.getColumn(Column.of(4).get()).get().toString()).toBe('2000-01-04');
      expect(stats.getColumn(Column.of(5).get()).get().toString()).toBe('2000-01-05');
      expect(stats.getColumn(Column.of(6).get()).get().toString()).toBe('2000-01-06');
    });
  });

  describe('getRow', () => {
    const statsItem1: MockStatsItem = new MockStatsItem({
      values: new MockStatsValues(
        new MockStatsValue({
          asOf: new MockAsOf({
            month: 1,
            day: 1
          }),
          value: new MockNumericalValue(1)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            month: 1,
            day: 3
          }),
          value: new MockNumericalValue(2)
        })
      )
    });
    const statsItem2: MockStatsItem = new MockStatsItem({
      values: new MockStatsValues(
        new MockStatsValue({
          asOf: new MockAsOf({
            month: 1,
            day: 1
          }),
          value: new MockNumericalValue(2)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            month: 1,
            day: 2
          }),
          value: new MockNumericalValue(4)
        }),
        new MockStatsValue({
          asOf: new MockAsOf({
            month: 1,
            day: 5
          }),
          value: new MockNumericalValue(6)
        })
      )
    });

    const stats: Stats = Stats.of(
      new MockStatsID(),
      new MockLanguage(),
      new MockRegion(),
      Term.DAILY,
      new MockStatsName(),
      new MockStatsUnit(),
      new MockUpdatedAt(),
      new MockStatsItems(
        statsItem1,
        statsItem2
      )
    );

    expect(stats.getRow(Row.of(0).get()).get()).toBe(statsItem1);
    expect(stats.getRow(Row.of(1).get()).get()).toBe(statsItem2);
  });

  describe('getRowHeaders', () => {
    it('the statsItem names are taken', () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats1');
      const name2: MockStatsItemName = new MockStatsItemName('stats2');
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            name: name1,
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            name: name2,
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(4)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 5
                }),
                value: new MockNumericalValue(6)
              })
            )
          })
        )
      );

      const rowHeaders: StatsItemNames = stats.getRowHeaders();
      expect(rowHeaders.size()).toBe(2);
      expect(rowHeaders.get(0).get()).toBe(name1);
      expect(rowHeaders.get(1).get()).toBe(name2);
    });
  });

  describe('getRowHeaderSize', () => {
    it('normal case ', () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats1');
      const name2: MockStatsItemName = new MockStatsItemName('stats1111');
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            name: name1,
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            name: name2,
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(4)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 5
                }),
                value: new MockNumericalValue(6)
              })
            )
          })
        )
      );

      expect(stats.getRowHeaderSize().get()).toBe(name2.length() * 14);
    });

    it('gives 1 * 14 when given stats', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );

      expect(stats.getRowHeaderSize().get()).toBe(14);
    });
  });

  describe('getData', () => {
    it('the matrix is made even if the value is not input', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(4)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 5
                }),
                value: new MockNumericalValue(6)
              })
            )
          })
        )
      );

      expect(stats.getData()).toEqual([
        ['', '1', '', '2', '', '', ''],
        ['', '2', '4', '', '', '6', '']
      ]);
    });
  });

  describe('isFilled', () => {
    it('returns true if the language, region, name, and unit are filled', () => {
      const stats1: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        Region.empty(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats3: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats4: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsName('stats name'),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem()
        )
      );
      const stats5: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        StatsName.empty(),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats6: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem()
        )
      );
      const stats7: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        new MockStatsName('stats name'),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem(),
          new MockStatsItem()
        )
      );
      const stats8: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats9: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        Region.empty(),
        Term.DAILY,
        StatsName.empty(),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem()
        )
      );
      const stats10: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        new MockStatsName('stats name'),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem(),
          new MockStatsItem()
        )
      );
      const stats11: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats12: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        Region.empty(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem(),
          new MockStatsItem()
        )
      );
      const stats13: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        StatsName.empty(),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem()
        )
      );
      const stats14: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );

      expect(stats1.isFilled()).toBe(false);
      expect(stats2.isFilled()).toBe(false);
      expect(stats3.isFilled()).toBe(false);
      expect(stats4.isFilled()).toBe(false);
      expect(stats5.isFilled()).toBe(false);
      expect(stats6.isFilled()).toBe(false);
      expect(stats7.isFilled()).toBe(false);
      expect(stats8.isFilled()).toBe(false);
      expect(stats9.isFilled()).toBe(false);
      expect(stats10.isFilled()).toBe(false);
      expect(stats11.isFilled()).toBe(false);
      expect(stats12.isFilled()).toBe(false);
      expect(stats13.isFilled()).toBe(false);
      expect(stats14.isFilled()).toBe(true);
    });
  });

  describe('isValid', () => {
    it('returns true if the stats is filled', () => {
      const stats1: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        new MockRegion(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats3: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats4: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName('stats name'),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem()
        )
      );
      const stats5: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        StatsName.empty(),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats6: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats7: Stats = Stats.of(
        new MockStatsID(),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem(),
          new MockStatsItem({
            name: new MockStatsItemName('cittadino')
          })
        )
      );
      const stats8: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            name: new MockStatsItemName('ogonek')
          }),
          new MockStatsItem({
            name: new MockStatsItemName('cittadino')
          })
        )
      );

      expect(stats1.isValid()).toBe(false);
      expect(stats2.isValid()).toBe(false);
      expect(stats3.isValid()).toBe(false);
      expect(stats4.isValid()).toBe(false);
      expect(stats5.isValid()).toBe(false);
      expect(stats6.isValid()).toBe(true);
      expect(stats7.isValid()).toBe(false);
      expect(stats8.isValid()).toBe(true);
    });

    it('stats is filled but statsItems are invalid', () => {
      const stats1: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          StatsItem.default()
        )
      );
      const stats2: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            name: new MockStatsItemName('pok')
          }),
          StatsItem.default()
        )
      );

      expect(stats1.isValid()).toBe(false);
      expect(stats2.isValid()).toBe(false);
    });

    it('stats and their items are filled', () => {
      const stats1: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            name: new MockStatsItemName('fidanzato')
          })
        )
      );
      const stats3: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage({
          languageID: new MockLanguageID(2)
        }),
        new MockRegion({
          regionID: new MockRegionID(5)
        }),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            name: new MockStatsItemName('nonna')
          }),
          new MockStatsItem({
            name: new MockStatsItemName('nipote')
          })
        )
      );

      expect(stats1.isValid()).toBe(true);
      expect(stats2.isValid()).toBe(true);
      expect(stats3.isValid()).toBe(true);
    });
  });

  describe('setData', () => {
    it('update pattern', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(2)
              })
            )
          })
        )
      );

      stats.setData(
        Coordinate.of(
          Row.of(0).get(),
          Column.of(2).get()),
        NumericalValue.of(4)
      );

      expect(stats.getItems().get(0).get().getValues().size()).toBe(2);
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      expect(stats.getItems().get(0).get().getValues().get(asOf1).get().getValue().get()).toBe(1);
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      expect(stats.getItems().get(0).get().getValues().get(asOf2).get().getValue().get()).toBe(4);
    });

    it('insert pattern', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(3)
              })
            )
          })
        )
      );

      stats.setData(
        Coordinate.of(
          Row.of(0).get(),
          Column.of(2).get()),
        NumericalValue.of(2)
      );

      expect(stats.getItems().get(0).get().getValues().size()).toBe(3);
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      expect(stats.getItems().get(0).get().getValues().get(asOf1).get().getValue().get()).toBe(1);
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      expect(stats.getItems().get(0).get().getValues().get(asOf2).get().getValue().get()).toBe(2);
      const asOf3: AsOf = AsOf.ofString('2000-01-03').get();
      expect(stats.getItems().get(0).get().getValues().get(asOf3).get().getValue().get()).toBe(3);
    });
  });

  describe('deleteData', () => {
    it('correctly deletes the specified StatsValue', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(4)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 5
                }),
                value: new MockNumericalValue(6)
              })
            )
          })
        )
      );

      stats.deleteData(
        Coordinate.of(
          Row.of(0).get(),
          Column.of(1).get()
        )
      );

      const items: StatsItems = stats.getItems();
      expect(items.size()).toBe(2);
      expect(items.get(0).get().getValues().size()).toBe(1);
      const asOf1: AsOf = AsOf.ofString('2000-01-03').get();
      expect(items.get(0).get().getValues().get(asOf1).get().getValue().get()).toBe(2);
      expect(items.get(1).get().getValues().size()).toBe(3);
      const asOf2: AsOf = AsOf.ofString('2000-01-01').get();
      expect(items.get(1).get().getValues().get(asOf2).get().getValue().get()).toBe(2);
      const asOf3: AsOf = AsOf.ofString('2000-01-02').get();
      expect(items.get(1).get().getValues().get(asOf3).get().getValue().get()).toBe(4);
      const asOf4: AsOf = AsOf.ofString('2000-01-05').get();
      expect(items.get(1).get().getValues().get(asOf4).get().getValue().get()).toBe(5);
    });
  });

  describe('duplicate', () => {
    it('every properties are duplicated', () => {
      const statsID: MockStatsID = new MockStatsID();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();
      const name: MockStatsName = new MockStatsName();
      const unit: MockStatsUnit = new MockStatsUnit();
      const updatedAt: MockUpdatedAt = new MockUpdatedAt();

      const stats: Stats = Stats.of(
        statsID,
        language,
        region,
        term,
        name,
        unit,
        updatedAt,
        StatsItems.empty()
      );
      const duplicated: Stats = stats.duplicate();

      expect(stats).not.toBe(duplicated);
      expect(stats.getStatsID()).toBe(statsID);
      expect(stats.getLanguage()).toBe(language);
      expect(stats.getRegion()).toBe(region);
      expect(stats.getTerm()).toBe(term);
      expect(stats.getName()).toBe(name);
      expect(stats.getUnit()).toBe(unit);
      expect(stats.getUpdatedAt()).toBe(updatedAt);
    });
  });

  describe('getChart', () => {
    it('chart is output for recharts', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            name: new MockStatsItemName('stats1'),
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 1
                }),
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            name: new MockStatsItemName('stats2'),
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 2
                }),
                value: new MockNumericalValue(12)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(13)
              }),
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 4
                }),
                value: new MockNumericalValue(14)
              })
            )
          })
        )
      );

      expect(stats.getChart()).toEqual([
        {name: '1999-12-31'},
        {name: '2000-01-01', stats1: 1},
        {name: '2000-01-02', stats2: 12},
        {name: '2000-01-03', stats1: 2, stats2: 13},
        {name: '2000-01-04', stats2: 14},
        {name: '2000-01-05'}
      ]);
    });
  });

  describe('isDetermined', () => {
    it('has values , that means it already has some AsOfs', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: new MockAsOf({
                  month: 1,
                  day: 3
                }),
                value: new MockNumericalValue(2)
              })
            )
          })
        )
      );

      expect(stats.isDetermined()).toBe(true);
    });

    it('even if it doesn\'t have values , if startDate is set, returns true', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems(),
        Present.of<AsOf>(AsOf.ofString('2000-01-01').get())
      );

      expect(stats.isDetermined()).toBe(true);
    });

    it('returns false if stats doesn\'t have values nor startDate', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );

      expect(stats.isDetermined()).toBe(false);
    });
  });
});
