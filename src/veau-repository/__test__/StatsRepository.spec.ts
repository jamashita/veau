import 'jest';
import { SinonStub } from 'sinon';
import * as sinon from 'sinon';
import { Stats } from '../../veau-entity/Stats';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { CaptionID } from '../../veau-vo/CaptionID';
import { UUID } from '../../veau-vo/UUID';
import { StatsRepository } from '../StatsRepository';

describe('StatsRepository', () => {
  it('findByCaptionID', async () => {
    const captionID: string = '428a0978-5d01-4da6-96f3-f851cb18e935';
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.withArgs(`SELECT
      R1.stats_id AS statsID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.seq
      FROM stats R1
      WHERE R1.caption_id = :captionID;`, [
      {
        captionID
      }
    ]).returns([
      {
        statsID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        termID: 1,
        name: 'name1',
        unit: 'unit1',
        seq: 1
      },
      {
        statsID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
        termID: 2,
        name: 'name2',
        unit: 'unit2',
        seq: 2
      },
      {
        statsID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
        termID: 3,
        name: 'name3',
        unit: 'unit3',
        seq: 3
      }
    ]);
    stub.withArgs(`SELECT
      R1.stats_id AS statsID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_items R1
      INNER JOIN stats R2
      USING(stats_id)
      WHERE R2.caption_id = :captionID;`, [
      {
        captionID
      }
    ]).returns([
      {
        statsID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        asOf: '2000-01-01',
        value: 1
      },
      {
        statsID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
        asOf: '2001-01-01',
        value: 11
      },
      {
        statsID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        asOf: '2000-01-02',
        value: 2
      },
      {
        statsID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
        asOf: '2001-01-02',
        value: 12
      },
      {
        statsID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        asOf: '2000-01-03',
        value: 3
      }
    ]);

    const statsRepository: StatsRepository = StatsRepository.getInstance();
    const stats: Array<Stats> = await statsRepository.findByCaptionID(CaptionID.of(UUID.of(captionID)));

    expect(stats.length).toEqual(3);
    expect(stats[0].getStatsID().get().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
    expect(stats[0].getTerm().get()).toEqual(1);
    expect(stats[0].getName()).toEqual('name1');
    expect(stats[0].getUnit()).toEqual('unit1');
    expect(stats[0].getSeq()).toEqual(1);
    expect(stats[0].getItems().length).toEqual(3);
    expect(stats[0].getItems()[0].getAsOf()).toEqual('2000-01-01');
    expect(stats[0].getItems()[0].getValue()).toEqual(1);
    expect(stats[0].getItems()[1].getAsOf()).toEqual('2000-01-02');
    expect(stats[0].getItems()[1].getValue()).toEqual(2);
    expect(stats[0].getItems()[2].getAsOf()).toEqual('2000-01-03');
    expect(stats[0].getItems()[2].getValue()).toEqual(3);
    expect(stats[1].getStatsID().get().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
    expect(stats[1].getTerm().get()).toEqual(2);
    expect(stats[1].getName()).toEqual('name2');
    expect(stats[1].getUnit()).toEqual('unit2');
    expect(stats[1].getSeq()).toEqual(2);
    expect(stats[1].getItems().length).toEqual(2);
    expect(stats[1].getItems()[0].getAsOf()).toEqual('2001-01-01');
    expect(stats[1].getItems()[0].getValue()).toEqual(11);
    expect(stats[1].getItems()[1].getAsOf()).toEqual('2001-01-02');
    expect(stats[1].getItems()[1].getValue()).toEqual(12);
    expect(stats[2].getStatsID().get().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
    expect(stats[2].getTerm().get()).toEqual(3);
    expect(stats[2].getName()).toEqual('name3');
    expect(stats[2].getUnit()).toEqual('unit3');
    expect(stats[2].getSeq()).toEqual(3);
    expect(stats[2].getItems().length).toEqual(0);
  });
});
