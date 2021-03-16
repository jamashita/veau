import { AJAXError, MockAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockPage } from '../../../VO/Page/Mock/MockPage';
import { StatsOutlineError } from '../../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../../VO/StatsOutline/StatsID';
import { StatsOutline, StatsOutlineJSON } from '../../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../../VO/StatsOutline/StatsOutlines';
import { MockVeauAccountID } from '../../../VO/VeauAccount/Mock/MockVeauAccountID';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsOutlineQuery1: StatsOutlineQuery = vault.get<StatsOutlineQuery>(Type.StatsOutlineAJAXQuery);
      const statsOutlineQuery2: StatsOutlineQuery = vault.get<StatsOutlineQuery>(Type.StatsOutlineAJAXQuery);

      expect(statsOutlineQuery1).toBeInstanceOf(StatsOutlineQuery);
      expect(statsOutlineQuery1).toBe(statsOutlineQuery2);
    });
  });

  describe('findByPage', () => {
    it('normal case', async () => {
      expect.assertions(10);

      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage(3);
      const json: Array<StatsOutlineJSON> = [
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

      const ajax: MockAJAX<'json'> = new MockAJAX<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<StatsOutlines, StatsOutlineError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(
        veauAccountID,
        page
      ).terminate();

      expect(stub.withArgs('/api/stats/page/3').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      expect(outlines.size()).toBe(1);
      for (let i: number = 0; i < outlines.size(); i++) {
        const statsID: StatsID = StatsID.ofString(json[i].statsID);
        const outline: Nullable<StatsOutline> = outlines.get(statsID);

        expect(outline?.getStatsID().get().get()).toBe(json[i].statsID);
        expect(outline?.getLanguageID().get().get()).toBe(json[i].languageID);
        expect(outline?.getRegionID().get().get()).toBe(json[i].regionID);
        expect(outline?.getTermID().get().get()).toBe(json[i].termID);
        expect(outline?.getName().get()).toBe(json[i].name);
        expect(outline?.getUnit().get()).toBe(json[i].unit);
        expect(outline?.getUpdatedAt().toString()).toBe(json[i].updatedAt);
      }
    });

    it('returns Dead when it has wrong format statsID', async () => {
      expect.assertions(2);

      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage(3);
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: 'malformat uuid',
          languageID: UUID.v4().get(),
          regionID: UUID.v4().get(),
          termID: UUID.v4().get(),
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ];

      const ajax: MockAJAX<'json'> = new MockAJAX<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<StatsOutlines,
        StatsOutlineError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsOutlineError);
    });

    it('doesn not return StatusCodes.OK', async () => {
      expect.assertions(2);

      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage(3);

      const ajax: MockAJAX<'json'> = new MockAJAX<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: []
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<StatsOutlines,
        StatsOutlineError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });
  });
});
