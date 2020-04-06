import { INTERNAL_SERVER_ERROR, NO_CONTENT, OK } from 'http-status';
import 'jest';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { Stats } from '../../../veau-entity/Stats';
import { AJAXError } from '../../../veau-general/AJAX/AJAXError';
import { NotFoundError } from '../../../veau-error/NotFoundError';
import { StatsError } from '../../../veau-error/StatsError';
import { StatsOutlinesError } from '../../../veau-error/StatsOutlinesError';
import { AJAX } from '../../../veau-general/AJAX/AJAX';
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
          updatedAt: '2000-01-01 00:00:00',
          items: [
          ]
        }
      });

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();
      const statsQuery: StatsQuery = new StatsQuery();
      const trial: Try<Stats, StatsError | NotFoundError | AJAXError> = await statsQuery.findByStatsID(statsID);

      expect(stub.withArgs('/api/stats/f6fb9662-cbe8-4a91-8aa4-47a92f05b007').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const stats: Stats = trial.get();
      expect(stats.getStatsID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      expect(stats.getLanguage().getLanguageID().get()).toEqual(1);
      expect(stats.getRegion().getRegionID().get()).toEqual(2);
      expect(stats.getTerm().getID()).toEqual(3);
      expect(stats.getItems().size()).toEqual(0);
    });

    it('malformat statsID', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
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
          updatedAt: '2000-01-01 00:00:00',
          items: [
          ]
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();
      const statsQuery: StatsQuery = new StatsQuery();
      const trial: Try<Stats, StatsError | NotFoundError | AJAXError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsError | NotFoundError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns NO_CONTENT', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: NO_CONTENT,
        body: {
        }
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();
      const statsQuery: StatsQuery = new StatsQuery();
      const trial: Try<Stats, StatsError | NotFoundError | AJAXError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsError | NotFoundError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(NotFoundError);
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

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007').get();
      const statsQuery: StatsQuery = new StatsQuery();
      const trial: Try<Stats, StatsError | NotFoundError | AJAXError> = await statsQuery.findByStatsID(statsID);

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsError| NotFoundError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
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
            updatedAt: '2000-01-01 00:00:00'
          }
        ]
      });

      const statsQuery: StatsQuery = new StatsQuery();
      const trial: Try<StatsOutlines, StatsOutlinesError | AJAXError> = await statsQuery.findByPage(Page.of(3).get());

      expect(stub.withArgs('/api/stats/page/3').called).toEqual(true);
      expect(trial.isSuccess()).toEqual(true);
      const outlines: StatsOutlines = trial.get();
      expect(outlines.size()).toEqual(1);
      expect(outlines.get(0).get().getStatsID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      expect(outlines.get(0).get().getLanguage().getLanguageID().get()).toEqual(1);
      expect(outlines.get(0).get().getRegion().getRegionID().get()).toEqual(2);
      expect(outlines.get(0).get().getTerm().getID()).toEqual(3);
    });

    it('malformat statsID', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: [
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
        ]
      });
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsQuery: StatsQuery = new StatsQuery();
      const trial: Try<StatsOutlines, StatsOutlinesError | AJAXError> = await statsQuery.findByPage(Page.of(3).get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(StatsOutlinesError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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

      const statsQuery: StatsQuery = new StatsQuery();
      const trial: Try<StatsOutlines, StatsOutlinesError | AJAXError> = await statsQuery.findByPage(Page.of(3).get());

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: StatsOutlinesError | AJAXError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
