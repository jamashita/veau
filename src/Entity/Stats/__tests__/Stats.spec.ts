import { UUID } from '@jamashita/anden-uuid';
import { Nullable } from '@jamashita/anden-type';
import sinon, { SinonStub } from 'sinon';
import { AsOf } from '../../../VO/AsOf/AsOf';
import { AsOfs } from '../../../VO/AsOf/AsOfs';
import { MockAsOf } from '../../../VO/AsOf/Mock/MockAsOf';
import { Column } from '../../../VO/Coordinate/Column';
import { Coordinate } from '../../../VO/Coordinate/Coordinate';
import { MockColumn } from '../../../VO/Coordinate/Mock/MockColumn';
import { MockRow } from '../../../VO/Coordinate/Mock/MockRow';
import { Row } from '../../../VO/Coordinate/Row';
import { HeaderSize } from '../../../VO/HeaderSize/HeaderSize';
import { Language } from '../../../VO/Language/Language';
import { MockISO639 } from '../../../VO/Language/Mock/MockISO639';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { MockLanguageName } from '../../../VO/Language/Mock/MockLanguageName';
import { MockNumericalValue } from '../../../VO/NumericalValue/Mock/MockNumericalValue';
import { ValueContained } from '../../../VO/NumericalValue/ValueContained';
import { MockISO3166 } from '../../../VO/Region/Mock/MockISO3166';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { MockRegionName } from '../../../VO/Region/Mock/MockRegionName';
import { Region } from '../../../VO/Region/Region';
import { MockStatsItemName } from '../../../VO/StatsItem/Mock/MockStatsItemName';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { StatsError } from '../../../VO/StatsOutline/Error/StatsError';
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
import { Stats, StatsJSON } from '../Stats';

describe('Stats', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(5);

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
    it('normal case', () => {
      expect.assertions(25);

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

      const stats: Stats = Stats.ofJSON(json);

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(stats.getItems().get(i)?.getStatsItemID().get().get()).toBe(json.items[i]!.statsItemID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(stats.getItems().get(i)?.getName().get()).toBe(json.items[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(stats.getItems().get(i)?.getValues().size()).toBe(json.items[i]!.values.length);
        const item: Nullable<StatsItem> = stats.getItems().get(i);

        if (item === null) {
          fail();

          return;
        }

        for (let j: number = 0; j < item.getValues().size(); j++) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const asOf: AsOf = AsOf.ofString(json.items[i]!.values[j]!.asOf);

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(item.getValues().get(asOf)?.getAsOf().toString()).toBe(json.items[i]!.values[j]!.asOf);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(item.getValues().get(asOf)?.getValue().get()).toBe(json.items[i]!.values[j]!.value);
        }
      }
    });

    it('returns Dead if StatsOutline returns Dead', () => {
      expect.assertions(1);

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

      expect(() => {
        Stats.ofJSON(json);
      }).toThrow(StatsError);
    });

    it('returns Dead if Language returns Dead', () => {
      expect.assertions(1);

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

      expect(() => {
        Stats.ofJSON(json);
      }).toThrow(StatsError);
    });

    it('returns Dead if Region returns Dead', () => {
      expect.assertions(1);

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

      expect(() => {
        Stats.ofJSON(json);
      }).toThrow(StatsError);
    });

    it('returns Dead if Term returns Dead', () => {
      expect.assertions(1);

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

      expect(() => {
        Stats.ofJSON(json);
      }).toThrow(StatsError);
    });

    it('returns Dead if StatsItem returns Dead', () => {
      expect.assertions(1);

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

      expect(() => {
        Stats.ofJSON(json);
      }).toThrow(StatsError);
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(Stats.validate(null)).toBe(false);
      expect(Stats.validate(undefined)).toBe(false);
      expect(Stats.validate(56)).toBe(false);
      expect(Stats.validate('fjafsd')).toBe(false);
      expect(Stats.validate(false)).toBe(false);
    });

    it('returns false because outline is missing', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(false);
    });

    it('returns false because outline is not object', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(false);
    });

    it('returns false because language is missing', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(false);
    });

    it('returns false because language is not object', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(false);
    });

    it('returns false region region is missing', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(false);
    });

    it('returns false because region is not object', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(false);
    });

    it('returns false because items is missing', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(false);
    });

    it('returns false because items is not array', () => {
      expect.assertions(1);

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

      expect(Stats.validate(n)).toBe(false);
    });
  });

  describe('default', () => {
    it('id will be generated, data are empty', () => {
      expect.assertions(8);

      const stats: Stats = Stats.default();

      expect(stats.getStatsID().get().get()).toHaveLength(UUID.size());
      expect(stats.getName()).toBe(StatsName.empty());
      expect(stats.getUnit()).toBe(StatsUnit.empty());
      expect(stats.getItems().equals(StatsItems.empty())).toBe(true);
      expect(stats.getLanguage()).toBe(Language.empty());
      expect(stats.getRegion()).toBe(Region.empty());
      expect(stats.getTerm()).toBe(Term.DAILY);

      expect(stats.getStartDate()).toBeNull();
    });
  });

  describe('equals', () => {
    it('returns true if the ids equal', () => {
      expect.assertions(8);

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
      expect.assertions(1);

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

      expect(stats.toJSON()).toStrictEqual({
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
      expect.assertions(1);

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
      expect.assertions(8);

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

      const columns: Nullable<AsOfs> = stats.getColumns();

      expect(columns?.size()).toBe(7);
      expect(columns?.get(0)?.toString()).toBe('1999-12-31');
      expect(columns?.get(1)?.toString()).toBe('2000-01-01');
      expect(columns?.get(2)?.toString()).toBe('2000-01-02');
      expect(columns?.get(3)?.toString()).toBe('2000-01-03');
      expect(columns?.get(4)?.toString()).toBe('2000-01-04');
      expect(columns?.get(5)?.toString()).toBe('2000-01-05');
      expect(columns?.get(6)?.toString()).toBe('2000-01-06');
    });

    it('startDate is present', () => {
      expect.assertions(11);

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
        AsOf.ofString('2000-01-08')
      );

      const columns: Nullable<AsOfs> = stats.getColumns();

      expect(columns?.size()).toBe(10);
      expect(columns?.get(0)?.toString()).toBe('1999-12-31');
      expect(columns?.get(1)?.toString()).toBe('2000-01-01');
      expect(columns?.get(2)?.toString()).toBe('2000-01-02');
      expect(columns?.get(3)?.toString()).toBe('2000-01-03');
      expect(columns?.get(4)?.toString()).toBe('2000-01-04');
      expect(columns?.get(5)?.toString()).toBe('2000-01-05');
      expect(columns?.get(6)?.toString()).toBe('2000-01-06');
      expect(columns?.get(7)?.toString()).toBe('2000-01-07');
      expect(columns?.get(8)?.toString()).toBe('2000-01-08');
      expect(columns?.get(9)?.toString()).toBe('2000-01-09');
    });

    it('no AsOfs', () => {
      expect.assertions(1);

      const stats: Stats = Stats.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );

      const columns: Nullable<AsOfs> = stats.getColumns();

      expect(columns?.isEmpty()).toBe(true);
    });
  });

  describe('getRow', () => {
    it('normal case', () => {
      expect.assertions(2);

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

      expect(stats.getRow(Row.of(0))).toBe(statsItem1);
      expect(stats.getRow(Row.of(1))).toBe(statsItem2);
    });
  });

  describe('getRowHeaderSize', () => {
    it('normal case', () => {
      expect.assertions(1);

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

      const headerSize: HeaderSize = stats.getRowHeaderSize();

      expect(headerSize.get()).toBe(name2.length() * 14);
    });

    it('gives 1 * 14 when given stats', () => {
      expect.assertions(1);

      const stats: Stats = Stats.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsItems()
      );

      const headerSize: HeaderSize = stats.getRowHeaderSize();

      expect(headerSize.get()).toBe(14);
    });
  });

  describe('setData', () => {
    it('update pattern', () => {
      expect.assertions(3);

      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');
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

      stats.setData(Coordinate.of(Row.of(0), Column.of(2)), ValueContained.of(4));

      expect(stats.getItems().get(0)?.getValues().size()).toBe(2);
      expect(stats.getItems().get(0)?.getValues().get(asOf1)?.getValue().get()).toBe(1);
      expect(stats.getItems().get(0)?.getValues().get(asOf2)?.getValue().get()).toBe(4);
    });

    it('insert pattern', () => {
      expect.assertions(4);

      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');
      const asOf3: AsOf = AsOf.ofString('2000-01-03');
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

      stats.setData(Coordinate.of(Row.of(0), Column.of(2)), ValueContained.of(2));

      expect(stats.getItems().get(0)?.getValues().size()).toBe(3);
      expect(stats.getItems().get(0)?.getValues().get(asOf1)?.getValue().get()).toBe(1);
      expect(stats.getItems().get(0)?.getValues().get(asOf2)?.getValue().get()).toBe(2);
      expect(stats.getItems().get(0)?.getValues().get(asOf3)?.getValue().get()).toBe(3);
    });
  });

  describe('deleteData', () => {
    it('correctly deletes the specified StatsValue', () => {
      expect.assertions(7);

      const asOf1: AsOf = AsOf.ofString('2000-01-01');
      const asOf2: AsOf = AsOf.ofString('2000-01-02');
      const asOf3: AsOf = AsOf.ofString('2000-01-03');
      const asOf4: AsOf = AsOf.ofString('2000-01-05');
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

      stats.deleteData(Coordinate.of(Row.of(0), Column.of(1)));

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
      expect.assertions(8);

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
      expect.assertions(1);

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
      expect.assertions(1);

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
      expect.assertions(1);

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

  describe('getData', () => {
    it('the matrix is made even if the value is not input', () => {
      expect.assertions(1);

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

      expect(stats.getData()).toStrictEqual([
        ['', '1', '', '2', '', '', ''],
        ['', '2', '4', '', '', '6', '']
      ]);
    });
  });

  describe('isFilled', () => {
    it('returns true if the language, region, name, and unit are filled', () => {
      expect.assertions(9);

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
      expect.assertions(8);

      const display1: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItems()
      );
      const display2: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const display3: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const display4: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const display5: Stats = Stats.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const display6: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems()
      );
      const display7: Stats = Stats.of(
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
      const display8: Stats = Stats.of(
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

      expect(display1.isValid()).toBe(false);
      expect(display2.isValid()).toBe(false);
      expect(display3.isValid()).toBe(false);
      expect(display4.isValid()).toBe(false);
      expect(display5.isValid()).toBe(false);
      expect(display6.isValid()).toBe(true);
      expect(display7.isValid()).toBe(false);
      expect(display8.isValid()).toBe(true);
    });

    it('stats is filled but statsItems are invalid', () => {
      expect.assertions(2);

      const stats1: Stats = Stats.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItems(
          new MockStatsItem({
            name: StatsItemName.empty()
          })
        )
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
          new MockStatsItem({
            name: StatsItemName.empty()
          })
        )
      );

      expect(stats1.isValid()).toBe(false);
      expect(stats2.isValid()).toBe(false);
    });

    it('stats and their items are filled', () => {
      expect.assertions(3);

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

  describe('getChart', () => {
    it('chart is output for recharts', () => {
      expect.assertions(1);

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

      expect(stats.getChart()).toStrictEqual([
        {
          name: '1999-12-31'
        },
        {
          name: '2000-01-01',
          stats1: 1
        },
        {
          name: '2000-01-02',
          stats2: 12
        },
        {
          name: '2000-01-03',
          stats1: 2,
          stats2: 13
        },
        {
          name: '2000-01-04',
          stats2: 14
        },
        {
          name: '2000-01-05'
        }
      ]);
    });
  });

  describe('isDetermined', () => {
    it('has values , that means it already has some AsOfs', () => {
      expect.assertions(1);

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

    it('returns false if stats does not have values nor startDate', () => {
      expect.assertions(1);

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
