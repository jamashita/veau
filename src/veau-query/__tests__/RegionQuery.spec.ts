import 'jest';
import sinon, { SinonStub } from 'sinon';
import { RegionCommand } from '../../veau-command/RegionCommand';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { veauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { veauRedis } from '../../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region } from '../../veau-vo/Region';
import { Regions } from '../../veau-vo/Regions';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('all', () => {
    it('Redis returns regions', async () => {
      const stub: SinonStub = sinon.stub();
      veauRedis.getString().get = stub;
      stub.resolves('[{"regionID":1,"name":"Afghanistan","iso3166":"AFG"},{"regionID":2,"name":"Albania","iso3166":"ALB"}]');

      const regionQuery: RegionQuery = RegionQuery.getInstance();
      const regions: Regions = await regionQuery.all();

      expect(regions.size()).toEqual(2);
      expect(regions.get(0).getRegionID().get()).toEqual(1);
      expect(regions.get(0).getName().get()).toEqual('Afghanistan');
      expect(regions.get(0).getISO3166().get()).toEqual('AFG');
      expect(regions.get(1).getRegionID().get()).toEqual(2);
      expect(regions.get(1).getName().get()).toEqual('Albania');
      expect(regions.get(1).getISO3166().get()).toEqual('ALB');
    });

    it('MySQL returns regions', async () => {
      const stub1: SinonStub = sinon.stub();
      veauRedis.getString().get = stub1;
      // @ts-ignore
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      veauMySQL.execute = stub2;
      stub2.resolves([
        {
          regionID: 1,
          name: 'Afghanistan',
          iso3166: 'AFG'
        },
        {
          regionID: 2,
          name: 'Albania',
          iso3166: 'ALB'
        }
      ]);
      const stub3: SinonStub = sinon.stub();
      RegionCommand.prototype.insertAll = stub3;
      stub3.resolves();

      const regionQuery: RegionQuery = RegionQuery.getInstance();
      const regions: Regions = await regionQuery.all();

      expect(regions.size()).toEqual(2);
      expect(regions.get(0).getRegionID().get()).toEqual(1);
      expect(regions.get(0).getName().get()).toEqual('Afghanistan');
      expect(regions.get(0).getISO3166().get()).toEqual('AFG');
      expect(regions.get(1).getRegionID().get()).toEqual(2);
      expect(regions.get(1).getName().get()).toEqual('Albania');
      expect(regions.get(1).getISO3166().get()).toEqual('ALB');
    });
  });

  describe('findByISO3166', () => {
    it('Redis returns a region', async () => {
      const stub: SinonStub = sinon.stub();
      veauRedis.getString().get = stub;
      stub.resolves('[{"regionID":1,"name":"Afghanistan","iso3166":"AFG"},{"regionID":2,"name":"Albania","iso3166":"ALB"}]');

      const regionQuery: RegionQuery = RegionQuery.getInstance();
      const region: Region = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(region.getRegionID().get()).toEqual(2);
      expect(region.getName().get()).toEqual('Albania');
    });

    it('MySQL returns a region', async () => {
      const stub1: SinonStub = sinon.stub();
      veauRedis.getString().get = stub1;
      // @ts-ignore
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      veauMySQL.execute = stub2;
      stub2.resolves([
        {
          regionID: 1,
          name: 'Afghanistan',
          iso3166: 'AFG'
        },
        {
          regionID: 2,
          name: 'Albania',
          iso3166: 'ALB'
        }
      ]);
      const stub3: SinonStub = sinon.stub();
      RegionCommand.prototype.insertAll = stub3;
      stub3.resolves();

      const regionQuery: RegionQuery = RegionQuery.getInstance();
      const region: Region = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(region.getRegionID().get()).toEqual(2);
      expect(region.getName().get()).toEqual('Albania');
    });

    it('Redis throws error', async () => {
      const stub: SinonStub = sinon.stub();
      veauRedis.getString().get = stub;
      stub.resolves('[]');

      const regionQuery: RegionQuery = RegionQuery.getInstance();

      await expect(regionQuery.findByISO3166(ISO3166.of('ALB'))).rejects.toThrow(NoSuchElementError);
    });

    it('MySQL throws error', async () => {
      const stub1: SinonStub = sinon.stub();
      veauRedis.getString().get = stub1;
      // @ts-ignore
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      veauMySQL.execute = stub2;
      stub2.resolves([
        {
          regionID: 1,
          name: 'Afghanistan',
          iso3166: 'AFG'
        },
        {
          regionID: 2,
          name: 'Albania',
          iso3166: 'ALB'
        }
      ]);
      const stub3: SinonStub = sinon.stub();
      RegionCommand.prototype.insertAll = stub3;
      stub3.resolves();

      const regionQuery: RegionQuery = RegionQuery.getInstance();

      await expect(regionQuery.findByISO3166(ISO3166.of('ABA'))).rejects.toThrow(NoSuchElementError);
    });
  });
});
