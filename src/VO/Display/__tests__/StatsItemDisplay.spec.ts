import { MockAsOf } from '../../AsOf/Mock/MockAsOf';
import { MockAsOfs } from '../../AsOf/Mock/MockAsOfs';
import { MockNumericalValue } from '../../NumericalValue/Mock/MockNumericalValue';
import { NumericalValues } from '../../NumericalValue/NumericalValues';
import { MockStatsItemID } from '../../StatsItem/Mock/MockStatsItemID';
import { MockStatsItemName } from '../../StatsItem/Mock/MockStatsItemName';
import { StatsItemID } from '../../StatsItem/StatsItemID';
import { StatsItemName } from '../../StatsItem/StatsItemName';
import { MockStatsValue } from '../../StatsValue/Mock/MockStatsValue';
import { MockStatsValues } from '../../StatsValue/Mock/MockStatsValues';
import { StatsValues } from '../../StatsValue/StatsValues';
import { StatsItemDisplay } from '../StatsItemDisplay';

describe('StatsItemDisplay', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(1);

      const statsItemID: MockStatsItemID = new MockStatsItemID();
      const name: MockStatsItemName = new MockStatsItemName();
      const statsValue: MockStatsValue = new MockStatsValue();

      const display: StatsItemDisplay = StatsItemDisplay.of(statsItemID, name, new MockStatsValues(statsValue));

      expect(display.getStatsItemID()).toBe(statsItemID);
      expect(display.getName()).toBe(name);
      expect(display.getValues().contains(statsValue)).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      expect.assertions(1);

      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const display1: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues()
      );
      const display2: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID2,
        new MockStatsItemName(),
        new MockStatsValues()
      );
      const display3: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID1,
        new MockStatsItemName('name 3'),
        new MockStatsValues(new MockStatsValue())
      );
      const display4: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues(new MockStatsValue(), new MockStatsValue())
      );
      const display5: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID2,
        new MockStatsItemName(),
        new MockStatsValues(
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 2
            })
          })
        )
      );
      const display6: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues()
      );

      expect(display1.equals(display1)).toBe(true);
      expect(display1.equals(display2)).toBe(false);
      expect(display1.equals(display3)).toBe(false);
      expect(display1.equals(display4)).toBe(false);
      expect(display1.equals(display5)).toBe(false);
      expect(display1.equals(display6)).toBe(true);
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      expect.assertions(1);

      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 3
      });
      const display: StatsItemDisplay = StatsItemDisplay.of(
        new MockStatsItemID(),
        new MockStatsItemName(),
        new MockStatsValues(
          new MockStatsValue({
            asOf: asOf1
          }),
          new MockStatsValue({
            asOf: asOf2
          })
        )
      );

      expect(display.getAsOfs().size()).toBe(2);
      expect(display.getAsOfs().get(0)).toBe(asOf1);
      expect(display.getAsOfs().get(1)).toBe(asOf2);
    });
  });

  describe('getValuesByColumn', () => {
    it('returns empty string when the date is empty', () => {
      expect.assertions(1);

      const column: MockAsOfs = new MockAsOfs(
        new MockAsOf({
          day: 1
        }),
        new MockAsOf({
          day: 2
        }),
        new MockAsOf({
          day: 3
        })
      );
      const display: StatsItemDisplay = StatsItemDisplay.of(
        new MockStatsItemID(),
        new MockStatsItemName(),
        new MockStatsValues(
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 1
            }),
            value: new MockNumericalValue(1)
          }),
          new MockStatsValue({
            asOf: new MockAsOf({
              day: 3
            }),
            value: new MockNumericalValue(3)
          })
        )
      );

      const values: NumericalValues = display.getValuesByColumn(column);

      expect(values.size()).toBe(3);
      expect(values.get(0)?.toString()).toBe('1');
      expect(values.get(1)?.toString()).toBe('');
      expect(values.get(2)?.toString()).toBe('3');
    });
  });

  describe('isFilled', () => {
    it('returns true if the name is filled', () => {
      expect.assertions(1);

      const display1: StatsItemDisplay = StatsItemDisplay.of(
        new MockStatsItemID(),
        StatsItemName.empty(),
        new MockStatsValues()
      );
      const display2: StatsItemDisplay = StatsItemDisplay.of(
        new MockStatsItemID(),
        StatsItemName.of('name'),
        new MockStatsValues()
      );

      expect(display1.isFilled()).toBe(false);
      expect(display2.isFilled()).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const id: string = '5ee0c273-c26f-432f-9217-d6a7b481a073';
      const name: string = 'name';
      const statsItemID: StatsItemID = StatsItemID.ofString(id);
      const statsItemName: StatsItemName = StatsItemName.of(name);
      const statsValues: StatsValues = StatsValues.empty();

      const display: StatsItemDisplay = StatsItemDisplay.of(statsItemID, statsItemName, statsValues);

      expect(display.toString()).toBe(`${id} ${name} `);
    });
  });
});
