import { Present, Superposition, UUID } from 'publikum';

import { StatsError } from '../../../Error/StatsError';
import { AsOf } from '../../../VO/AsOf/AsOf';
import { AsOfs } from '../../../VO/AsOf/AsOfs';
import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { Column } from '../../../VO/Coordinate/Column';
import { Coordinate } from '../../../VO/Coordinate/Coordinate';
import { Row } from '../../../VO/Coordinate/Row';
import { Language } from '../../../VO/Language/Language';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockNumericalValue } from '../../../VO/NumericalValue/Mock/MockNumericalValue';
import { NumericalValue } from '../../../VO/NumericalValue/NumericalValue';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { MockRegionName } from '../../../VO/Region/Mock/MockRegionName';
import { Region } from '../../../VO/Region/Region';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { StatsItemNames } from '../../../VO/StatsItem/StatsItemNames';
import { MockStatsID } from '../../../VO/StatsOutline/Mock/MockStatsID';
import { MockStatsName } from '../../../VO/StatsOutline/Mock/MockStatsName';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsUnit } from '../../../VO/StatsOutline/Mock/MockStatsUnit';
import { MockUpdatedAt } from '../../../VO/StatsOutline/Mock/MockUpdatedAt';
import { StatsName } from '../../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../../VO/StatsOutline/StatsUnit';
import { MockStatsValue } from '../../../VO/StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../../VO/StatsValue/Mock/MockStatsValues';
import { StatsValues } from '../../../VO/StatsValue/StatsValues';
import { MockTerm } from '../../../VO/Term/Mock/MockTerm';
import { MockTermID } from '../../../VO/Term/Mock/MockTermID';
import { MockTermKey } from '../../../VO/Term/Mock/MockTermKey';
import { Term } from '../../../VO/Term/Term';
import { MockStatsItem } from '../../StatsItem/Mock/MockStatsItem';
import { MockStatsItems } from '../../StatsItem/Mock/MockStatsItems';
import { StatsItem } from '../../StatsItem/StatsItem';
import { StatsItems } from '../../StatsItem/StatsItems';
import { MockISO3166 } from '../../VO/Mock/MockISO3166';
import { MockISO639 } from '../../VO/Mock/MockISO639';
import { MockLanguageID } from '../../VO/Mock/MockLanguageID';
import { MockLanguageName } from '../../VO/Mock/MockLanguageName';
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

      expect(stats.getLanguage()).toBe(language);
      expect(stats.getRegion()).toBe(region);
      expect(stats.getTerm()).toBe(term);
      expect(stats.getItems()).toBe(items);
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
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

      expect(superposition.isAlive()).toBe(true);
      const stats: Stats = superposition.get();
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
        expect(stats.getItems().get(i).get().getStatsItemID().get().get()).toBe(json.items[i].statsItemID);
        expect(stats.getItems().get(i).get().getName().get()).toBe(json.items[i].name);
        expect(stats.getItems().get(i).get().getValues().size()).toBe(json.items[i].values.length);
        for (let j: number = 0; j < stats.getItems().get(i).get().getValues().size(); j++) {
          const asOf: AsOf = AsOf.ofString(json.items[i].values[j].asOf).get();
          expect(stats.getItems().get(i).get().getValues().get(asOf).get().getAsOf().toString()).toBe(
            json.items[i].values[j].asOf
          );
          expect(stats.getItems().get(i).get().getValues().get(asOf).get().getValue().get()).toBe(
            json.items[i].values[j].value
          );
        }
      }
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
    it('id will be generated, data are empty', () => {
      const stats: Stats = Stats.default();

      expect(stats.getStatsID().get().get().length).toBe(UUID.size());
      expect(stats.getName()).toBe(StatsName.empty());
      expect(stats.getUnit()).toBe(StatsUnit.empty());
      expect(stats.getItems()).toBe(StatsItems.empty());
      expect(stats.getLanguage()).toBe(Language.empty());
      expect(stats.getRegion()).toBe(Region.empty());
      expect(stats.getTerm()).toBe(Term.DAILY);
      expect(stats.getStartDate().isPresent()).toBe(false);
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

  describe('isSame', () => {
    it('returns true if all the properties are the same', () => {
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
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7),
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
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7),
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
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7),
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
          languageID: new MockLanguageID(uuid4),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7),
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
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid6),
          termID: new MockTermID(uuid7),
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
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid8),
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
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7),
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
          languageID: new MockLanguageID(uuid3),
          regionID: new MockRegionID(uuid5),
          termID: new MockTermID(uuid7),
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

      expect(stats1.isSame(stats1)).toBe(true);
      expect(stats1.isSame(stats2)).toBe(false);
      expect(stats1.isSame(stats3)).toBe(false);
      expect(stats1.isSame(stats4)).toBe(false);
      expect(stats1.isSame(stats5)).toBe(false);
      expect(stats1.isSame(stats6)).toBe(false);
      expect(stats1.isSame(stats7)).toBe(false);
      expect(stats1.isSame(stats8)).toBe(true);
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
    it('asOfs are taken and their duplicated values are eliminated', () => {
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
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );

      const columns: AsOfs = stats.getColumns();
      expect(columns.isEmpty()).toBe(true);
    });
  });

  describe('getColumn', () => {
    it('properly bring the very correct AsOf', () => {
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
      new MockStatsOutline(),
      new MockLanguage(),
      new MockRegion(),
      new MockTerm(),
      new MockStatsItems(statsItem1, statsItem2)
    );

    expect(stats.getRow(Row.of(0).get()).get()).toBe(statsItem1);
    expect(stats.getRow(Row.of(1).get()).get()).toBe(statsItem2);
  });

  describe('getRowHeaders', () => {
    it('the statsItem names are taken', () => {
      const name1: MockStatsItemName = new MockStatsItemName('stats1');
      const name2: MockStatsItemName = new MockStatsItemName('stats2');
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

      expect(stats.getRowHeaderSize().get()).toBe(name2.length() * 14);
    });

    it('gives 1 * 14 when given stats', () => {
      const stats: Stats = Stats.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsItems()
      );

      expect(stats.getRowHeaderSize().get()).toBe(14);
    });
  });

  describe('getData', () => {
    it('the matrix is made even if the value is not input', () => {
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

      expect(stats.getData()).toEqual([
        ['', '1', '', '2', '', '', ''],
        ['', '2', '4', '', '', '6', '']
      ]);
    });
  });

  describe('isFilled', () => {
    it('returns true if the language, region, name, and unit are filled', () => {
      const stats1: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats3: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats4: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats5: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: new MockStatsUnit('unit')
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats6: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats7: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats8: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats9: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItems()
      );

      expect(stats1.isFilled()).toBe(false);
      expect(stats2.isFilled()).toBe(false);
      expect(stats3.isFilled()).toBe(false);
      expect(stats4.isFilled()).toBe(false);
      expect(stats5.isFilled()).toBe(false);
      expect(stats6.isFilled()).toBe(false);
      expect(stats7.isFilled()).toBe(false);
      expect(stats8.isFilled()).toBe(true);
      expect(stats9.isFilled()).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true if the stats is filled', () => {
      const stats1: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats3: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats4: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats5: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats6: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats7: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItems(
          new MockStatsItem(),
          new MockStatsItem({
            name: new MockStatsItemName('cittadino')
          })
        )
      );
      const stats8: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
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
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems(StatsItem.default())
      );
      const stats2: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
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
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems(
          new MockStatsItem({
            name: new MockStatsItemName('fidanzato')
          })
        )
      );
      const stats3: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
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
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
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

      stats.setData(Coordinate.of(Row.of(0).get(), Column.of(2).get()), NumericalValue.of(4));

      const values: StatsValues = stats.getItems().get(0).get().getValues();
      expect(values.size()).toBe(2);
      expect(values.get(asOf1).get().getValue().get()).toBe(1);
      expect(values.get(asOf2).get().getValue().get()).toBe(4);
    });

    it('insert pattern', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-03').get();
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

      stats.setData(Coordinate.of(Row.of(0).get(), Column.of(2).get()), NumericalValue.of(2));

      const item: StatsItem = stats.getItems().get(0).get();
      expect(item.getValues().size()).toBe(3);
      expect(item.getValues().get(asOf1).get().getValue().get()).toBe(1);
      expect(item.getValues().get(asOf2).get().getValue().get()).toBe(2);
      expect(item.getValues().get(asOf3).get().getValue().get()).toBe(3);
    });
  });

  describe('deleteData', () => {
    it('correctly deletes the specified StatsValue', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-03').get();
      const asOf4: AsOf = AsOf.ofString('2000-01-05').get();
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

      stats.deleteData(Coordinate.of(Row.of(0).get(), Column.of(1).get()));

      const items: StatsItems = stats.getItems();
      expect(items.size()).toBe(2);
      expect(items.get(0).get().getValues().size()).toBe(1);
      expect(items.get(0).get().getValues().get(asOf3).get().getValue().get()).toBe(2);
      expect(items.get(1).get().getValues().size()).toBe(3);
      expect(items.get(1).get().getValues().get(asOf1).get().getValue().get()).toBe(2);
      expect(items.get(1).get().getValues().get(asOf2).get().getValue().get()).toBe(4);
      expect(items.get(1).get().getValues().get(asOf4).get().getValue().get()).toBe(6);
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

  describe('getChart', () => {
    it('chart is output for recharts', () => {
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
        { name: '1999-12-31' },
        { name: '2000-01-01', stats1: 1 },
        { name: '2000-01-02', stats2: 12 },
        { name: '2000-01-03', stats1: 2, stats2: 13 },
        { name: '2000-01-04', stats2: 14 },
        { name: '2000-01-05' }
      ]);
    });
  });

  describe('isDetermined', () => {
    it('has values , that means it already has some AsOfs', () => {
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

    it("even if it doesn't have values , if startDate is set, returns true", () => {
      const stats: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems(),
        Present.of<AsOf>(AsOf.ofString('2000-01-01').get())
      );

      expect(stats.isDetermined()).toBe(true);
    });

    it("returns false if stats doesn't have values nor startDate", () => {
      const stats: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );

      expect(stats.isDetermined()).toBe(false);
    });
  });
});
