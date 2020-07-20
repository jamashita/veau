import { UUID } from '@jamashita/publikum-uuid';

import { MockAsOf } from '../../AsOf/Mock/MockAsOf';
import { MockAsOfs } from '../../AsOf/Mock/MockAsOfs';
import { Column } from '../../Coordinate/Column';
import { Row } from '../../Coordinate/Row';
import { MockHeaderSize } from '../../HeaderSize/Mock/MockHeaderSize';
import { Language } from '../../Language/Language';
import { MockISO639 } from '../../Language/Mock/MockISO639';
import { MockLanguage } from '../../Language/Mock/MockLanguage';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockLanguageName } from '../../Language/Mock/MockLanguageName';
import { MockNumericalValue } from '../../NumericalValue/Mock/MockNumericalValue';
import { MockISO3166 } from '../../Region/Mock/MockISO3166';
import { MockRegion } from '../../Region/Mock/MockRegion';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { MockRegionName } from '../../Region/Mock/MockRegionName';
import { Region } from '../../Region/Region';
import { MockStatsItemName } from '../../StatsItem/Mock/MockStatsItemName';
import { StatsItemName } from '../../StatsItem/StatsItemName';
import { MockStatsID } from '../../StatsOutline/Mock/MockStatsID';
import { MockStatsName } from '../../StatsOutline/Mock/MockStatsName';
import { MockStatsOutline } from '../../StatsOutline/Mock/MockStatsOutline';
import { MockStatsUnit } from '../../StatsOutline/Mock/MockStatsUnit';
import { MockUpdatedAt } from '../../StatsOutline/Mock/MockUpdatedAt';
import { StatsName } from '../../StatsOutline/StatsName';
import { StatsUnit } from '../../StatsOutline/StatsUnit';
import { MockStatsValue } from '../../StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../StatsValue/Mock/MockStatsValues';
import { MockTerm } from '../../Term/Mock/MockTerm';
import { MockTermID } from '../../Term/Mock/MockTermID';
import { MockTermKey } from '../../Term/Mock/MockTermKey';
import { Term } from '../../Term/Term';
import { MockStatsItemDisplay } from '../Mock/MockStatsItemDisplay';
import { MockStatsItemDisplays } from '../Mock/MockStatsItemDisplays';
import { StatsDisplay } from '../StatsDisplay';

describe('StatsDisplay', () => {
  describe('of', () => {
    it('normal case', () => {
      const outline: MockStatsOutline = new MockStatsOutline();
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();
      const term: MockTerm = new MockTerm();
      const items: MockStatsItemDisplays = new MockStatsItemDisplays();
      const startDate: MockAsOf = new MockAsOf();
      const columns: MockAsOfs = new MockAsOfs();
      const size: MockHeaderSize = new MockHeaderSize();

      const display: StatsDisplay = StatsDisplay.of(outline, language, region, term, items, startDate, columns, size);

      expect(display.getOutline()).toBe(outline);
      expect(display.getLanguage()).toBe(language);
      expect(display.getRegion()).toBe(region);
      expect(display.getTerm()).toBe(term);
      expect(display.getItems()).toBe(items);
      expect(display.getStartDate()).toBe(startDate);
      expect(display.getItems()).toBe(items);
      expect(display.getItems()).toBe(items);
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const uuid7: UUID = UUID.v4();
      const uuid8: UUID = UUID.v4();

      const display1: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );
      const display2: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );
      const display3: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );
      const display4: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );
      const display5: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );
      const display6: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );
      const display7: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(new MockStatsItemDisplay()),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );
      const display8: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 3
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );
      const display9: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          })
        ),
        new MockHeaderSize(1)
      );
      const display10: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(10)
      );
      const display11: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        new MockAsOf({
          day: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            day: 3
          }),
          new MockAsOf({
            day: 4
          })
        ),
        new MockHeaderSize(1)
      );

      expect(display1.equals(display1)).toBe(true);
      expect(display1.equals(display2)).toBe(false);
      expect(display1.equals(display3)).toBe(false);
      expect(display1.equals(display4)).toBe(false);
      expect(display1.equals(display5)).toBe(false);
      expect(display1.equals(display6)).toBe(false);
      expect(display1.equals(display7)).toBe(false);
      expect(display1.equals(display8)).toBe(false);
      expect(display1.equals(display9)).toBe(false);
      expect(display1.equals(display10)).toBe(false);
      expect(display1.equals(display11)).toBe(true);
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
      const startDate: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf1: MockAsOf = new MockAsOf({
        day: 2
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 3
      });
      const size: number = 13;
      const display: StatsDisplay = StatsDisplay.of(
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
        new MockStatsItemDisplays(),
        startDate,
        new MockAsOfs(asOf1, asOf2),
        new MockHeaderSize(size)
      );

      expect(display.toString()).toBe(
        `${uuid1.get()} ${uuid2.get()} ${uuid3.get()} ${uuid4.get()} ${name} ${unit} 2000-01-01 01:02:03 ${uuid2.get()} ${languageName} ${englishLanguage} ${iso639} ${uuid3.get()} ${regionName} ${iso3166} ${uuid4.get()} ${key}  ${startDate.toString()} ${asOf1.toString()}, ${asOf2.toString()} ${size}`
      );
    });
  });

  describe('getColumn', () => {
    it('normal case', async () => {
      const display: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf({
          month: 2
        }),
        new MockAsOfs(
          new MockAsOf({
            year: 1999,
            month: 12,
            day: 31
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 1
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 2
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 3
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 4
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 5
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 6
          })
        ),
        new MockHeaderSize()
      );

      expect(display.getColumn(await Column.of(0).get())?.toString()).toBe('1999-12-31');
      expect(display.getColumn(await Column.of(1).get())?.toString()).toBe('2000-01-01');
      expect(display.getColumn(await Column.of(2).get())?.toString()).toBe('2000-01-02');
      expect(display.getColumn(await Column.of(3).get())?.toString()).toBe('2000-01-03');
      expect(display.getColumn(await Column.of(4).get())?.toString()).toBe('2000-01-04');
      expect(display.getColumn(await Column.of(5).get())?.toString()).toBe('2000-01-05');
      expect(display.getColumn(await Column.of(6).get())?.toString()).toBe('2000-01-06');
    });
  });

  describe('getRow', () => {
    it('normal case', async () => {
      const statsItem1: MockStatsItemDisplay = new MockStatsItemDisplay({
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
      const statsItem2: MockStatsItemDisplay = new MockStatsItemDisplay({
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

      const display: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        new MockTerm(),
        new MockStatsItemDisplays(statsItem1, statsItem2),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );

      expect(display.getRow(await Row.of(0).get())).toBe(statsItem1);
      expect(display.getRow(await Row.of(1).get())).toBe(statsItem2);
    });
  });

  describe('getData', () => {
    it('the matrix is made even if the value is not input', () => {
      const display: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline(),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay({
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
          new MockStatsItemDisplay({
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
        new MockAsOf(),
        new MockAsOfs(
          new MockAsOf({
            year: 1999,
            month: 12,
            day: 31
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 1
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 2
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 3
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 4
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 5
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 6
          })
        ),
        new MockHeaderSize()
      );

      expect(display.getData()).toEqual([
        ['', '1', '', '2', '', '', ''],
        ['', '2', '4', '', '', '6', '']
      ]);
    });
  });

  describe('isFilled', () => {
    it('returns true if the language, region, name, and unit are filled', () => {
      const display1: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display2: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display3: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display4: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display5: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: new MockStatsUnit('unit')
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display6: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display7: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display8: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display9: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );

      expect(display1.isFilled()).toBe(false);
      expect(display2.isFilled()).toBe(false);
      expect(display3.isFilled()).toBe(false);
      expect(display4.isFilled()).toBe(false);
      expect(display5.isFilled()).toBe(false);
      expect(display6.isFilled()).toBe(false);
      expect(display7.isFilled()).toBe(false);
      expect(display8.isFilled()).toBe(true);
      expect(display9.isFilled()).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true if the stats is filled', () => {
      const display1: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display2: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        Language.empty(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display3: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display4: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: StatsUnit.empty()
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display5: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: StatsName.empty(),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display6: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display7: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        Language.empty(),
        Region.empty(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay(),
          new MockStatsItemDisplay({
            name: new MockStatsItemName('cittadino')
          })
        ),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display8: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay({
            name: new MockStatsItemName('ogonek')
          }),
          new MockStatsItemDisplay({
            name: new MockStatsItemName('cittadino')
          })
        ),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
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
      const display1: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay({
            name: StatsItemName.empty()
          })
        ),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display2: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay({
            name: new MockStatsItemName('pok')
          }),
          new MockStatsItemDisplay({
            name: StatsItemName.empty()
          })
        ),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );

      expect(display1.isValid()).toBe(false);
      expect(display2.isValid()).toBe(false);
    });

    it('stats and their items are filled', () => {
      const display1: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display2: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay({
            name: new MockStatsItemName('fidanzato')
          })
        ),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );
      const display3: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay({
            name: new MockStatsItemName('nonna')
          }),
          new MockStatsItemDisplay({
            name: new MockStatsItemName('nipote')
          })
        ),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );

      expect(display1.isValid()).toBe(true);
      expect(display2.isValid()).toBe(true);
      expect(display3.isValid()).toBe(true);
    });
  });

  describe('getChart', () => {
    it('chart is output for recharts', () => {
      const display: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay({
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
          new MockStatsItemDisplay({
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
        ),
        new MockAsOf(),
        new MockAsOfs(
          new MockAsOf({
            year: 1999,
            month: 12,
            day: 31
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 1
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 2
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 3
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 4
          }),
          new MockAsOf({
            year: 2000,
            month: 1,
            day: 5
          })
        ),
        new MockHeaderSize()
      );

      expect(display.getChart()).toEqual([
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
      const display: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(
          new MockStatsItemDisplay({
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
        ),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );

      expect(display.isDetermined()).toBe(true);
    });

    it('returns false if stats does not have values nor startDate', () => {
      const display: StatsDisplay = StatsDisplay.of(
        new MockStatsOutline({
          name: new MockStatsName('stats name'),
          unit: new MockStatsUnit('stats unit')
        }),
        new MockLanguage(),
        new MockRegion(),
        Term.DAILY,
        new MockStatsItemDisplays(),
        new MockAsOf(),
        new MockAsOfs(),
        new MockHeaderSize()
      );

      expect(display.isDetermined()).toBe(false);
    });
  });
});
