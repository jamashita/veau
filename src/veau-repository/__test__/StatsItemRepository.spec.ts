/* tslint:disable */
import 'jest';
import { SinonStub } from 'sinon';
import * as sinon from 'sinon';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { CaptionID } from '../../veau-vo/CaptionID';
import { StatsItem } from '../../veau-vo/StatsItem';
import { UUID } from '../../veau-vo/UUID';
import { StatsItemRepository } from '../StatsItemRepository';

describe('StatsItemRepository', () => {
  it('findByCaptionID', async () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.withArgs(
      `SELECT
      R1.stats_id AS statsID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.caption_id = :captionID;`,
      [
        {
          captionID: 'd4703058-a6ff-420b-95b2-4475beba9027'
        }
      ]
    ).returns([
      {
        statsID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
        asOf: '2000-01-01',
        value: 1
      },
      {
        statsID: '5318ad74-f15f-4835-9fd7-890be4cce933',
        asOf: '2001-01-01',
        value: 11
      },
      {
        statsID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
        asOf: '2000-01-02',
        value: 2
      },
      {
        statsID: '5318ad74-f15f-4835-9fd7-890be4cce933',
        asOf: '2001-01-02',
        value: 12
      },
      {
        statsID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
        asOf: '2000-01-03',
        value: 3
      }
    ]);

    const statsItemRepository: StatsItemRepository = StatsItemRepository.getInstance();
    const items: Map<string, Array<StatsItem>> = await statsItemRepository.findByCaptionID(CaptionID.of(UUID.of('d4703058-a6ff-420b-95b2-4475beba9027')));

    const year2001: Array<StatsItem> | undefined = items.get('5318ad74-f15f-4835-9fd7-890be4cce933');

    if (year2001) {
      expect(year2001.length).toEqual(2);
      expect(year2001[0].getAsOf()).toEqual('2001-01-01');
      expect(year2001[0].getValue()).toEqual(11);
      expect(year2001[1].getAsOf()).toEqual('2001-01-02');
      expect(year2001[1].getValue()).toEqual(12);
    }
    else {
      fail();
    }

    const year2000: Array<StatsItem> | undefined = items.get('98d1e9b5-6b18-44de-b615-d8016f49977d');

    if (year2000) {
      expect(year2000.length).toEqual(3);
      expect(year2000[0].getAsOf()).toEqual('2000-01-01');
      expect(year2000[0].getValue()).toEqual(1);
      expect(year2000[1].getAsOf()).toEqual('2000-01-02');
      expect(year2000[1].getValue()).toEqual(2);
      expect(year2000[2].getAsOf()).toEqual('2000-01-03');
      expect(year2000[2].getValue()).toEqual(3);
    }
    else {
      fail();
    }
  });
});
