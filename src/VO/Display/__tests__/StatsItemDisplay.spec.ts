import { Nullable } from '@jamashita/publikum-type';

import { MockAsOf } from '../../AsOf/Mock/MockAsOf';
import { MockAsOfs } from '../../AsOf/Mock/MockAsOfs';
import { MockNumericalValue } from '../../NumericalValue/Mock/MockNumericalValue';
import { NumericalValue } from '../../NumericalValue/NumericalValue';
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
      const statsItemID: MockStatsItemID = new MockStatsItemID();
      const name: MockStatsItemName = new MockStatsItemName();
      const statsValue: MockStatsValue = new MockStatsValue();

      const statsItem: StatsItemDisplay = StatsItemDisplay.of(statsItemID, name, new MockStatsValues(statsValue));

      expect(statsItem.getStatsItemID()).toBe(statsItemID);
      expect(statsItem.getName()).toBe(name);
      expect(statsItem.getValues().contains(statsValue)).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const statsItemID1: MockStatsItemID = new MockStatsItemID();
      const statsItemID2: MockStatsItemID = new MockStatsItemID();
      const statsItem1: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues()
      );
      const statsItem2: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID2,
        new MockStatsItemName(),
        new MockStatsValues()
      );
      const statsItem3: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID1,
        new MockStatsItemName('name 3'),
        new MockStatsValues(new MockStatsValue())
      );
      const statsItem4: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues(new MockStatsValue(), new MockStatsValue())
      );
      const statsItem5: StatsItemDisplay = StatsItemDisplay.of(
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
      const statsItem6: StatsItemDisplay = StatsItemDisplay.of(
        statsItemID1,
        new MockStatsItemName(),
        new MockStatsValues()
      );

      expect(statsItem1.equals(statsItem1)).toBe(true);
      expect(statsItem1.equals(statsItem2)).toBe(false);
      expect(statsItem1.equals(statsItem3)).toBe(false);
      expect(statsItem1.equals(statsItem4)).toBe(false);
      expect(statsItem1.equals(statsItem5)).toBe(false);
      expect(statsItem1.equals(statsItem6)).toBe(true);
    });
  });

  describe('getAdOfs', () => {
    it('extracts only their asOfs', () => {
      const asOf1: MockAsOf = new MockAsOf({
        day: 1
      });
      const asOf2: MockAsOf = new MockAsOf({
        day: 3
      });
      const statsItem: StatsItemDisplay = StatsItemDisplay.of(
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

      expect(statsItem.getAsOfs().size()).toBe(2);
      expect(statsItem.getAsOfs().get(0)).toBe(asOf1);
      expect(statsItem.getAsOfs().get(1)).toBe(asOf2);
    });
  });

  describe('getValuesByColumn', () => {
    it('returns empty string when the date is empty ', () => {
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
      const statsItem: StatsItemDisplay = StatsItemDisplay.of(
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

      const values: NumericalValues = statsItem.getValuesByColumn(column);

      expect(values.size()).toBe(3);
      const value1: Nullable<NumericalValue> = values.get(0);

      expect(value1?.toString()).toBe('1');

      const value2: Nullable<NumericalValue> = values.get(1);

      expect(value2?.toString()).toBe('');

      const value3: Nullable<NumericalValue> = values.get(2);

      expect(value3?.toString()).toBe('3');
    });
  });

  describe('isFilled', () => {
    it('returns true if the name is filled', () => {
      const statsItem1: StatsItemDisplay = StatsItemDisplay.of(
        new MockStatsItemID(),
        StatsItemName.empty(),
        new MockStatsValues()
      );
      const statsItem2: StatsItemDisplay = StatsItemDisplay.of(
        new MockStatsItemID(),
        StatsItemName.of('name'),
        new MockStatsValues()
      );

      expect(statsItem1.isFilled()).toBe(false);
      expect(statsItem2.isFilled()).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const id: string = '5ee0c273-c26f-432f-9217-d6a7b481a073';
      const name: string = 'name';
      const statsItemID: StatsItemID = await StatsItemID.ofString(id).get();
      const statsItemName: StatsItemName = StatsItemName.of(name);
      const statsValues: StatsValues = StatsValues.empty();

      const statsItem: StatsItemDisplay = StatsItemDisplay.of(statsItemID, statsItemName, statsValues);

      expect(statsItem.toString()).toBe(`${id} ${name} `);
    });
  });
});
