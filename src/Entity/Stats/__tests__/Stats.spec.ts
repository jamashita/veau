import { Heisenberg, Schrodinger, Superposition, Unscharferelation } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import sinon, { SinonStub } from 'sinon';

import { AsOf } from '../../../VO/AsOf/AsOf';
import { AsOfs } from '../../../VO/AsOf/AsOfs';
import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { Column } from '../../../VO/Coordinate/Column';
import { Coordinate } from '../../../VO/Coordinate/Coordinate';
import { MockColumn } from '../../../VO/Coordinate/Mock/MockColumn';
import { MockRow } from '../../../VO/Coordinate/Mock/MockRow';
import { Row } from '../../../VO/Coordinate/Row';
import { StatsDisplay } from '../../../VO/Display/StatsDisplay';
import { HeaderSize } from '../../../VO/HeaderSize/HeaderSize';
import { Language } from '../../../VO/Language/Language';
import { MockISO639 } from '../../../VO/Language/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { MockLanguageName } from '../../../VO/Language/Mock/MockLanguageName';
import { MockNumericalValue } from '../../../VO/NumericalValue/Mock/MockNumericalValue';
import { NumericalValue } from '../../../VO/NumericalValue/NumericalValue';
import { MockISO3166 } from '../../../VO/Region/Mock/MockISO3166';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { MockRegionName } from '../../../VO/Region/Mock/MockRegionName';
import { Region } from '../../../VO/Region/Region';
import { MockStatsItemID } from '../../../VO/StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { MockStatsName } from '../../../VO/StatsOutline/Mock/MockStatsName';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsUnit } from '../../../VO/StatsOutline/Mock/MockStatsUnit';
import { MockUpdatedAt } from '../../../VO/StatsOutline/Mock/MockUpdatedAt';
import { StatsName } from '../../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../../VO/StatsOutline/StatsUnit';
import { MockStatsValue } from '../../../VO/StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/StatsValue/Mock/MockStatsValues';
import { MockTerm } from '../../../VO/Term/Mock/MockTerm';
import { MockTermID } from '../../../VO/Term/Mock/MockTermID';
import { MockTermKey } from '../../../VO/Term/Mock/MockTermKey';
import { Term } from '../../../VO/Term/Term';
import { MockStatsItem } from '../../StatsItem/Mock/MockStatsItem';
import { MockStatsItems } from '../../StatsItem/Mock/MockStatsItems';
import { StatsItem } from '../../StatsItem/StatsItem';
import { StatsItems } from '../../StatsItem/StatsItems';
import { StatsError } from '../Error/StatsError';
import { Stats, StatsJSON } from '../Stats';

describe('Stats', () => {
  describe('of', () => {
    it('normal case', () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();
      const items: MockStatsItems = new MockStatsItems();

      const stats: Stats = Stats.of(outline, language, region, term, items);

      expect(stats.getOutline()).toBe(outline);
      expect(stats.getLanguage()).toBe(language);
      expect(stats.getRegion()).toBe(region);
      expect(stats.getTerm()).toBe(term);
      expect(stats.getItems()).toBe(items);
    });
  });

  describe('ofJSON', () => {
    it('normal case', async () => {
      const json: StatsJSON = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const stats: Stats = schrodinger.get();

      expect(stats.getStatsID().get().get()).toBe(json.outline.statsID);
      expect(stats.getName().get()).toBe(json.outline.name);
      expect(stats.getUnit().get()).toBe(json.outline.unit);
      expect(stats.getUpdatedAt().toString()).toBe(json.outline.updatedAt);
      expect(stats.getLanguage().getLanguageID().get().get()).toBe(json.language.languageID);
      expect(stats.getLanguage().getName().get()).toBe(json.language.name);
      expect(stats.getLanguage().getEnglishName().get()).toBe(json.language.englishName);
      expect(stats.getLanguage().getISO639().get()).toBe(json.language.iso639);
      expect(stats.getRegion().getRegionID().get().get()).toBe(json.region.regionID);
      expect(stats.getRegion().getName().get()).toBe(json.region.name);
      expect(stats.getRegion().getISO3166().get()).toBe(json.region.iso3166);
      expect(stats.getTerm().getTermID().get().get()).toBe(json.outline.termID);
      expect(stats.getItems().size()).toBe(json.items.length);

      for (let i: number = 0; i < stats.getItems().size(); i++) {
        expect(stats.getItems().get(i)?.getStatsItemID().get().get()).toBe(json.items[i].statsItemID);
        expect(stats.getItems().get(i)?.getName().get()).toBe(json.items[i].name);
        expect(stats.getItems().get(i)?.getValues().size()).toBe(json.items[i].values.length);
        const item: Nullable<StatsItem> = stats.getItems().get(i);

        if (item === null) {
          fail();

          return;
        }

        for (let j: number = 0; j < item.getValues().size(); j++) {
          // eslint-disable-next-line no-await-in-loop
          const asOf: AsOf = await AsOf.ofString(json.items[i].values[j].asOf).get();

          expect(item.getValues().get(asOf)?.getAsOf().toString()).toBe(json.items[i].values[j].asOf);
          expect(item.getValues().get(asOf)?.getValue().get()).toBe(json.items[i].values[j].value);
        }
      }
    });

    it('returns Dead if StatsOutline returns Dead', async () => {
      const json: StatsJSON = {
        outline: {
          statsID: 'malformat',
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });

    it('returns Dead if Language returns Dead', async () => {
      const json: StatsJSON = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: 'malformat',
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });

    it('returns Dead if Region returns Dead', async () => {
      const json: StatsJSON = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: 'malformat',
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });

    it('returns Dead if Term returns Dead', async () => {
      const json: StatsJSON = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: 'malformat',
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });

    it('returns Dead if StatsItem returns Dead', async () => {
      const json: StatsJSON = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: 'malformat',
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });
  });

  describe('ofObject', () => {
    it('Stats.isJSON() and Stats.ofJSON() works proper, returns Alive', async () => {
      const object: StatsJSON = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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

      const superposition: Superposition<Stats, StatsError> = Stats.ofObject(object);
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('Stats.isJSON() returns false, returns Dead', async () => {
      const object: object = {};

      const superposition: Superposition<Stats, StatsError> = Stats.ofObject(object);
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });

    it('Stats.ofJSON() returns false, returns Dead', async () => {
      const object: StatsJSON = {
        outline: {
          statsID: 'malformat',
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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

      const superposition: Superposition<Stats, StatsError> = Stats.ofObject(object);
      const schrodinger: Schrodinger<Stats, StatsError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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

    it('returns false because outline is missing', () => {
      const n: unknown = {
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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

    it('returns false because outline is not object', () => {
      const n: unknown = {
        outline: 'fale outline',
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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

    it('returns false because language is not object', () => {
      const n: unknown = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: 'fake language',
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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

    it('returns false region region is missing', () => {
      const n: unknown = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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

    it('returns false because region is not object', () => {
      const n: unknown = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: 'fake object',
        items: [
          {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: UUID.v4().get(),
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
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        }
      };

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because items is not array', () => {
      const n: unknown = {
        outline: {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: Term.DAILY.getTermID().get().get(),
          name: 'stats1',
          unit: 'unit1',
          updatedAt: '2000-01-01 00:00:00'
        },
        language: {
          languageID: UUID.v4().get(),
          name: 'language1',
          englishName: 'english language1',
          iso639: 'LG'
        },
        region: {
          regionID: UUID.v4().get(),
          name: 'region1',
          iso3166: 'RGN'
        },
        items: {
          first: {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          second: {
            statsItemID: UUID.v4().get(),
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
    it('id will be generated, data are empty', async () => {
      const stats: Stats = Stats.default();

      expect(stats.getStatsID().get().get().length).toBe(UUID.size());
      expect(stats.getName()).toBe(StatsName.empty());
      expect(stats.getUnit()).toBe(StatsUnit.empty());
      expect(stats.getItems()).toBe(StatsItems.empty());
      expect(stats.getLanguage()).toBe(Language.empty());
      expect(stats.getRegion()).toBe(Region.empty());
      expect(stats.getTerm()).toBe(Term.DAILY);

      const heisenberg: Heisenberg<AsOf> = await stats.getStartDate().terminate();

      expect(heisenberg.isAbsent()).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const uuid7: UUID = UUID.v4();
      const uuid8: UUID = UUID.v4();
      const stats1: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        }),
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid2),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        }),
        new MockStatsItems()
      );
      const stats3: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          updatedAt: new MockUpdatedAt({
            day: 2
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        }),
        new MockStatsItems()
      );
      const stats4: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid4)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        }),
        new MockStatsItems()
      );
      const stats5: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid6)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        }),
        new MockStatsItems()
      );
      const stats6: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid8)
        }),
        new MockStatsItems()
      );
      const stats7: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        }),
        new MockStatsItems(new MockStatsItem())
      );
      const stats8: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid3)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid5)
        }),
        new MockTerm({
          termID: new MockTermID(uuid7)
        }),
        new MockStatsItems()
      );

      expect(stats1.equals(stats1)).toBe(true);
      expect(stats1.equals(stats2)).toBe(false);
      expect(stats1.equals(stats3)).toBe(true);
      expect(stats1.equals(stats4)).toBe(true);
      expect(stats1.equals(stats5)).toBe(true);
      expect(stats1.equals(stats6)).toBe(true);
      expect(stats1.equals(stats7)).toBe(true);
      expect(stats1.equals(stats8)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const name: string = 'name';
      const unit: string = 'unit';
      const languageName: string = 'language';
      const englishLanguage: string = 'english language';
      const iso639: string = 'IO';
      const regionName: string = 'region';
      const iso3166: string = 'IDE';
      const key: string = 'term key';
      const stats: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid2),
          regionID: new MockRegionID(uuid3),
          termID: new MockTermID(uuid4),
          name: new MockStatsName(name),
          unit: new MockStatsUnit(unit),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid2),
          name: new MockLanguageName(languageName),
          englishName: new MockLanguageName(englishLanguage),
          iso639: new MockISO639(iso639)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid3),
          name: new MockRegionName(regionName),
          iso3166: new MockISO3166(iso3166)
        }),
        new MockTerm({
          termID: new MockTermID(uuid4),
          key: new MockTermKey(key)
        }),
        new MockStatsItems()
      );

      expect(stats.toJSON()).toEqual({
        outline: {
          statsID: uuid1.get(),
          languageID: uuid2.get(),
          regionID: uuid3.get(),
          termID: uuid4.get(),
          name,
          unit,
          updatedAt: '2000-01-01 01:02:03'
        },
        language: {
          languageID: uuid2.get(),
          name: languageName,
          englishName: englishLanguage,
          iso639
        },
        region: {
          regionID: uuid3.get(),
          name: regionName,
          iso3166
        },
        items: []
      });
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const name: string = 'name';
      const unit: string = 'unit';
      const languageName: string = 'language';
      const englishLanguage: string = 'english language';
      const iso639: string = 'IO';
      const regionName: string = 'region';
      const iso3166: string = 'IDE';
      const key: string = 'term key';
      const stats: Stats = Stats.of(
        new MockStatsOutline({
          statsID: new MockStatsID(uuid1),
          languageID: new MockLanguageID(uuid2),
          regionID: new MockRegionID(uuid3),
          termID: new MockTermID(uuid4),
          name: new MockStatsName(name),
          unit: new MockStatsUnit(unit),
          updatedAt: new MockUpdatedAt({
            day: 1
          })
        }),
        new MockLanguage({
          languageID: new MockLanguageID(uuid2),
          name: new MockLanguageName(languageName),
          englishName: new MockLanguageName(englishLanguage),
          iso639: new MockISO639(iso639)
        }),
        new MockRegion({
          regionID: new MockRegionID(uuid3),
          name: new MockRegionName(regionName),
          iso3166: new MockISO3166(iso3166)
        }),
        new MockTerm({
          termID: new MockTermID(uuid4),
          key: new MockTermKey(key)
        }),
        new MockStatsItems()
      );

      expect(stats.toString()).toBe(
        `${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${uuid4.get()} ${name} ${unit} 2000-01-01 01:02:03 ${uuid2.get()} ${languageName} ${englishLanguage} ${iso639} ${uuid3.get()} ${regionName} ${iso3166} ${uuid4.get()} ${key}`
      );
    });
  });

  describe('getColumns', () => {
    it('asOfs are taken and their duplicated values are eliminated', async () => {
      const stats: Stats = Stats.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
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

      const columns: AsOfs = await stats.getColumns().get();

      expect(columns.size()).toBe(7);
      expect(columns.get(0)?.toString()).toBe('1999-12-31');
      expect(columns.get(1)?.toString()).toBe('2000-01-01');
      expect(columns.get(2)?.toString()).toBe('2000-01-02');
      expect(columns.get(3)?.toString()).toBe('2000-01-03');
      expect(columns.get(4)?.toString()).toBe('2000-01-04');
      expect(columns.get(5)?.toString()).toBe('2000-01-05');
      expect(columns.get(6)?.toString()).toBe('2000-01-06');
    });

    it('startDate is present', async () => {
      const stats: Stats = Stats.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
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
        AsOf.ofString('2000-01-08').toUnscharferelation()
      );

      const columns: AsOfs = await stats.getColumns().get();

      expect(columns.size()).toBe(10);
      expect(columns.get(0)?.toString()).toBe('1999-12-31');
      expect(columns.get(1)?.toString()).toBe('2000-01-01');
      expect(columns.get(2)?.toString()).toBe('2000-01-02');
      expect(columns.get(3)?.toString()).toBe('2000-01-03');
      expect(columns.get(4)?.toString()).toBe('2000-01-04');
      expect(columns.get(5)?.toString()).toBe('2000-01-05');
      expect(columns.get(6)?.toString()).toBe('2000-01-06');
      expect(columns.get(7)?.toString()).toBe('2000-01-07');
      expect(columns.get(8)?.toString()).toBe('2000-01-08');
      expect(columns.get(9)?.toString()).toBe('2000-01-09');
    });

    it('no AsOfs', async () => {
      const stats: Stats = Stats.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );

      const columns: AsOfs = await stats.getColumns().get();

      expect(columns.isEmpty()).toBe(true);
    });
  });

  describe('getRow', () => {
    it('normal case', async () => {
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
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsItems(statsItem1, statsItem2)
      );

      expect(await stats.getRow(await Row.of(0).get()).get()).toBe(statsItem1);
      expect(await stats.getRow(await Row.of(1).get()).get()).toBe(statsItem2);
    });
  });

  describe('getRowHeaderSize', () => {
    it('normal case ', async () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats1');
      const name2: MockStatsItemName = new MockStatsItemName('stats1111');
      const stats: Stats = Stats.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
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

      const headerSize: HeaderSize = await stats.getRowHeaderSize().get();

      expect(headerSize.get()).toBe(name2.length() * 14);
    });

    it('gives 1 * 14 when given stats', async () => {
      const stats: Stats = Stats.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsItems()
      );

      const headerSize: HeaderSize = await stats.getRowHeaderSize().get();

      expect(headerSize.get()).toBe(14);
    });
  });

  describe('setData', () => {
    it('update pattern', async () => {
      const asOf1: AsOf = await AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = await AsOf.ofString('2000-01-02').get();
      const stats: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: asOf1,
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: asOf2,
                value: new MockNumericalValue(2)
              })
            )
          })
        )
      );

      stats.setData(Coordinate.of(await Row.of(0).get(), await Column.of(2).get()), NumericalValue.of(4));

      expect(stats.getItems().get(0)?.getValues().size()).toBe(2);
      expect(stats.getItems().get(0)?.getValues().get(asOf1)?.getValue().get()).toBe(1);
      expect(stats.getItems().get(0)?.getValues().get(asOf2)?.getValue().get()).toBe(4);
    });

    it('insert pattern', async () => {
      const asOf1: AsOf = await AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = await AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = await AsOf.ofString('2000-01-03').get();
      const stats: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: asOf1,
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: asOf3,
                value: new MockNumericalValue(3)
              })
            )
          })
        )
      );

      stats.setData(Coordinate.of(await Row.of(0).get(), await Column.of(2).get()), NumericalValue.of(2));

      expect(stats.getItems().get(0)?.getValues().size()).toBe(3);
      expect(stats.getItems().get(0)?.getValues().get(asOf1)?.getValue().get()).toBe(1);
      expect(stats.getItems().get(0)?.getValues().get(asOf2)?.getValue().get()).toBe(2);
      expect(stats.getItems().get(0)?.getValues().get(asOf3)?.getValue().get()).toBe(3);
    });
  });

  describe('deleteData', () => {
    it('correctly deletes the specified StatsValue', async () => {
      const asOf1: AsOf = await AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = await AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = await AsOf.ofString('2000-01-03').get();
      const asOf4: AsOf = await AsOf.ofString('2000-01-05').get();
      const stats: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems(
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: asOf1,
                value: new MockNumericalValue(1)
              }),
              new MockStatsValue({
                asOf: asOf3,
                value: new MockNumericalValue(2)
              })
            )
          }),
          new MockStatsItem({
            values: new MockStatsValues(
              new MockStatsValue({
                asOf: asOf1,
                value: new MockNumericalValue(2)
              }),
              new MockStatsValue({
                asOf: asOf2,
                value: new MockNumericalValue(4)
              }),
              new MockStatsValue({
                asOf: asOf4,
                value: new MockNumericalValue(6)
              })
            )
          })
        )
      );

      stats.deleteData(Coordinate.of(await Row.of(0).get(), await Column.of(1).get()));

      const items: StatsItems = stats.getItems();

      expect(items.size()).toBe(2);
      expect(items.get(0)?.getValues().size()).toBe(1);
      expect(items.get(0)?.getValues().get(asOf3)?.getValue().get()).toBe(2);
      expect(items.get(1)?.getValues().size()).toBe(3);
      expect(items.get(1)?.getValues().get(asOf1)?.getValue().get()).toBe(2);
      expect(items.get(1)?.getValues().get(asOf2)?.getValue().get()).toBe(4);
      expect(items.get(1)?.getValues().get(asOf4)?.getValue().get()).toBe(6);
    });
  });

  describe('duplicate', () => {
    it('every properties are duplicated', () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();

      const stats: Stats = Stats.of(outline, language, region, term, StatsItems.empty());
      const duplicated: Stats = stats.duplicate();

      expect(stats).not.toBe(duplicated);
      expect(stats.getStatsID()).toBe(outline.getStatsID());
      expect(stats.getName()).toBe(outline.getName());
      expect(stats.getUnit()).toBe(outline.getUnit());
      expect(stats.getUpdatedAt()).toBe(outline.getUpdatedAt());
      expect(stats.getLanguage()).toBe(language);
      expect(stats.getRegion()).toBe(region);
      expect(stats.getTerm()).toBe(term);
    });
  });

  describe('replaceItem', () => {
    it('delegates its inner StatsItems instance', () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();
      const items: MockStatsItems = new MockStatsItems();

      const stub: SinonStub = sinon.stub();

      items.replace = stub;
      stub.returns(new MockStatsItems());

      const stats: Stats = Stats.of(outline, language, region, term, items);

      stats.replaceItem(new MockStatsItem(), new MockRow());

      expect(stub.called).toBe(true);
    });
  });

  describe('moveItem', () => {
    it('delegates its inner StatsItems instance', () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();
      const items: MockStatsItems = new MockStatsItems();

      const stub: SinonStub = sinon.stub();

      items.move = stub;
      stub.returns(new MockStatsItems());

      const stats: Stats = Stats.of(outline, language, region, term, items);

      stats.moveItem(new MockColumn(), new MockColumn());

      expect(stub.called).toBe(true);
    });
  });

  describe('removeItem', () => {
    it('delegates its inner StatsItems instance', () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();
      const items: MockStatsItems = new MockStatsItems();

      const stub: SinonStub = sinon.stub();

      items.remove = stub;
      stub.returns(new MockStatsItems());

      const stats: Stats = Stats.of(outline, language, region, term, items);

      stats.removeItem(new MockStatsItem());

      expect(stub.called).toBe(true);
    });
  });

  describe('display', () => {
    it('normal case', async () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: Term = Term.DAILY;
      const statsItemID: MockStatsItemID = new MockStatsItemID();
      const name: MockStatsItemName = new MockStatsItemName();
      const values: MockStatsValues = new MockStatsValues();
      const items: MockStatsItems = new MockStatsItems(
        new MockStatsItem({
          statsItemID,
          name,
          values
        })
      );
      const startDate: Unscharferelation<AsOf> = Unscharferelation.present<AsOf>(new MockAsOf());

      const stats: Stats = Stats.of(outline, language, region, term, items, startDate);

      const unscharferelation: Unscharferelation<StatsDisplay> = stats.display();
      const heisenberg: Heisenberg<StatsDisplay> = await unscharferelation.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      const display: StatsDisplay = heisenberg.get();

      expect(display.getOutline()).toBe(outline);
      expect(display.getLanguage()).toBe(language);
      expect(display.getRegion()).toBe(region);
      expect(display.getTerm()).toBe(term);
      expect(display.getItems().size()).toBe(items.size());
      expect(display.getItems().get(0)?.getStatsItemID()).toBe(items.get(0)?.getStatsItemID());
      expect(display.getItems().get(0)?.getName()).toBe(items.get(0)?.getName());
      expect(display.getItems().get(0)?.getValues()).toBe(items.get(0)?.getValues());
    });

    it('no startDate', async () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: Term = Term.DAILY;
      const items: MockStatsItems = new MockStatsItems(
        new MockStatsItem({
          values: new MockStatsValues(
            new MockStatsValue({
              asOf: new MockAsOf({
                day: 2
              })
            })
          )
        })
      );

      const stats: Stats = Stats.of(outline, language, region, term, items);

      const unscharferelation: Unscharferelation<StatsDisplay> = stats.display();
      const heisenberg: Heisenberg<StatsDisplay> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
    });
  });
});
