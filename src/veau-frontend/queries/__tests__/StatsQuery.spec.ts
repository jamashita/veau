import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StatsOutlines } from '../../../veau-entity/collection/StatsOutlines';
import { Stats } from '../../../veau-entity/Stats';
import { AJAXError } from '../../../veau-error/AJAXError';
import { NotFoundError } from '../../../veau-error/NotFoundError';
import { AJAX } from '../../../veau-general/AJAX';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
  describe('findByStatsID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: OK,
        body: {
          statsID: 'abcde',
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

      const statsID: StatsID = StatsID.of('abcde');
      const statsQuery: StatsQuery = StatsQuery.getInstance();
      const stats: Stats = await statsQuery.findByStatsID(statsID);

      expect(stub.withArgs('/api/stats/abcde').called).toEqual(true);
      expect(stats.getStatsID().get()).toEqual('abcde');
      expect(stats.getLanguage().getLanguageID().get()).toEqual(1);
      expect(stats.getRegion().getRegionID().get()).toEqual(2);
      expect(stats.getTerm().getID()).toEqual(3);
      expect(stats.getItems().length()).toEqual(0);
    });

    it('returns NOT_FOUND', () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: NOT_FOUND,
        body: {
        }
      });

      const statsID: StatsID = StatsID.of('abcde');
      const statsQuery: StatsQuery = StatsQuery.getInstance();

      expect(statsQuery.findByStatsID(statsID)).rejects.toThrow(NotFoundError);
    });

    it('doesn\'t return OK', () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: {
        }
      });

      const statsID: StatsID = StatsID.of('abcde');
      const statsQuery: StatsQuery = StatsQuery.getInstance();

      expect(statsQuery.findByStatsID(statsID)).rejects.toThrow(AJAXError);
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
            statsID: 'abcde',
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
      expect(outlines.length()).toEqual(1);
      expect(outlines.get(0).getStatsID().get()).toEqual('abcde');
      expect(outlines.get(0).getLanguage().getLanguageID().get()).toEqual(1);
      expect(outlines.get(0).getRegion().getRegionID().get()).toEqual(2);
      expect(outlines.get(0).getTerm().getID()).toEqual(3);
    });

    it('doesn\'t return OK', () => {
      const stub: SinonStub = sinon.stub();
      AJAX.get = stub;
      stub.resolves({
        status: INTERNAL_SERVER_ERROR,
        body: [
        ]
      });

      const statsQuery: StatsQuery = StatsQuery.getInstance();

      expect(statsQuery.findByPage(3)).rejects.toThrow(AJAXError);
    });
  });
});
