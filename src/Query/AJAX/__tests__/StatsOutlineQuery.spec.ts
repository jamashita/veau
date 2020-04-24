import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { AJAXError, DataSourceError, MockAJAX, Superposition } from 'publikum';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { StatsOutlinesError } from '../../../Error/StatsOutlinesError';
import { MockPage } from '../../../VO/Mock/MockPage';
import { MockVeauAccountID } from '../../../VO/Mock/MockVeauAccountID';
import { StatsOutlineJSON } from '../../../VO/StatsOutline';
import { StatsOutlines } from '../../../VO/StatsOutlines';
import { StatsOutlineQuery } from '../StatsOutlineQuery';

describe('StatsOutlineQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const statsOutlineQuery1: StatsOutlineQuery = vault.get<StatsOutlineQuery>(TYPE.StatsOutlineAJAXQuery);
      const statsOutlineQuery2: StatsOutlineQuery = vault.get<StatsOutlineQuery>(TYPE.StatsOutlineAJAXQuery);

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
          statsID: 'f6fb9662-cbe8-4a91-8aa4-47a92f05b007',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english language',
            iso639: 'aa'
          },
          region: {
            regionID: 2,
            name: 'region',
            iso3166: 'bb'
          },
          termID: 3,
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
      const superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(
        veauAccountID,
        page
      );

      expect(stub.withArgs('/api/stats/page/3').called).toBe(true);
      expect(superposition.isAlive()).toBe(true);
      const outlines: StatsOutlines = superposition.get();
      expect(outlines.size()).toBe(1);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(i).get().getStatsID().get().get()).toBe(json[i].statsID);
        expect(outlines.get(i).get().getLanguage().getLanguageID().get()).toBe(json[i].language.languageID);
        expect(outlines.get(i).get().getLanguage().getName().get()).toBe(json[i].language.name);
        expect(outlines.get(i).get().getLanguage().getEnglishName().get()).toBe(json[i].language.englishName);
        expect(outlines.get(i).get().getLanguage().getISO639().get()).toBe(json[i].language.iso639);
        expect(outlines.get(i).get().getRegion().getRegionID().get()).toBe(json[i].region.regionID);
        expect(outlines.get(i).get().getRegion().getName().get()).toBe(json[i].region.name);
        expect(outlines.get(i).get().getRegion().getISO3166().get()).toBe(json[i].region.iso3166);
        expect(outlines.get(i).get().getTerm().getID()).toBe(json[i].termID);
        expect(outlines.get(i).get().getName().get()).toBe(json[i].name);
        expect(outlines.get(i).get().getUnit().get()).toBe(json[i].unit);
        expect(outlines.get(i).get().getUpdatedAt().toString()).toBe(json[i].updatedAt);
      }
    });

    it('returns Dead when it has wrong format statsID', async () => {
      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const page: MockPage = new MockPage(3);
      const json: Array<StatsOutlineJSON> = [
        {
          statsID: 'malformat uuid',
          language: {
            languageID: 1,
            name: 'language',
            englishName: 'english language',
            iso639: 'aa'
          },
          region: {
            regionID: 2,
            name: 'region',
            iso3166: 'bb'
          },
          termID: 3,
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
      const superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(
        veauAccountID,
        page
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlinesError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('doesn\'t return OK', async () => {
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
      const superposition: Superposition<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(
        veauAccountID,
        page
      );

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
