import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import 'jest';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { Stats } from '../../../veau-entity/Stats';
import { AJAXError } from '../../../veau-error/AJAXError';
import { NotFoundError } from '../../../veau-error/NotFoundError';
import { AJAX } from '../../../veau-general/AJAX';
import { Try } from '../../../veau-general/Try/Try';
import { Page } from '../../../veau-vo/Page';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsOutlines } from '../../../veau-vo/StatsOutlines';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('findByStatsID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
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
          updatedAt: '2000-01-01',
          items: [
          ]
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const trial: Try<Stats, NotFoundError | AJAXError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isSuccess()).toEqual(true);
      expect(stub.withArgs('/api/stats/f6fb9662-cbe8-4a91-8aa4-47a92f05b007').called).toEqual(true);
      trial.match<void>((stats: Stats) => {
        expect(stats.getStatsID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
        expect(stats.getLanguage().getLanguageID().get()).toEqual(1);
        expect(stats.getRegion().getRegionID().get()).toEqual(2);
        expect(stats.getTerm().getID()).toEqual(3);
        expect(stats.getItems().size()).toEqual(0);
        spy1();
      }, () => {
        spy2();
      });

      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
    });

    it('returns NOT_FOUND', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: NOT_FOUND,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const trial: Try<Stats, NotFoundError | AJAXError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: NotFoundError | AJAXError) => {
        spy2();
        expect(e).toBeInstanceOf(NotFoundError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const trial: Try<Stats, NotFoundError | AJAXError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: NotFoundError | AJAXError) => {
        spy2();
        expect(e).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByPage', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: [
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
            updatedAt: '2000-01-01'
          }
        ]
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const trial: Try<StatsOutlines, AJAXError> = await statsQuery.findByPage(Page.of(3));

      expect(trial.isSuccess()).toEqual(true);
      expect(stub.withArgs('/api/stats/page/3').called).toEqual(true);
      trial.match<void>((outlines: StatsOutlines) => {
        expect(outlines.size()).toEqual(1);
        expect(outlines.get(0).getStatsID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
        expect(outlines.get(0).getLanguage().getLanguageID().get()).toEqual(1);
        expect(outlines.get(0).getRegion().getRegionID().get()).toEqual(2);
        expect(outlines.get(0).getTerm().getID()).toEqual(3);
        spy1();
      }, () => {
        spy2();
      });

      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
    });

    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: [
        ]
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const trial: Try<StatsOutlines, AJAXError> = await statsQuery.findByPage(Page.of(3));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (e: AJAXError) => {
        spy2();
        expect(e).toBeInstanceOf(AJAXError);
      });
    });
  });
});
