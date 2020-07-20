import { ImmutableProject, MockAProject } from '@jamashita/publikum-collection';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import sinon, { SinonSpy } from 'sinon';

import { LanguageID } from '../../Language/LanguageID';
import { RegionID } from '../../Region/RegionID';
import { TermID } from '../../Term/TermID';
import { StatsOutlineError } from '../Error/StatsOutlineError';
import { StatsOutlinesError } from '../Error/StatsOutlinesError';
import { MockStatsID } from '../Mock/MockStatsID';
import { MockStatsOutline } from '../Mock/MockStatsOutline';
import { MockStatsOutlines } from '../Mock/MockStatsOutlines';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../StatsOutline';
import { StatsOutlines } from '../StatsOutlines';
import { StatsUnit } from '../StatsUnit';
import { UpdatedAt } from '../UpdatedAt';

describe('StatsOutlines', () => {
  describe('of', () => {
    it('when the ImmutableProject is zero size, returns empty', () => {
      expect(StatsOutlines.of(ImmutableProject.empty<MockStatsID, MockStatsOutline>())).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const array: Array<MockStatsOutline> = [new MockStatsOutline(), new MockStatsOutline()];

      const outlines: StatsOutlines = StatsOutlines.ofArray(array);

      expect(outlines.size()).toBe(array.length);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(array[i].getStatsID())).toBe(array[i]);
      }
    });
  });

  describe('ofSuperposition', () => {
    it('when empty Array given, returns Alive, and StatsOutlines.empty()', async () => {
      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([]);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(StatsOutlines.empty());
    });

    it('normal case', async () => {
      const array: Array<MockStatsOutline> = [new MockStatsOutline(), new MockStatsOutline()];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
        Superposition.alive<StatsOutline, StatsOutlineError>(array[0], StatsOutlineError),
        Superposition.alive<StatsOutline, StatsOutlineError>(array[1], StatsOutlineError)
      ]);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      expect(outlines.size()).toBe(2);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(array[i].getStatsID())).toBe(array[i]);
      }
    });

    it('contains failure', async () => {
      const statsOutline1: MockStatsOutline = new MockStatsOutline();

      const superposition1: Superposition<StatsOutline, StatsOutlineError> = Superposition.alive<StatsOutline,
        StatsOutlineError>(statsOutline1, StatsOutlineError);
      const superposition2: Superposition<StatsOutline, StatsOutlineError> = Superposition.dead<StatsOutline,
        StatsOutlineError>(new StatsOutlineError('test failed'), StatsOutlineError);
      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsOutlinesError);
    });

    it('contains 2 failures', async () => {
      const superposition1: Superposition<StatsOutline, StatsOutlineError> = Superposition.dead<StatsOutline,
        StatsOutlineError>(new StatsOutlineError('test failed 1'), StatsOutlineError);
      const superposition2: Superposition<StatsOutline, StatsOutlineError> = Superposition.dead<StatsOutline,
        StatsOutlineError>(new StatsOutlineError('test failed 2'), StatsOutlineError);
      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofSuperposition([
        superposition1,
        superposition2
      ]);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsOutlinesError);
    });
  });

  describe('ofJSON', () => {
    it('normal case', async () => {
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      for (let i: number = 0; i < 2; i++) {
        const outline: Nullable<StatsOutline> = outlines.get(await StatsID.ofString(json[i].statsID).get());

        expect(outline?.getStatsID().get().get()).toBe(json[i].statsID);
        expect(outline?.getLanguageID().get().get()).toBe(json[i].languageID);
        expect(outline?.getRegionID().get().get()).toBe(json[i].regionID);
        expect(outline?.getTermID().get().get()).toBe(json[i].termID);
        expect(outline?.getName().get()).toBe(json[i].name);
        expect(outline?.getUnit().get()).toBe(json[i].unit);
        expect(outline?.getUpdatedAt().toString()).toBe(json[i].updatedAt);
      }
    });

    it('has malformat StatsID', async () => {
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: 'malformat',
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofJSON(json);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });
  });

  describe('ofRow', () => {
    it('normal case', async () => {
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      for (let i: number = 0; i < 2; i++) {
        const outline: Nullable<StatsOutline> = outlines.get(await StatsID.ofString(rows[i].statsID).get());

        expect(outline?.getStatsID().get().get()).toBe(rows[i].statsID);
        expect(outline?.getLanguageID().get().get()).toBe(rows[i].languageID);
        expect(outline?.getRegionID().get().get()).toBe(rows[i].regionID);
        expect(outline?.getTermID().get().get()).toBe(rows[i].termID);
        expect(outline?.getName().get()).toBe(rows[i].name);
        expect(outline?.getUnit().get()).toBe(rows[i].unit);
        expect(outline?.getUpdatedAt().toString()).toBe(rows[i].updatedAt);
      }
    });

    it('has malformat StatsID', async () => {
      const rows: Array<StatsOutlineRow> = [
        {
          statsID: 'malformat',
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: UUID.v4().get(),
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const superposition: Superposition<StatsOutlines, StatsOutlinesError> = StatsOutlines.ofRow(rows);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlinesError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsOutlines.empty()', () => {
      expect(StatsOutlines.ofArray([])).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const outlines: Array<StatsOutline> = [new MockStatsOutline(), new MockStatsOutline()];

      const statsOutlines: StatsOutlines = StatsOutlines.ofArray(outlines);

      expect(statsOutlines.size()).toBe(outlines.length);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        expect(statsOutlines.get(outlines[i].getStatsID())).toBe(outlines[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsOutlines.empty()', () => {
      expect(StatsOutlines.ofSpread()).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      const statsOutline1: MockStatsOutline = new MockStatsOutline();
      const statsOutline2: MockStatsOutline = new MockStatsOutline();

      const statsOutlines: StatsOutlines = StatsOutlines.ofSpread(statsOutline1, statsOutline2);

      expect(statsOutlines.size()).toBe(2);
      expect(statsOutlines.get(statsOutline1.getStatsID())).toBe(statsOutline1);
      expect(statsOutlines.get(statsOutline2.getStatsID())).toBe(statsOutline2);
    });
  });

  describe('empty', () => {
    it('generates 0-length StatsOutlines', () => {
      expect(StatsOutlines.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(StatsOutlines.empty()).toBe(StatsOutlines.empty());
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.get = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.get(new MockStatsID());

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.contains = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.contains(outline1);

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.isEmpty = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.size = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.forEach = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      const arr: Array<StatsID> = statsOutlines.map<StatsID>((outline: StatsOutline) => {
        return outline.getStatsID();
      });

      expect(arr.length).toBe(3);
    });
  });

  describe('equals', () => {
    it('same instance', () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);

      expect(outlines.equals(outlines)).toBe(true);
    });

    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.equals = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.equals(new MockStatsOutlines());

      expect(spy.called).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('shallow copies the instance and its own elements', () => {
      const array: Array<MockStatsOutline> = [new MockStatsOutline(), new MockStatsOutline(), new MockStatsOutline()];
      const outlines: StatsOutlines = StatsOutlines.ofArray(array);
      const duplicated: StatsOutlines = outlines.duplicate();

      expect(outlines).not.toBe(duplicated);
      expect(outlines.equals(duplicated)).toBe(true);
      expect(outlines.size()).toBe(duplicated.size());
      for (let i: number = 0; i < outlines.size(); i++) {
        const statsID: StatsID = array[i].getStatsID();
        const o: Nullable<StatsOutline> = outlines.get(statsID);
        const d: Nullable<StatsOutline> = duplicated.get(statsID);

        expect(o).not.toBe(null);
        expect(d).not.toBe(null);
        expect(o).toBe(d);
      }
    });

    it('returns StatsOutlines.empty() when the original is empty', () => {
      const outlines: StatsOutlines = StatsOutlines.ofArray([]);

      expect(outlines.duplicate()).toBe(outlines);
    });
  });

  describe('toJSON', () => {
    it('normal case', async () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const uuid3: UUID = UUID.v4();
      const uuid4: UUID = UUID.v4();
      const uuid5: UUID = UUID.v4();
      const uuid6: UUID = UUID.v4();
      const uuid7: UUID = UUID.v4();
      const uuid8: UUID = UUID.v4();
      const outline1: StatsOutline = StatsOutline.of(
        StatsID.of(uuid1),
        LanguageID.of(uuid2),
        RegionID.of(uuid3),
        TermID.of(uuid4),
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        await UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );
      const outline2: StatsOutline = StatsOutline.of(
        StatsID.of(uuid5),
        LanguageID.of(uuid6),
        RegionID.of(uuid7),
        TermID.of(uuid8),
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        await UpdatedAt.ofString('2000-01-01 00:00:00').get()
      );

      const outlines: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);

      expect(outlines.toJSON()).toEqual([
        {
          statsID: uuid1.get(),
          languageID: uuid2.get(),
          regionID: uuid3.get(),
          termID: uuid4.get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: uuid5.get(),
          languageID: uuid6.get(),
          regionID: uuid7.get(),
          termID: uuid8.get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ]);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.toString = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const arr: Array<MockStatsOutline> = [outline1, outline2, outline3];

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);
      let i: number = 0;

      for (const pair of statsOutlines) {
        expect(pair.getValue()).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.every = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', async () => {
      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockAProject<MockStatsID, MockStatsOutline> = new MockAProject<MockStatsID, MockStatsOutline>(new Map<MockStatsID, MockStatsOutline>(
        [
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ]
      ));

      const spy: SinonSpy = sinon.spy();

      project.some = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});
