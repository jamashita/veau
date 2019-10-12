import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import 'jest';
import sinon, { SinonStub } from 'sinon';
import { Stats } from '../../../veau-entity/Stats';
import { AJAXError } from '../../../veau-error/AJAXError';
import { NotFoundError } from '../../../veau-error/NotFoundError';
import { AJAX } from '../../../veau-general/AJAX';
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

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const stats: Stats = await statsQuery.findByStatsID(statsID);

      expect(stub.withArgs('/api/stats/f6fb9662-cbe8-4a91-8aa4-47a92f05b007').called).toEqual(true);
      expect(stats.getStatsID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      expect(stats.getLanguage().getLanguageID().get()).toEqual(1);
      expect(stats.getRegion().getRegionID().get()).toEqual(2);
      expect(stats.getTerm().getID()).toEqual(3);
      expect(stats.getItems().size()).toEqual(0);
    });

    it('returns NOT_FOUND', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: NOT_FOUND,
        body: {
        }
      });

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      const statsQuery: StatsQuery = StatsQuery.getInstance();

      await expect(statsQuery.findByStatsID(statsID)).rejects.toThrow(NotFoundError);
    });

    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });

      const statsID: StatsID = StatsID.of('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      const statsQuery: StatsQuery = StatsQuery.getInstance();

      await expect(statsQuery.findByStatsID(statsID)).rejects.toThrow(AJAXError);
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

      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const outlines: StatsOutlines = await statsQuery.findByPage(3);

      expect(stub.withArgs('/api/stats/page/3').called).toEqual(true);
      expect(outlines.size()).toEqual(1);
      expect(outlines.get(0).getStatsID().get()).toEqual('f6fb9662-cbe8-4a91-8aa4-47a92f05b007');
      expect(outlines.get(0).getLanguage().getLanguageID().get()).toEqual(1);
      expect(outlines.get(0).getRegion().getRegionID().get()).toEqual(2);
      expect(outlines.get(0).getTerm().getID()).toEqual(3);
    });

    it('doesn\'t return OK', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: [
        ]
      });

      const statsQuery: StatsQuery = StatsQuery.getInstance();

      await expect(statsQuery.findByPage(3)).rejects.toThrow(AJAXError);
    });
  });
});
