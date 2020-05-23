import 'reflect-metadata';

import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { AJAXError, DataSourceError, MockAJAX, Superposition, UUID } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockPage } from '../../../VO/Page/Mock/MockPage';
import { StatsOutlinesError } from '../../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsID } from '../../../VO/StatsOutline/StatsID';
import { StatsOutlineJSON } from '../../../VO/StatsOutline/StatsOutline';
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
      const superposition: Superposition<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page);

      expect(stub.withArgs('/api/stats/page/3').called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const outlines: StatsOutlines = superposition.get();

      expect(outlines.size()).toBe(1);
      for (let i: number = 0; i < outlines.size(); i++) {
        const statsID: StatsID = StatsID.ofString(json[i].statsID).get();

        expect(outlines.get(statsID).get().getStatsID().get().get()).toBe(json[i].statsID);
        expect(outlines.get(statsID).get().getLanguageID().get().get()).toBe(json[i].languageID);
        expect(outlines.get(statsID).get().getRegionID().get().get()).toBe(json[i].regionID);
        expect(outlines.get(statsID).get().getTermID().get().get()).toBe(json[i].termID);
        expect(outlines.get(statsID).get().getName().get()).toBe(json[i].name);
        expect(outlines.get(statsID).get().getUnit().get()).toBe(json[i].unit);
        expect(outlines.get(statsID).get().getUpdatedAt().toString()).toBe(json[i].updatedAt);
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const superposition: Superposition<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsOutlinesError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsOutlinesError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const superposition: Superposition<
        StatsOutlines,
        StatsOutlinesError | DataSourceError
      > = await statsOutlineQuery.findByVeauAccountID(veauAccountID, page);

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsOutlinesError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
