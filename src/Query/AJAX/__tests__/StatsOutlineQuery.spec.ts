import 'reflect-metadata';

import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import sinon, { SinonStub } from 'sinon';

import { AJAXError, MockAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockPage } from '../../../VO/Page/Mock/MockPage';
import { StatsOutlineError } from '../../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutlinesError } from '../../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsID } from '../../../VO/StatsOutline/StatsID';
import { StatsOutline, StatsOutlineJSON } from '../../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../../VO/StatsOutline/StatsOutlines';
import { MockVeauAccountID } from '../../../VO/VeauAccount/Mock/MockVeauAccountID';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsOutlineQuery1: StatsOutlineQuery = vault.get<StatsOutlineQuery>(Type.StatsOutlineAJAXQuery);
      const statsOutlineQuery2: StatsOutlineQuery = vault.get<StatsOutlineQuery>(Type.StatsOutlineAJAXQuery);

      expect(statsOutlineQuery1).toBeInstanceOf(StatsOutlineQuery);
      expect(statsOutlineQuery1).toBe(statsOutlineQuery2);
    });
  });

  describe('findByPage', () => {
    it('normal case', async () => {
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

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page).terminate();

      expect(stub.withArgs('/api/stats/page/3').called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const outlines: StatsOutlines = schrodinger.get();

      expect(outlines.size()).toBe(1);
      for (let i: number = 0; i < outlines.size(); i++) {
        // eslint-disable-next-line no-await-in-loop
        const statsID: StatsID = await StatsID.ofString(json[i].statsID).get();
        const outline: Nullable<StatsOutline> = outlines.get(statsID);

        if (outline === null) {
          // eslint-disable-next-line jest/no-jasmine-globals
          fail();

          return;
        }

        expect(outline.getStatsID().get().get()).toBe(json[i].statsID);
        expect(outline.getLanguageID().get().get()).toBe(json[i].languageID);
        expect(outline.getRegionID().get().get()).toBe(json[i].regionID);
        expect(outline.getTermID().get().get()).toBe(json[i].termID);
        expect(outline.getName().get()).toBe(json[i].name);
        expect(outline.getUnit().get()).toBe(json[i].unit);
        expect(outline.getUpdatedAt().toString()).toBe(json[i].updatedAt);
      }
    });

    it('returns Dead when it has wrong format statsID', async () => {
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

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: OK,
        body: json
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsOutlineError);
    });

    it('doesn not return OK', async () => {
      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage(3);

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();

      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: []
      });

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const schrodinger: Schrodinger<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });
  });
});
