import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { StatsItemError } from '../../veau-error/StatsItemError';
import { StatsItemsError } from '../../veau-error/StatsItemsError';
import { None } from '../../veau-general/Optional/None';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
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
import { StatsItem, StatsItemJSON, StatsItemRow } from '../StatsItem';
import { StatsItems } from '../StatsItems';

describe('StatsItems', () => {
  describe('add', () => {
    it('does not affect the original one', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty());
      const statsItems1: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = statsItems1.add(statsItem3);

      expect(statsItems1.size()).toEqual(2);
      expect(statsItems1.get(0)).toEqual(statsItem1);
      expect(statsItems1.get(1)).toEqual(statsItem2);

      expect(statsItems2.size()).toEqual(3);
      expect(statsItems2.get(0)).toEqual(statsItem1);
      expect(statsItems2.get(1)).toEqual(statsItem2);
      expect(statsItems2.get(2)).toEqual(statsItem3);
    });
  });


  describe('get', () => {
    it('returns Language instance at the correct index', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const items: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);

      expect(items.size()).toEqual(2);
      expect(items.get(0).get()).toEqual(statsItem1);
      expect(items.get(1).get()).toEqual(statsItem2);
    });

    it('returns None when the index is out of range', () => {
      const items: StatsItems = StatsItems.empty();

      expect(items.get(-1)).toBeInstanceOf(None);
      expect(items.get(0)).toBeInstanceOf(None);
    });
  });

  describe('move', () => {
    it('first index', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty());
      const statsItems: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(Column.of(0).get(), Column.of(1).get());

      expect(moved.size()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem2);
      expect(moved.get(1)).toEqual(statsItem1);
      expect(moved.get(2)).toEqual(statsItem3);
    });

    it('middle index', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty());
      const statsItems: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(Column.of(1).get(), Column.of(2).get());

      expect(moved.size()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem1);
      expect(moved.get(1)).toEqual(statsItem3);
      expect(moved.get(2)).toEqual(statsItem2);
    });

    it('last index', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty());
      const statsItems: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const moved: StatsItems = statsItems.move(Column.of(2).get(), Column.of(0).get());

      expect(moved.size()).toEqual(3);
      expect(moved.get(0)).toEqual(statsItem3);
      expect(moved.get(1)).toEqual(statsItem2);
      expect(moved.get(2)).toEqual(statsItem1);
    });
  });

  describe('replace', () => {
    it('first index', () => {
      const statsItems: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty())
      ]);

      const statsItem: StatsItem = StatsItem.of(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f').get(), StatsItemName.of('new stats item'), StatsValues.empty());

      const replaced: StatsItems = statsItems.replace(statsItem, Row.of(0).get());

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0)).toEqual(statsItem);
      expect(replaced.get(1)).not.toEqual(statsItem);
      expect(replaced.get(2)).not.toEqual(statsItem);
    });

    it('middle index', () => {
      const statsItems: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty())
      ]);

      const statsItem: StatsItem = StatsItem.of(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f').get(), StatsItemName.of('new stats item'), StatsValues.empty());

      const replaced: StatsItems = statsItems.replace(statsItem, Row.of(1).get());

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0)).not.toEqual(statsItem);
      expect(replaced.get(1)).toEqual(statsItem);
      expect(replaced.get(2)).not.toEqual(statsItem);
    });

    it('last index', () => {
      const statsItems: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty())
      ]);

      const statsItem: StatsItem = StatsItem.of(StatsItemID.of('06023e5f-7908-4bce-9536-c64dc484756f').get(), StatsItemName.of('new stats item'), StatsValues.empty());

      const replaced: StatsItems = statsItems.replace(statsItem, Row.of(2).get());

      expect(replaced.size()).toEqual(3);
      expect(replaced.get(0)).not.toEqual(statsItem);
      expect(replaced.get(1)).not.toEqual(statsItem);
      expect(replaced.get(2)).toEqual(statsItem);
    });
  });

  describe('removeItem', () => {
    it('correctly removed the same object', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty());
      const statsItems: StatsItems = StatsItems.of([
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
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 11'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 111'), StatsValues.empty());
      const statsItems: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      expect(statsItems.maxNameLength()).toEqual('stats item 111'.length);
    });

    it('should give 0 when items are 0', () => {
      const statsItems: StatsItems = StatsItems.of([
      ]);

      expect(statsItems.maxNameLength()).toEqual(0);
    });
  });

  describe('getAsOfs', () => {
    it('collects all AsOfs even if the date is same', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([
        StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(1))
      ]));
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 11'), StatsValues.of([
        StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-04').get(), NumericalValue.of(1))
      ]));
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 111'), StatsValues.of([
        StatsValue.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), AsOf.ofString('2000-01-04').get(), NumericalValue.of(1)),
        StatsValue.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), AsOf.ofString('2000-01-05').get(), NumericalValue.of(1))
      ]));
      const statsItems: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2,
        statsItem3
      ]);

      const asOfs: AsOfs = statsItems.getAsOfs();
      expect(asOfs.size()).toEqual(8);
      expect(asOfs.get(0).toString()).toEqual('2000-01-01');
      expect(asOfs.get(1).toString()).toEqual('2000-01-02');
      expect(asOfs.get(2).toString()).toEqual('2000-01-03');
      expect(asOfs.get(3).toString()).toEqual('2000-01-02');
      expect(asOfs.get(4).toString()).toEqual('2000-01-03');
      expect(asOfs.get(5).toString()).toEqual('2000-01-04');
      expect(asOfs.get(6).toString()).toEqual('2000-01-04');
      expect(asOfs.get(7).toString()).toEqual('2000-01-05');
    });
  });

  describe('getNames', () => {
    it('normal case', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 11'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 111'), StatsValues.empty());
      const statsItems: StatsItems = StatsItems.of([
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
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.default(), StatsValues.empty());
      const statsItems1: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.of([
        statsItem2,
        statsItem3
      ]);

      expect(statsItems1.areFilled()).toEqual(true);
      expect(statsItems2.areFilled()).toEqual(false);
    });
  });

  describe('areValid', () => {
    it('returns true if the all items are valid', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.default(), StatsValues.empty());
      const statsItems1: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.of([
        statsItem2,
        statsItem3
      ]);

      expect(statsItems1.areValid()).toEqual(true);
      expect(statsItems2.areValid()).toEqual(false);
    });
  });

  describe('haveValues', () => {
    it('no items', () => {
      const statsItems: StatsItems = StatsItems.of([
      ]);

      expect(statsItems.haveValues()).toEqual(false);
    });

    it('no values', () => {
      const statsItems1: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06').get(), StatsItemName.of('item1'), StatsValues.of([
        ]))
      ]);
      const statsItems2: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('c9aa6bc7-2f38-49e0-8f5e-a650a43e8885').get(), StatsItemName.of('item1'), StatsValues.of([
        ])),
        StatsItem.of(StatsItemID.of('67379875-06e6-47be-8faf-945e93aa47cf').get(), StatsItemName.of('item1'), StatsValues.of([
        ]))
      ]);

      expect(statsItems1.haveValues()).toEqual(false);
      expect(statsItems2.haveValues()).toEqual(false);
    });

    it('have values', () => {
      const statsItemID: StatsItemID = StatsItemID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06').get();
      const statsItems: StatsItems = StatsItems.of([
        StatsItem.of(statsItemID, StatsItemName.of('item1'), StatsValues.of([
          StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(1))
        ]))
      ]);

      expect(statsItems.haveValues()).toEqual(true);
    });
  });

  describe('contains', () => {
    it('returns true if the element exists in the Colors', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty());
      const statsItem4: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItems: StatsItems = StatsItems.of([
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
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());
      const statsItem3: StatsItem = StatsItem.of(StatsItemID.of('22dc7052-fe53-48ff-ad51-9e7fd20c3498').get(), StatsItemName.of('stats item 3'), StatsValues.empty());
      const statsItems: StatsItems = StatsItems.of([
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
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());

      const statsItems1: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.of([
      ]);

      expect(statsItems1.isEmpty()).toEqual(false);
      expect(statsItems2.isEmpty()).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns false if the length is differnet', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());

      const statsItems1: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.of([
        statsItem2
      ]);

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(false);
    });

    it('returns false if the sequence is different', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());

      const statsItems1: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.of([
        statsItem2,
        statsItem1
      ]);

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(false);
    });

    it('returns true if the elements and their order are same', () => {
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty());

      const statsItems1: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);
      const statsItems2: StatsItems = StatsItems.of([
        statsItem1,
        statsItem2
      ]);

      expect(statsItems1.equals(statsItems1)).toEqual(true);
      expect(statsItems1.equals(statsItems2)).toEqual(true);
    });
  });

  describe('areSame', () => {
    it('returns true if all the properties are the same', () => {
      const statsItems1: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty())
      ]);
      const statsItems2: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty())
      ]);
      const statsItems3: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty())
      ]);
      const statsItems4: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty())
      ]);
      const statsItems5: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty())
      ]);
      const statsItems6: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 3'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty())
      ]);
      const statsItems7: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 4'), StatsValues.empty())
      ]);
      const statsItems8: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1))])),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty())
      ]);
      const statsItems9: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.of([StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1))]))
      ]);
      const statsItems10: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([StatsValue.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1))])),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.of([StatsValue.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1))]))
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

  describe('toJSON', () => {
    it('normal case', () => {
      const statsItems: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.empty())
      ]);

      expect(statsItems.toJSON()).toEqual([
        {
          statsItemID: '8f7b1783-b09c-4010-aac1-dca1292ee700',
          name: 'stats item 1',
          values: [
          ]
        },
        {
          statsItemID: '9e6b3c69-580c-4c19-9f3f-9bd82f582551',
          name: 'stats item 2',
          values: [
          ]
        }
      ]);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const id1: string = '8f7b1783-b09c-4010-aac1-dca1292ee700';
      const id2: string = '9e6b3c69-580c-4c19-9f3f-9bd82f582551';
      const name1: string = 'stats item 1';
      const name2: string = 'stats item 2';
      const statsItems: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.of(id1).get(), StatsItemName.of(name1), StatsValues.empty()),
        StatsItem.of(StatsItemID.of(id2).get(), StatsItemName.of(name2), StatsValues.empty())
      ]);

      expect(statsItems.toString()).toEqual(`${id1} ${name1} , ${id2} ${name2} `);
    });
  });

  describe('ofTry', () => {
    it('normal case', () => {
      const id1: string = '8f7b1783-b09c-4010-aac1-dca1292ee700';
      const id2: string = '9e6b3c69-580c-4c19-9f3f-9bd82f582551';
      const name1: string = 'stats item 1';
      const name2: string = 'stats item 2';
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of(id1).get(), StatsItemName.of(name1), StatsValues.empty());
      const statsItem2: StatsItem = StatsItem.of(StatsItemID.of(id2).get(), StatsItemName.of(name2), StatsValues.empty());

      const trial1: Try<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem1);
      const trial2: Try<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem2);

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofTry([trial1, trial2]);

      expect(trial.isSuccess()).toEqual(true);
      const items: StatsItems = trial.get();
      expect(items.size()).toEqual(2);
      expect(items.get(0)).toEqual(statsItem1);
      expect(items.get(1)).toEqual(statsItem2);
    });

    it('contains failure', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const id1: string = '8f7b1783-b09c-4010-aac1-dca1292ee700';
      const name1: string = 'stats item 1';
      const statsItem1: StatsItem = StatsItem.of(StatsItemID.of(id1).get(), StatsItemName.of(name1), StatsValues.empty());

      const trial1: Try<StatsItem, StatsItemError> = Success.of<StatsItem, StatsItemError>(statsItem1);
      const trial2: Try<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(new StatsItemError('test failed'));

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofTry([trial1, trial2]);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError) => {
        expect(err).toBeInstanceOf(StatsItemsError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('will be multiple failures', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial1: Try<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(new StatsItemError('test failed1'));
      const trial2: Try<StatsItem, StatsItemError> = Failure.of<StatsItem, StatsItemError>(new StatsItemError('test failed2'));

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofTry([trial1, trial2]);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsItemsError) => {
        expect(err).toBeInstanceOf(StatsItemsError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('ofJSON', () => {
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

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(trial.isSuccess()).toEqual(true);
      const items: StatsItems = trial.get();
      expect(items.size()).toEqual(2);
      for (let i: number = 0; i < items.size(); i++) {
        const item: StatsItem = items.get(i).get();
        expect(item.getStatsItemID().get()).toEqual(json[i].statsItemID);
        expect(item.getName().get()).toEqual(json[i].name);
      }
    });

    it('contains malformat statsItemID', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const json: Array<StatsItemJSON> = [
        {
          statsItemID: 'malformat uuid',
          name: 'stats name 1',
          values: []
        },
        {
          statsItemID: '1f0719d6-6512-43b3-93f9-2a92bcb51e32',
          name: 'stats name 2',
          values: []
        }
      ];

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat statsItemIDs', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const json: Array<StatsItemJSON> = [
        {
          statsItemID: 'malformat uuid 1',
          name: 'stats name 1',
          values: []
        },
        {
          statsItemID: 'malformat uuid 2',
          name: 'stats name 2',
          values: []
        }
      ];

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofJSON(json);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      const row: Array<StatsItemRow> = [
        {
          statsItemID: 'b1524ae3-8e91-4938-9997-579ef7b84602',
          name: 'stats name 1'
        },
        {
          statsItemID: '1f0719d6-6512-43b3-93f9-2a92bcb51e32',
          name: 'stats name 2'
        }
      ];

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofRow(row, StatsValues.empty());

      expect(trial.isSuccess()).toEqual(true);
      const items: StatsItems = trial.get();
      expect(items.size()).toEqual(2);
      for (let i: number = 0; i < items.size(); i++) {
        const item: StatsItem = items.get(i).get();
        expect(item.getStatsItemID().get()).toEqual(row[i].statsItemID);
        expect(item.getName().get()).toEqual(row[i].name);
      }
    });

    it('contains malformat statsItemID', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const row: Array<StatsItemRow> = [
        {
          statsItemID: 'malformat uuid',
          name: 'stats name 1'
        },
        {
          statsItemID: '1f0719d6-6512-43b3-93f9-2a92bcb51e32',
          name: 'stats name 2'
        }
      ];

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofRow(row, StatsValues.empty());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('contains malformat statsItemIDs', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const row: Array<StatsItemRow> = [
        {
          statsItemID: 'malformat uuid 1',
          name: 'stats name 1'
        },
        {
          statsItemID: 'malformat uuid 2',
          name: 'stats name 2'
        }
      ];

      const trial: Try<StatsItems, StatsItemsError> = StatsItems.ofRow(row, StatsValues.empty());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>((items: StatsItems) => {
        spy1();
      }, (err: StatsItemsError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsItemsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('empty', () => {
    it('gives 0-length StatsItems', () => {
      expect(StatsItems.empty().isEmpty()).toEqual(true);
    });
  });
});
