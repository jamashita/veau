import { Present, Superposition, UUID } from 'publikum';
import { StatsError } from '../../Error/StatsError';
import { AsOf } from '../../VO/AsOf';
import { AsOfs } from '../../VO/AsOfs';
import { Column } from '../../VO/Column';
import { Coordinate } from '../../VO/Coordinate';
import { LanguageID } from '../../VO/LanguageID';
import { MockAsOf } from '../../VO/Mock/MockAsOf';
import { MockLanguageID } from '../../VO/Mock/MockLanguageID';
import { MockNumericalValue } from '../../VO/Mock/MockNumericalValue';
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
import { RegionID } from '../../VO/RegionID';
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
      const statsID: MockStatsID = new MockStatsID();
      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
      const term: MockTerm = new MockTerm();
      const name: MockStatsName = new MockStatsName();
      const unit: MockStatsUnit = new MockStatsUnit();
      const updatedAt: MockUpdatedAt = new MockUpdatedAt();
      const items: MockStatsItems = new MockStatsItems();

      const stats: Stats = Stats.of(
        statsID,
        languageID,
        regionID,
        term,
        name,
        unit,
        updatedAt,
        items
      );

      expect(stats.getStatsID()).toBe(statsID);
      expect(stats.getLanguageID()).toBe(languageID);
      expect(stats.getRegionID()).toBe(regionID);
      expect(stats.getTerm()).toBe(term);
      expect(stats.getName()).toBe(name);
      expect(stats.getUnit()).toBe(unit);
      expect(stats.getUpdatedAt()).toBe(updatedAt);
      expect(stats.getItems()).toBe(items);
    });
  });

  describe('ofJSON', () => {
    // TODO other failure cases
    it('normal case', () => {
      const json: StatsJSON = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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
      expect(stats.getStatsID().get().get()).toBe(json.statsID);
      expect(stats.getLanguageID().get().get()).toBe(json.languageID);
      expect(stats.getRegionID().get().get()).toBe(json.regionID);
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
    // TODO other failure cases
    it('normal case', () => {
      const row: StatsRow = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 3,
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00'
      };
      const items: MockStatsItems = new MockStatsItems(
        new MockStatsItem(),
        new MockStatsItem(),
        new MockStatsItem()
      );

      const superposition: Superposition<Stats, StatsError> = Stats.ofRow(row, items);

      expect(superposition.isAlive()).toBe(true);
      const stats: Stats = superposition.get();
      expect(stats.getStatsID().get().get()).toBe(row.statsID);
      expect(stats.getLanguageID().get().get()).toBe(row.languageID);
      expect(stats.getRegionID().get().get()).toBe(row.regionID);
      expect(stats.getTerm().getID()).toBe(row.termID);
      expect(stats.getName().get()).toBe(row.name);
      expect(stats.getUnit().get()).toBe(row.unit);
      expect(stats.getUpdatedAt().toString()).toBe(row.updatedAt);
      expect(stats.getItems().size()).toBe(items.size());
      for (let i: number = 0; i < items.size(); i++) {
        expect(stats.getItems().get(i).get().getStatsItemID()).toBe(items.get(i).get().getStatsItemID());
        expect(stats.getItems().get(i).get().getName()).toBe(items.get(i).get().getName());
        expect(stats.getItems().get(i).get().getValues().size()).toBe(items.get(i).get().getValues().size());
        for (let j: number = 0; j < stats.getItems().get(i).get().getValues().size(); j++) {
          const asOf: AsOf = items.get(i).get().getValues().getAsOfs().get(j).get();
          expect(stats.getItems().get(i).get().getValues().get(asOf).get().getValue()).toBe(items.get(i).get().getValues().get(asOf).get().getValue());
        }
      }
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because statsID is missing', () => {
      const n: unknown = {
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because statsID is not string', () => {
      const n: unknown = {
        statsID: false,
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because languageID is missing', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because languageID is not string', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: true,
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false region regionID is missing', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because regionID is not string', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        region: 8,
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because termID is missing', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because termID is not number', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 'soixante',
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because name is missing', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because name is not string', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: null,
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because unit is missing', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because unit is not string', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: null,
        updatedAt: '2000-01-01 00:00:00',
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

    it('returns false because updatedAt is missing', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
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

    it('returns false because updatedAt is not string', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: 2000,
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
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(Stats.isJSON(n)).toBe(false);
    });

    it('returns false because items is not array', () => {
      const n: unknown = {
        statsID: UUID.v4().get(),
        languageID: UUID.v4().get(),
        regionID: UUID.v4().get(),
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
        items: {
          c: {
            statsItemID: UUID.v4().get(),
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          d: {
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
      expect(stats.getLanguageID()).toBe(LanguageID.empty());
      expect(stats.getRegionID()).toBe(RegionID.empty());
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
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const stats1: Stats = Stats.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid4),
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
        new MockStatsID(uuid2),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid4),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid4),
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
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const stats1: Stats = Stats.of(
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid2),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid4),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid6),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
        new MockStatsID(uuid1),
        new MockLanguageID(uuid3),
        new MockRegionID(uuid5),
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
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const stats: Stats = Stats.of(
        StatsID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.ofArray([
          StatsItem.of(
            StatsItemID.of(uuid4),
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
        statsID: uuid1.get(),
        languageID: uuid2.get(),
        regionID: uuid3.get(),
        termID: 1,
        name: 'name1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: uuid4.get(),
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
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const name1: string = 'stats1';
      const name2: string = 'name1';
      const at1: string = '2000-01-02';
      const at2: string = '2000-01-01 02:03:04';
      const value1: number = 10;
      const term: Term = Term.DAILY;
      const unit: string = 'unit1';
      const stats: Stats = Stats.of(
        StatsID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        term,
        StatsName.of(name2),
        StatsUnit.of(unit),
        UpdatedAt.ofString(at2).get(),
        StatsItems.ofArray([
          StatsItem.of(
            StatsItemID.of(uuid4),
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

      expect(stats.toString()).toBe(`${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${term.getKey()} ${name2} ${unit} ${at2}`);
    });
  });

  describe('getColumns', () => {
    it('asOfs are taken and their duplicated values are eliminated', () => {
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
      new MockLanguageID(),
      new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        LanguageID.empty(),
        RegionID.empty(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        RegionID.empty(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats3: Stats = Stats.of(
        new MockStatsID(),
        LanguageID.empty(),
        new MockRegionID(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats4: Stats = Stats.of(
        new MockStatsID(),
        LanguageID.empty(),
        RegionID.empty(),
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
        LanguageID.empty(),
        RegionID.empty(),
        Term.DAILY,
        StatsName.empty(),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats6: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        LanguageID.empty(),
        RegionID.empty(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats9: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        LanguageID.empty(),
        new MockRegionID(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats12: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        RegionID.empty(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        LanguageID.empty(),
        RegionID.empty(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsID(),
        LanguageID.empty(),
        new MockRegionID(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats3: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        Term.DAILY,
        StatsName.empty(),
        StatsUnit.empty(),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats4: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
        Term.DAILY,
        StatsName.empty(),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats6: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats7: Stats = Stats.of(
        new MockStatsID(),
        LanguageID.empty(),
        RegionID.empty(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
        Term.DAILY,
        new MockStatsName('stats name'),
        new MockStatsUnit('stats unit'),
        new MockUpdatedAt(),
        new MockStatsItems()
      );
      const stats2: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const stats: Stats = Stats.of(
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
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

      stats.setData(
        Coordinate.of(
          Row.of(0).get(),
          Column.of(2).get()
        ),
        NumericalValue.of(4)
      );

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
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
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

      stats.setData(
        Coordinate.of(
          Row.of(0).get(),
          Column.of(2).get()),
        NumericalValue.of(2)
      );

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
        new MockStatsID(),
        new MockLanguageID(),
        new MockRegionID(),
        Term.DAILY,
        new MockStatsName(),
        new MockStatsUnit(),
        new MockUpdatedAt(),
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

      stats.deleteData(
        Coordinate.of(
          Row.of(0).get(),
          Column.of(1).get()
        )
      );

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
      const statsID: MockStatsID = new MockStatsID();
      const languageID: MockLanguageID = new MockLanguageID();
      const regionID: MockRegionID = new MockRegionID();
      const term: MockTerm = new MockTerm();
      const name: MockStatsName = new MockStatsName();
      const unit: MockStatsUnit = new MockStatsUnit();
      const updatedAt: MockUpdatedAt = new MockUpdatedAt();

      const stats: Stats = Stats.of(
        statsID,
        languageID,
        regionID,
        term,
        name,
        unit,
        updatedAt,
        StatsItems.empty()
      );
      const duplicated: Stats = stats.duplicate();

      expect(stats).not.toBe(duplicated);
      expect(stats.getStatsID()).toBe(statsID);
      expect(stats.getLanguageID()).toBe(languageID);
      expect(stats.getRegionID()).toBe(regionID);
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
        new MockLanguageID(),
        new MockRegionID(),
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
