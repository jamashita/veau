import 'jest';
import { AsOf } from '../../veau-vo/AsOf';
import { AsOfs } from '../../veau-vo/AsOfs';
import { Column } from '../../veau-vo/Column';
import { NumericalValue } from '../../veau-vo/NumericalValue';
import { Row } from '../../veau-vo/Row';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsItemNames } from '../../veau-vo/StatsItemNames';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsValues } from '../../veau-vo/StatsValues';
import { StatsItem, StatsItemJSON } from '../StatsItem';
import { StatsItems } from '../StatsItems';

describe('StatsItems', () => {
  describe('move', () => {
    it('first index', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(Column.of(0), Column.of(1));

      expect(moved.size()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem2);
      expect(moved.get(1)).toEqual(statsItem1);
      expect(moved.get(2)).toEqual(statsItem3);
    });

    it('middle index', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(Column.of(1), Column.of(2));

      expect(moved.size()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem1);
      expect(moved.get(1)).toEqual(statsItem3);
      expect(moved.get(2)).toEqual(statsItem2);
    });

    it('last index', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(Column.of(2), Column.of(0));

      expect(moved.size()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem3);
      expect(moved.get(1)).toEqual(statsItem2);
      expect(moved.get(2)).toEqual(statsItem1);
    });
  });

  describe('replace', () => {
    it('first index', () => {
      const statsItems: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]))
      ]);

      const statsItem: StatsItem = StatsItem.from(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f'), StatsItemName.of('new stats item'), StatsValues.of([]));

      const replaced: StatsItems = statsItems.replace(statsItem, Row.of(0));

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0)).toEqual(statsItem);
      expect(replaced.get(1)).not.toEqual(statsItem);
      expect(replaced.get(2)).not.toEqual(statsItem);
    });

    it('middle index', () => {
      const statsItems: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]))
      ]);

      const statsItem: StatsItem = StatsItem.from(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f'), StatsItemName.of('new stats item'), StatsValues.of([]));

      const replaced: StatsItems = statsItems.replace(statsItem, Row.of(1));

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0)).not.toEqual(statsItem);
      expect(replaced.get(1)).toEqual(statsItem);
      expect(replaced.get(2)).not.toEqual(statsItem);
    });

    it('last index', () => {
      const statsItems: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]))
      ]);

      const statsItem: StatsItem = StatsItem.from(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f'), StatsItemName.of('new stats item'), StatsValues.of([]));

      const replaced: StatsItems = statsItems.replace(statsItem, Row.of(2));

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0)).not.toEqual(statsItem);
      expect(replaced.get(1)).not.toEqual(statsItem);
      expect(replaced.get(2)).toEqual(statsItem);
    });
  });

  describe('removeItem', () => {
    it('correctly removed the same object', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const removed: StatsItems = statsItems.remove(statsItem1);

      expect(removed.size()).toEqual(2);
      expect(removed.get(0)).toEqual(statsItem2);
      expect(removed.get(1)).toEqual(statsItem3);
    });
  });

  describe('maxNameLength', () => {
    it('normal case', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 11'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 111'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      expect(statsItems.maxNameLength()).toEqual('stats item 111'.length);
    });

    it('should give 0 when items are 0', () => {
      const statsItems: StatsItems = StatsItems.from([
      ]);

      expect(statsItems.maxNameLength()).toEqual(0);
    });
  });

  describe('getAsOfs', () => {
    it('collects all AsOfs even if the date is same', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([
        StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), AsOf.ofString('2000-01-01'), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), AsOf.ofString('2000-01-02'), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), AsOf.ofString('2000-01-03'), NumericalValue.of(1))
      ]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 11'), StatsValues.of([
        StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), AsOf.ofString('2000-01-02'), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), AsOf.ofString('2000-01-03'), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), AsOf.ofString('2000-01-04'), NumericalValue.of(1))
      ]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 111'), StatsValues.of([
        StatsValue.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), AsOf.ofString('2000-01-04'), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), AsOf.ofString('2000-01-05'), NumericalValue.of(1))
      ]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const asOfs: AsOfs = statsItems.getAsOfs();
      expect(asOfs.size()).toEqual(8);
      expect(asOfs.get(0).getString()).toEqual('2000-01-01');
      expect(asOfs.get(1).getString()).toEqual('2000-01-02');
      expect(asOfs.get(2).getString()).toEqual('2000-01-03');
      expect(asOfs.get(3).getString()).toEqual('2000-01-02');
      expect(asOfs.get(4).getString()).toEqual('2000-01-03');
      expect(asOfs.get(5).getString()).toEqual('2000-01-04');
      expect(asOfs.get(6).getString()).toEqual('2000-01-04');
      expect(asOfs.get(7).getString()).toEqual('2000-01-05');
    });
  });

  describe('getNames', () => {
    it('normal case', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 11'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 111'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const names: StatsItemNames = statsItems.getNames();
      expect(names.size()).toEqual(3);
      expect(names.get(0).get()).toEqual('stats item 1');
      expect(names.get(1).get()).toEqual('stats item 11');
      expect(names.get(2).get()).toEqual('stats item 111');
    });
  });

  describe('areFilled', () => {
    it('returns true if the all items are filled', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.default(), StatsValues.of([]));
      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        statsItem2,
        statsItem3
      ]);

      expect(statsItems1.areFilled()).toEqual(true);
      expect(statsItems2.areFilled()).toEqual(false);
    });
  });

  describe('areValid', () => {
    it('returns true if the all items are valid', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.default(), StatsValues.of([]));
      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        statsItem2,
        statsItem3
      ]);

      expect(statsItems1.areValid()).toEqual(true);
      expect(statsItems2.areValid()).toEqual(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      const statsItems: StatsItems = StatsItems.from([
      ]);

      expect(statsItems.haveValues()).toEqual(false);
    });

    it('no values', () => {
      const statsItems1: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06'), StatsItemName.of('item1'), StatsValues.of([
        ]))
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('c9aa6bc7-2f38-49e0-8f5e-a650a43e8885'), StatsItemName.of('item1'), StatsValues.of([
        ])),
        StatsItem.from(StatsItemID.of('67379875-06e6-47be-8faf-945e93aa47cf'), StatsItemName.of('item1'), StatsValues.of([
        ]))
      ]);

      expect(statsItems1.haveValues()).toEqual(false);
      expect(statsItems2.haveValues()).toEqual(false);
    });

    it('have values', () => {
      const statsItemID: StatsItemID = StatsItemID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06');
      const statsItems: StatsItems = StatsItems.from([
        StatsItem.from(statsItemID, StatsItemName.of('item1'), StatsValues.of([
          StatsValue.of(statsItemID, AsOf.ofString('2000-01-01'), NumericalValue.of(1))
        ]))
      ]);

      expect(statsItems.haveValues()).toEqual(true);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Colors', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItem4: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);

      expect(statsItems.contains(statsItem1)).toEqual(true);
      expect(statsItems.contains(statsItem2)).toEqual(true);
      expect(statsItems.contains(statsItem3)).toEqual(false);
      expect(statsItems.contains(statsItem4)).toEqual(true);
    });
  });

  describe('copy', () => {
    it('deeply copied', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));
      const statsItem3: StatsItem = StatsItem.from(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498'), StatsItemName.of('stats item 3'), StatsValues.of([]));
      const statsItems: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const copied: StatsItems = statsItems.copy();

      expect(statsItems).not.toBe(copied);
      expect(copied.get(0)).toEqual(statsItem1);
      expect(copied.get(1)).toEqual(statsItem2);
      expect(copied.get(2)).toEqual(statsItem3);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));

      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
      ]);

      expect(statsItems1.isEmpty()).toEqual(false);
      expect(statsItems2.isEmpty()).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns false if the length is differnet', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));

      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        statsItem2
      ]);

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));

      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        statsItem2,
        statsItem1
      ]);

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(false);
    });

    it('returns true if the elements and their order are same', () => {
      const statsItem1: StatsItem = StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]));
      const statsItem2: StatsItem = StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]));

      const statsItems1: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        statsItem1,
        statsItem2
      ]);

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(true);
    });
  });

  describe('areSame', () => {
    it('returns true if all the properties are the same', () => {
      const statsItems1: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems2: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]))
      ]);
      const statsItems3: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems4: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([]))
      ]);
      const statsItems5: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems6: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 3'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems7: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 4'), StatsValues.of([]))
      ]);
      const statsItems8: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), AsOf.ofString('2000-01-01'), NumericalValue.of(1))])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([]))
      ]);
      const statsItems9: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), AsOf.ofString('2000-01-01'), NumericalValue.of(1))]))
      ]);
      const statsItems10: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), AsOf.ofString('2000-01-01'), NumericalValue.of(1))])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), AsOf.ofString('2000-01-01'), NumericalValue.of(1))]))
      ]);

      expect(statsItems1.areSame(statsItems1)).toEqual(true);
      expect(statsItems1.areSame(statsItems2)).toEqual(false);
      expect(statsItems1.areSame(statsItems3)).toEqual(false);
      expect(statsItems1.areSame(statsItems4)).toEqual(false);
      expect(statsItems1.areSame(statsItems5)).toEqual(true);
      expect(statsItems1.areSame(statsItems6)).toEqual(false);
      expect(statsItems1.areSame(statsItems7)).toEqual(false);
      expect(statsItems1.areSame(statsItems8)).toEqual(false);
      expect(statsItems1.areSame(statsItems9)).toEqual(false);
      expect(statsItems1.areSame(statsItems10)).toEqual(false);
    });
  });

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: Array<StatsItemJSON> = [
        {
          statsItemID: 'b1524ae3-8e91-4938-9997-579ef7b84602',
          name: 'stats name 1',
          values: []
        },
        {
          statsItemID: '1f0719d6-6512-43b3-93f9-2a92bcb51e32',
          name: 'stats name 2',
          values: []
        }
      ];

      const items: StatsItems = StatsItems.fromJSON(json);

      expect(items.size()).toEqual(2);
      expect(items.get(0).getStatsItemID().get()).toEqual(json[0].statsItemID);
      expect(items.get(0).getName().get()).toEqual(json[0].name);
      expect(items.get(1).getStatsItemID().get()).toEqual(json[1].statsItemID);
      expect(items.get(1).getName().get()).toEqual(json[1].name);
    });
  });
});
