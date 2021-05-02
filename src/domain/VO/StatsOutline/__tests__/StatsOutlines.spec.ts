import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { ImmutableProject, MockProject } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { LanguageID } from '../../Language/LanguageID';
import { RegionID } from '../../Region/RegionID';
import { TermID } from '../../Term/TermID';
import { StatsOutlineError } from '../Error/StatsOutlineError';
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
      expect.assertions(1);

      expect(StatsOutlines.of(ImmutableProject.empty<MockStatsID, MockStatsOutline>())).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const array: Array<MockStatsOutline> = [new MockStatsOutline(), new MockStatsOutline()];

      const outlines: StatsOutlines = StatsOutlines.ofArray(array);

      expect(outlines.size()).toBe(array.length);

      array.forEach((o: MockStatsOutline) => {
        expect(outlines.get(o.getStatsID())).toBe(o);
      });
    });
  });

  describe('ofJSON', () => {
    it('normal case', () => {
      expect.assertions(14);

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

      const outlines: StatsOutlines = StatsOutlines.ofJSON(json);

      for (let i: number = 0; i < 2; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const outline: Nullable<StatsOutline> = outlines.get(StatsID.ofString(json[i]!.statsID));

        expect(outline?.getStatsID().get().get()).toBe(json[i]?.statsID);
        expect(outline?.getLanguageID().get().get()).toBe(json[i]?.languageID);
        expect(outline?.getRegionID().get().get()).toBe(json[i]?.regionID);
        expect(outline?.getTermID().get().get()).toBe(json[i]?.termID);
        expect(outline?.getName().get()).toBe(json[i]?.name);
        expect(outline?.getUnit().get()).toBe(json[i]?.unit);
        expect(outline?.getUpdatedAt().toString()).toBe(json[i]?.updatedAt);
      }
    });

    it('has malformat StatsID', () => {
      expect.assertions(1);

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

      expect(() => {
        StatsOutlines.ofJSON(json);
      }).toThrow(StatsOutlineError);
    });
  });

  describe('ofRow', () => {
    it('normal case', () => {
      expect.assertions(14);

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

      const outlines: StatsOutlines = StatsOutlines.ofRow(rows);

      for (let i: number = 0; i < 2; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const outline: Nullable<StatsOutline> = outlines.get(StatsID.ofString(rows[i]!.statsID));

        expect(outline?.getStatsID().get().get()).toBe(rows[i]?.statsID);
        expect(outline?.getLanguageID().get().get()).toBe(rows[i]?.languageID);
        expect(outline?.getRegionID().get().get()).toBe(rows[i]?.regionID);
        expect(outline?.getTermID().get().get()).toBe(rows[i]?.termID);
        expect(outline?.getName().get()).toBe(rows[i]?.name);
        expect(outline?.getUnit().get()).toBe(rows[i]?.unit);
        expect(outline?.getUpdatedAt().toString()).toBe(rows[i]?.updatedAt);
      }
    });

    it('has malformat StatsID', () => {
      expect.assertions(1);

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

      expect(() => {
        StatsOutlines.ofRow(rows);
      }).toThrow(StatsOutlineError);
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns StatsOutlines.empty()', () => {
      expect.assertions(1);

      expect(StatsOutlines.ofArray([])).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const outlines: Array<StatsOutline> = [new MockStatsOutline(), new MockStatsOutline()];

      const statsOutlines: StatsOutlines = StatsOutlines.ofArray(outlines);

      expect(statsOutlines.size()).toBe(outlines.length);
      for (let i: number = 0; i < statsOutlines.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(statsOutlines.get(outlines[i]!.getStatsID())).toBe(outlines[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns StatsOutlines.empty()', () => {
      expect.assertions(1);

      expect(StatsOutlines.ofSpread()).toBe(StatsOutlines.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

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
      expect.assertions(1);

      expect(StatsOutlines.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(StatsOutlines.empty()).toBe(StatsOutlines.empty());
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

      const n: unknown = [
        {
          statsID: 'oink',
          languageID: 'miaow',
          regionID: 'moin',
          termID: 'doodle',
          name: 'off',
          unit: 'on',
          updatedAt: 'today'
        }
      ];

      expect(StatsOutlines.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(StatsOutlines.validate(null)).toBe(false);
      expect(StatsOutlines.validate(undefined)).toBe(false);
      expect(StatsOutlines.validate(56)).toBe(false);
      expect(StatsOutlines.validate('fjafsd')).toBe(false);
      expect(StatsOutlines.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect.assertions(1);

      expect(StatsOutlines.validate({})).toBe(false);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.get = spy;

      statsOutlines.get(new MockStatsID());

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.contains = spy;

      statsOutlines.contains(outline1);

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.isEmpty = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();

      project.size = spy;

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      statsOutlines.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.forEach = spy;

      statsOutlines.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      const arr: Array<StatsID> = [...statsOutlines.values()].map<StatsID>((outline: StatsOutline) => {
        return outline.getStatsID();
      });

      expect(arr).toHaveLength(3);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const outlines: StatsOutlines = StatsOutlines.empty();

      expect(outlines.equals(null)).toBe(false);
      expect(outlines.equals(undefined)).toBe(false);
      expect(outlines.equals('')).toBe(false);
      expect(outlines.equals('123')).toBe(false);
      expect(outlines.equals('abcd')).toBe(false);
      expect(outlines.equals(123)).toBe(false);
      expect(outlines.equals(0)).toBe(false);
      expect(outlines.equals(-12)).toBe(false);
      expect(outlines.equals(0.3)).toBe(false);
      expect(outlines.equals(false)).toBe(false);
      expect(outlines.equals(true)).toBe(false);
      expect(outlines.equals(Symbol('p'))).toBe(false);
      expect(outlines.equals(20n)).toBe(false);
      expect(outlines.equals({})).toBe(false);
      expect(outlines.equals([])).toBe(false);
      expect(outlines.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();

      const outlines: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);

      expect(outlines.equals(outlines)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.equals = spy;

      statsOutlines.equals(new MockStatsOutlines());

      expect(spy.called).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('shallow copies the instance and its own elements', () => {
      expect.assertions(12);

      const array: Array<MockStatsOutline> = [new MockStatsOutline(), new MockStatsOutline(), new MockStatsOutline()];
      const outlines: StatsOutlines = StatsOutlines.ofArray(array);
      const duplicated: StatsOutlines = outlines.duplicate();

      expect(outlines).not.toBe(duplicated);
      expect(outlines.equals(duplicated)).toBe(true);
      expect(outlines.size()).toBe(duplicated.size());
      for (let i: number = 0; i < outlines.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const o: Nullable<StatsOutline> = outlines.get(array[i]!.getStatsID());
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const d: Nullable<StatsOutline> = duplicated.get(array[i]!.getStatsID());

        expect(o).not.toBeNull();
        expect(d).not.toBeNull();
        expect(o).toBe(d);
      }
    });

    it('returns StatsOutlines.empty() when the original is empty', () => {
      expect.assertions(1);

      const outlines: StatsOutlines = StatsOutlines.ofArray([]);

      expect(outlines.duplicate()).toBe(outlines);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

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
        UpdatedAt.ofString('2000-01-01 00:00:00')
      );
      const outline2: StatsOutline = StatsOutline.of(
        StatsID.of(uuid5),
        LanguageID.of(uuid6),
        RegionID.of(uuid7),
        TermID.of(uuid8),
        StatsName.of('stats name'),
        StatsUnit.of('stats unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00')
      );

      const outlines: StatsOutlines = StatsOutlines.ofArray([outline1, outline2]);

      expect(outlines.toJSON()).toStrictEqual([
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
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.toString = spy;

      statsOutlines.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(3);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const arr: Array<MockStatsOutline> = [outline1, outline2, outline3];

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);
      let i: number = 0;

      for (const [, v] of statsOutlines) {
        expect(v).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.every = spy;

      statsOutlines.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.some = spy;

      statsOutlines.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.values = spy;

      statsOutlines.values();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline({
        name: StatsName.of('outline 1')
      });
      const outline2: MockStatsOutline = new MockStatsOutline({
        name: StatsName.of('outline 2')
      });
      const outline3: MockStatsOutline = new MockStatsOutline({
        name: StatsName.of('outline 1')
      });

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      const filtered: StatsOutlines = statsOutlines.filter((o: StatsOutline) => {
        return o.getName().get() === 'outline 1';
      });

      expect(filtered.size()).toBe(2);
    });
  });

  describe('find', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const outline1: MockStatsOutline = new MockStatsOutline();
      const outline2: MockStatsOutline = new MockStatsOutline();
      const outline3: MockStatsOutline = new MockStatsOutline();

      const project: MockProject<MockStatsID, MockStatsOutline> = new MockProject<MockStatsID, MockStatsOutline>(
        new Map<MockStatsID, MockStatsOutline>([
          [outline1.getStatsID(), outline1],
          [outline2.getStatsID(), outline2],
          [outline3.getStatsID(), outline3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const statsOutlines: StatsOutlines = StatsOutlines.of(project);

      // @ts-expect-error
      statsOutlines.outlines.find = spy;

      statsOutlines.find(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });
});
