import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { StatsOutlinesError } from '../../../veau-error/StatsOutlinesError';
import { AJAXError } from '../../../veau-general/AJAX/AJAXError';
import { MockAJAX } from '../../../veau-general/AJAX/mocks/MockAJAX';
import { DataSourceError } from '../../../veau-general/DataSourceError';
import { Try } from '../../../veau-general/Try/Try';
import { Page } from '../../../veau-vo/Page';
import { StatsOutlineJSON } from '../../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../../veau-vo/StatsOutlines';
import { VeauAccountID } from '../../../veau-vo/VeauAccountID';
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
      const veauAccountID: VeauAccountID = VeauAccountID.ofString('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get();
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
      const trial: Try<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(veauAccountID, Page.of(3).get());

      expect(stub.withArgs('/api/stats/page/3').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const outlines: StatsOutlines = trial.get();
      expect(outlines.size()).toEqual(1);
      for (let i: number = 0; i < outlines.size(); i++) {
        expect(outlines.get(i).get().getStatsID().get()).toEqual(json[i].statsID);
        expect(outlines.get(i).get().getLanguage().getLanguageID().get()).toEqual(json[i].language.languageID);
        expect(outlines.get(i).get().getLanguage().getName().get()).toEqual(json[i].language.name);
        expect(outlines.get(i).get().getLanguage().getEnglishName().get()).toEqual(json[i].language.englishName);
        expect(outlines.get(i).get().getLanguage().getISO639().get()).toEqual(json[i].language.iso639);
        expect(outlines.get(i).get().getRegion().getRegionID().get()).toEqual(json[i].region.regionID);
        expect(outlines.get(i).get().getRegion().getName().get()).toEqual(json[i].region.name);
        expect(outlines.get(i).get().getRegion().getISO3166().get()).toEqual(json[i].region.iso3166);
        expect(outlines.get(i).get().getTerm().getID()).toEqual(json[i].termID);
        expect(outlines.get(i).get().getName().get()).toEqual(json[i].name);
        expect(outlines.get(i).get().getUnit().get()).toEqual(json[i].unit);
        expect(outlines.get(i).get().getUpdatedAt().toString()).toEqual(json[i].updatedAt);
      }
    });

    it('returns Failure when it has wrong format statsID', async () => {
      const veauAccountID: VeauAccountID = VeauAccountID.ofString('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get();
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
      const trial: Try<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(veauAccountID, Page.of(3).get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlinesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('doesn\'t return OK', async () => {
      const veauAccountID: VeauAccountID = VeauAccountID.ofString('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9').get();

      const ajax: MockAJAX = new MockAJAX();
      const stub: SinonStub = sinon.stub();
      ajax.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: [
        ]
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsOutlineQuery: StatsOutlineQuery = new StatsOutlineQuery(ajax);
      const trial: Try<StatsOutlines, StatsOutlinesError | DataSourceError> = await statsOutlineQuery.findByVeauAccountID(veauAccountID, Page.of(3).get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
