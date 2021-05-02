import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { ImmutableProject, MockProject } from '@jamashita/lluvia-collection';
import sinon, { SinonSpy } from 'sinon';
import { ISO3166 } from '../ISO3166';
import { MockISO3166 } from '../Mock/MockISO3166';
import { MockRegion } from '../Mock/MockRegion';
import { MockRegionID } from '../Mock/MockRegionID';
import { MockRegionName } from '../Mock/MockRegionName';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { Regions } from '../Regions';

describe('Regions', () => {
  describe('of', () => {
    it('when the ImmutableProject is zero size, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.of(ImmutableProject.empty<RegionID, Region>());

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const array: Array<MockRegion> = [new MockRegion(), new MockRegion()];

      const regions: Regions = Regions.ofArray(array);

      expect(regions.size()).toBe(array.length);
      for (let i: number = 0; i < regions.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const mock: MockRegion = array[i]!;

        expect(regions.get(mock.getRegionID())).toBe(mock);
      }
    });
  });

  describe('ofJSON', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.ofJSON([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(7);

      const json: Array<RegionJSON> = [
        {
          regionID: UUID.v4().get(),
          name: 'region 1',
          iso3166: 'abc'
        },
        {
          regionID: UUID.v4().get(),
          name: 'region 2',
          iso3166: 'def'
        }
      ];
      const regions: Regions = Regions.ofJSON(json);

      expect(regions.size()).toBe(json.length);

      json.forEach((j: RegionJSON) => {
        const r: Nullable<Region> = regions.get(RegionID.ofString(j.regionID));

        expect(j.regionID).toBe(r?.getRegionID().toString());
        expect(j.name).toBe(r?.getName().toString());
        expect(j.iso3166).toBe(r?.getISO3166().toString());
      });
    });
  });

  describe('ofRow', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.ofRow([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(4);

      const rows: Array<RegionRow> = [
        {
          regionID: UUID.v4().get(),
          name: 'region 1',
          iso3166: 'abc'
        }
      ];

      const regions: Regions = Regions.ofRow(rows);

      expect(regions.size()).toBe(rows.length);
      for (let i: number = 0; i < regions.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const regionID: RegionID = RegionID.ofString(rows[i]!.regionID);
        const region: Nullable<Region> = regions.get(regionID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getRegionID().get().get()).toBe(rows[i]!.regionID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getName().get()).toBe(rows[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(region?.getISO3166().get()).toBe(rows[i]!.iso3166);
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.ofArray([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const regs: Array<MockRegion> = [new MockRegion(), new MockRegion()];

      const regions: Regions = Regions.ofArray(regs);

      expect(regions.size()).toBe(regs.length);
      for (let i: number = 0; i < regions.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(regions.get(regs[i]!.getRegionID())).toBe(regs[i]);
      }
    });
  });

  describe('ofSpread', () => {
    it('when no arguments given, returns Regions.empty()', () => {
      expect.assertions(1);

      const regions: Regions = Regions.ofSpread();

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      expect.assertions(3);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const regs: Array<MockRegion> = [region1, region2];

      const regions: Regions = Regions.ofSpread(region1, region2);

      expect(regions.size()).toBe(regs.length);
      for (let i: number = 0; i < regions.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(regions.get(regs[i]!.getRegionID())).toBe(regs[i]);
      }
    });
  });

  describe('empty', () => {
    it('generates 0-length Regions', () => {
      expect.assertions(1);

      expect(Regions.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Regions.empty()).toBe(Regions.empty());
    });
  });

  describe('validate', () => {
    it('normal case', () => {
      expect.assertions(1);

      const n: unknown = [
        {
          regionID: 'to to',
          name: 'Albania',
          iso3166: 'ALB'
        }
      ];

      expect(Regions.validate(n)).toBe(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect.assertions(5);

      expect(Regions.validate(null)).toBe(false);
      expect(Regions.validate(undefined)).toBe(false);
      expect(Regions.validate(56)).toBe(false);
      expect(Regions.validate('fjafsd')).toBe(false);
      expect(Regions.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect.assertions(1);

      expect(Regions.validate({})).toBe(false);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.get = spy;
      regions.get(new MockRegionID());

      expect(spy.called).toBe(true);
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.contains = spy;
      regions.contains(region1);

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.size = spy;
      regions.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.forEach = spy;
      regions.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('does not affect the length, only change the instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const regions: Regions = Regions.of(project);

      const arr: Array<ISO3166> = [...regions.values()].map<ISO3166>((region: Region) => {
        return region.getISO3166();
      });

      expect(arr).toHaveLength(3);
    });
  });

  describe('find', () => {
    it('returns Region if the element exists', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.find = spy;
      regions.find(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('returns matching elements by predicate', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion({
        name: new MockRegionName('name 1')
      });
      const region2: MockRegion = new MockRegion({
        name: new MockRegionName('name 2')
      });
      const region3: MockRegion = new MockRegion({
        name: new MockRegionName('name 0')
      });

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const regions: Regions = Regions.of(project);

      const filtered: Regions = regions.filter((r: Region) => {
        return r.getName().get() === 'name 0';
      });

      expect(filtered.size()).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.isEmpty = spy;
      regions.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const regions: Regions = Regions.empty();

      expect(regions.equals(null)).toBe(false);
      expect(regions.equals(undefined)).toBe(false);
      expect(regions.equals('')).toBe(false);
      expect(regions.equals('123')).toBe(false);
      expect(regions.equals('abcd')).toBe(false);
      expect(regions.equals(123)).toBe(false);
      expect(regions.equals(0)).toBe(false);
      expect(regions.equals(-12)).toBe(false);
      expect(regions.equals(0.3)).toBe(false);
      expect(regions.equals(false)).toBe(false);
      expect(regions.equals(true)).toBe(false);
      expect(regions.equals(Symbol('p'))).toBe(false);
      expect(regions.equals(20n)).toBe(false);
      expect(regions.equals({})).toBe(false);
      expect(regions.equals([])).toBe(false);
      expect(regions.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        name: new MockRegionName('region'),
        iso3166: new MockISO3166('abd')
      });

      const regions: Regions = Regions.ofArray([region1, region2]);

      expect(regions.equals(regions)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.equals = spy;
      regions.equals(Regions.empty());

      expect(spy.called).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      expect.assertions(1);

      const uuid: UUID = UUID.v4();
      const regions: Regions = Regions.ofArray([
        Region.of(RegionID.of(uuid), RegionName.of('region 1'), ISO3166.of('abc'))
      ]);

      expect(regions.toJSON()).toStrictEqual([
        {
          regionID: uuid.get(),
          name: 'region 1',
          iso3166: 'abc'
        }
      ]);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.toString = spy;
      regions.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('normal case', () => {
      expect.assertions(3);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const arr: Array<MockRegion> = [region1, region2, region3];

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const regions: Regions = Regions.of(project);
      let i: number = 0;

      for (const [, v] of regions) {
        expect(v).toBe(arr[i]);
        i++;
      }
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.every = spy;
      regions.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.some = spy;
      regions.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MockProject<MockRegionID, MockRegion> = new MockProject<MockRegionID, MockRegion>(
        new Map<MockRegionID, MockRegion>([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );

      const spy: SinonSpy = sinon.spy();
      const regions: Regions = Regions.of(project);

      // @ts-expect-error
      regions.regions.values = spy;
      regions.values();

      expect(spy.called).toBe(true);
    });
  });
});
