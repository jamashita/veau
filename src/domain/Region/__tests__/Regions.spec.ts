import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { ImmutableProject, MutableProject, Project } from '@jamashita/lluvia-project';
import { ISO3166 } from '../ISO3166';
import { MockRegion } from '../mock/MockRegion';
import { Region, RegionJSON, RegionRow } from '../Region';
import { RegionID } from '../RegionID';
import { RegionName } from '../RegionName';
import { Regions } from '../Regions';

describe('Regions', () => {
  describe('of', () => {
    it('when the ImmutableProject is zero size, returns Regions.empty()', () => {
      const regions: Regions = Regions.of(ImmutableProject.empty());

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const array: Array<MockRegion> = [
        new MockRegion({
          regionID: RegionID.ofString('f8614570-1b57-464b-8787-ec97f258766b')
        }),
        new MockRegion({
          regionID: RegionID.ofString('a626fa24-083e-4170-8eb5-935b8578ac88')
        })
      ];

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
      const regions: Regions = Regions.ofJSON([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
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
      const regions: Regions = Regions.ofRow([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
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

        expect(region?.getRegionID().get().get()).toBe(rows[i]?.regionID);
        expect(region?.getName().get()).toBe(rows[i]?.name);
        expect(region?.getISO3166().get()).toBe(rows[i]?.iso3166);
      }
    });
  });

  describe('ofArray', () => {
    it('when empty Array given, returns Regions.empty()', () => {
      const regions: Regions = Regions.ofArray([]);

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const regs: Array<MockRegion> = [
        new MockRegion({
          regionID: RegionID.ofString('f8614570-1b57-464b-8787-ec97f258766b')
        }),
        new MockRegion({
          regionID: RegionID.ofString('a626fa24-083e-4170-8eb5-935b8578ac88')
        })
      ];

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
      const regions: Regions = Regions.ofSpread();

      expect(regions).toBe(Regions.empty());
    });

    it('normal case', () => {
      const region1: MockRegion = new MockRegion({
        regionID: RegionID.ofString('f8614570-1b57-464b-8787-ec97f258766b')
      });
      const region2: MockRegion = new MockRegion({
        regionID: RegionID.ofString('a626fa24-083e-4170-8eb5-935b8578ac88')
      });
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
      expect(Regions.empty().size()).toBe(0);
    });

    it('returns singleton instance', () => {
      expect(Regions.empty()).toBe(Regions.empty());
    });
  });

  describe('validate', () => {
    it('normal case', () => {
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
      expect(Regions.validate(null)).toBe(false);
      expect(Regions.validate(undefined)).toBe(false);
      expect(Regions.validate(56)).toBe(false);
      expect(Regions.validate('fjafsd')).toBe(false);
      expect(Regions.validate(false)).toBe(false);
    });

    it('returns false because given parameter is not an array', () => {
      expect(Regions.validate({})).toBe(false);
    });
  });

  describe('get', () => {
    it('delegates its inner collection instance', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'get');

      // @ts-expect-error
      regions.regions = project;
      regions.get(RegionID.ofString('83b33c16-1506-4556-9cd9-27df3c4da9df'));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'contains');

      // @ts-expect-error
      regions.regions = project;
      regions.contains(region1);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'size');

      // @ts-expect-error
      regions.regions = project;
      regions.size();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'forEach');

      // @ts-expect-error
      regions.regions = project;
      regions.forEach(() => {
        // NOOP
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('does not affect the length, only change the instance', () => {
      const region1: MockRegion = new MockRegion({
        regionID: RegionID.ofString('f8614570-1b57-464b-8787-ec97f258766b')
      });
      const region2: MockRegion = new MockRegion({
        regionID: RegionID.ofString('a626fa24-083e-4170-8eb5-935b8578ac88')
      });
      const region3: MockRegion = new MockRegion({
        regionID: RegionID.ofString('35e86ced-dfc4-4c8e-bb9b-a8b25d180076')
      });

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'map');

      // @ts-expect-error
      regions.regions = project;
      regions.map((region: Region): Region => {
        return region;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('returns Region if the element exists', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'find');

      // @ts-expect-error
      regions.regions = project;
      regions.find(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('returns matching elements by predicate', () => {
      const region1: MockRegion = new MockRegion({
        regionID: RegionID.ofString('f8614570-1b57-464b-8787-ec97f258766b')
      });
      const region2: MockRegion = new MockRegion({
        regionID: RegionID.ofString('a626fa24-083e-4170-8eb5-935b8578ac88')
      });
      const region3: MockRegion = new MockRegion({
        regionID: RegionID.ofString('705a6fbc-b3b4-4d5a-aac6-f06ddf0ed36c')
      });

      const project: Project<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'filter');

      // @ts-expect-error
      regions.regions = project;
      regions.filter(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'isEmpty');

      // @ts-expect-error
      regions.regions = project;
      regions.isEmpty();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
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
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion({
        name: RegionName.of('region'),
        iso3166: ISO3166.of('abd')
      });

      const regions: Regions = Regions.ofArray([region1, region2]);

      expect(regions.equals(regions)).toBe(true);
    });

    it('delegates its inner collection instance', () => {
      const region1: MockRegion = new MockRegion({
        regionID: RegionID.ofString('f8614570-1b57-464b-8787-ec97f258766b')
      });
      const region2: MockRegion = new MockRegion({
        regionID: RegionID.ofString('a626fa24-083e-4170-8eb5-935b8578ac88')
      });
      const region3: MockRegion = new MockRegion({
        regionID: RegionID.ofString('705a6fbc-b3b4-4d5a-aac6-f06ddf0ed36c')
      });

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'equals');

      // @ts-expect-error
      regions.regions = project;
      regions.equals(Regions.ofArray([
        region2
      ]));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
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

  describe('iterator', () => {
    it('normal case', () => {
      const region1: MockRegion = new MockRegion({
        regionID: RegionID.ofString('f8614570-1b57-464b-8787-ec97f258766b')
      });
      const region2: MockRegion = new MockRegion({
        regionID: RegionID.ofString('a626fa24-083e-4170-8eb5-935b8578ac88')
      });
      const region3: MockRegion = new MockRegion({
        regionID: RegionID.ofString('705a6fbc-b3b4-4d5a-aac6-f06ddf0ed36c')
      });

      const arr: Array<MockRegion> = [region1, region2, region3];

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
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
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'every');

      // @ts-expect-error
      regions.regions = project;
      regions.every(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'some');

      // @ts-expect-error
      regions.regions = project;
      regions.some(() => {
        return true;
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('values', () => {
    it('delegates its inner collection instance', () => {
      const region1: MockRegion = new MockRegion();
      const region2: MockRegion = new MockRegion();
      const region3: MockRegion = new MockRegion();

      const project: MutableProject<RegionID, MockRegion> = MutableProject.ofMap(
        new Map([
          [region1.getRegionID(), region1],
          [region2.getRegionID(), region2],
          [region3.getRegionID(), region3]
        ])
      );
      const regions: Regions = Regions.ofArray([]);

      const spy: jest.SpyInstance = jest.spyOn(project, 'values');

      // @ts-expect-error
      regions.regions = project;
      regions.values();

      expect(spy).toHaveBeenCalled();
    });
  });
});
