import { Nullable } from '@jamashita/anden-type';
import { UUID } from '@jamashita/anden-uuid';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError, MockFetch } from '@jamashita/catacombe-fetch';
import { Schrodinger } from '@jamashita/genitore';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../../container/Types';
import { vault } from '../../../../container/Vault';
import { MockPage } from '../../../../domain/vo/Page/Mock/MockPage';
import { StatsOutlineError } from '../../../../domain/vo/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../../../domain/vo/StatsOutline/StatsID';
import { StatsOutline, StatsOutlineJSON } from '../../../../domain/vo/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../../../domain/vo/StatsOutline/StatsOutlines';
import { MockVeauAccountID } from '../../../../domain/vo/VeauAccount/Mock/MockVeauAccountID';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsOutlineQuery1: StatsOutlineQuery = vault.get<StatsOutlineQuery>(Type.StatsOutlineFetchQuery);
      const statsOutlineQuery2: StatsOutlineQuery = vault.get<StatsOutlineQuery>(Type.StatsOutlineFetchQuery);

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

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<StatsOutlines, DataSourceError | StatsOutlineError> = await statsOutlineQuery.findByVeauAccountID(
        veauAccountID,
        page
      ).terminate();

      expect(stub.withArgs('/api/stats/page/3').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      expect(outlines.size()).toBe(1);
      for (let i: number = 0; i < outlines.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const statsID: StatsID = StatsID.ofString(json[i]!.statsID);
        const outline: Nullable<StatsOutline> = outlines.get(statsID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(outline?.getStatsID().get().get()).toBe(json[i]!.statsID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(outline?.getLanguageID().get().get()).toBe(json[i]!.languageID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(outline?.getRegionID().get().get()).toBe(json[i]!.regionID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(outline?.getTermID().get().get()).toBe(json[i]!.termID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(outline?.getName().get()).toBe(json[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(outline?.getUnit().get()).toBe(json[i]!.unit);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(outline?.getUpdatedAt().toString()).toBe(json[i]!.updatedAt);
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

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.OK,
        body: json
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<StatsOutlines,
        DataSourceError | StatsOutlineError> = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsOutlineError);
    });

    it('doesn not return StatusCodes.OK', async () => {
      expect.assertions(2);

      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage(3);

      const ajax: MockFetch<'json'> = new MockFetch<'json'>();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: []
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<StatsOutlines,
        DataSourceError | StatsOutlineError> = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });
  });
});
