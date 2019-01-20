/* tslint:disable */
import 'jest';
import { SinonStub } from 'sinon';
import * as sinon from 'sinon';
import { StatsItem } from '../../veau-entity/StatsItem';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { StatsID } from '../../veau-vo/CaptionID';
import { UUID } from '../../veau-vo/UUID';
import { StatsItemRepository } from '../StatsItemRepository';

describe('StatsItemRepository', () => {
  it('findByCaptionID', async () => {
    const captionID: string = '428a0978-5d01-4da6-96f3-f851cb18e935';
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.withArgs(`SELECT
      R1.stats_id AS statsItemID,
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
        statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        termID: 1,
        name: 'name1',
        unit: 'unit1',
        seq: 1
      },
      {
        statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
        termID: 2,
        name: 'name2',
        unit: 'unit2',
        seq: 2
      },
      {
        statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
        termID: 3,
        name: 'name3',
        unit: 'unit3',
        seq: 3
      }
    ]);
    stub.withArgs(`SELECT
      R1.stats_id AS statsItemID,
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
        statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        asOf: '2000-01-01',
        value: 1
      },
      {
        statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
        asOf: '2001-01-01',
        value: 11
      },
      {
        statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        asOf: '2000-01-02',
        value: 2
      },
      {
        statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
        asOf: '2001-01-02',
        value: 12
      },
      {
        statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        asOf: '2000-01-03',
        value: 3
      }
    ]);

    const statsItemRepository: StatsItemRepository = StatsItemRepository.getInstance();
    const statsItems: Array<StatsItem> = await statsItemRepository.findByCaptionID(StatsID.of(UUID.of(captionID)));

    expect(statsItems.length).toEqual(3);
    expect(statsItems[0].getStatsItemID().get().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
    expect(statsItems[0].getTerm().get()).toEqual(1);
    expect(statsItems[0].getName()).toEqual('name1');
    expect(statsItems[0].getUnit()).toEqual('unit1');
    expect(statsItems[0].getSeq()).toEqual(1);
    expect(statsItems[0].getValues().length).toEqual(3);
    expect(statsItems[0].getValues()[0].getAsOf()).toEqual('2000-01-01');
    expect(statsItems[0].getValues()[0].getValue()).toEqual(1);
    expect(statsItems[0].getValues()[1].getAsOf()).toEqual('2000-01-02');
    expect(statsItems[0].getValues()[1].getValue()).toEqual(2);
    expect(statsItems[0].getValues()[2].getAsOf()).toEqual('2000-01-03');
    expect(statsItems[0].getValues()[2].getValue()).toEqual(3);
    expect(statsItems[1].getStatsItemID().get().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
    expect(statsItems[1].getTerm().get()).toEqual(2);
    expect(statsItems[1].getName()).toEqual('name2');
    expect(statsItems[1].getUnit()).toEqual('unit2');
    expect(statsItems[1].getSeq()).toEqual(2);
    expect(statsItems[1].getValues().length).toEqual(2);
    expect(statsItems[1].getValues()[0].getAsOf()).toEqual('2001-01-01');
    expect(statsItems[1].getValues()[0].getValue()).toEqual(11);
    expect(statsItems[1].getValues()[1].getAsOf()).toEqual('2001-01-02');
    expect(statsItems[1].getValues()[1].getValue()).toEqual(12);
    expect(statsItems[2].getStatsItemID().get().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
    expect(statsItems[2].getTerm().get()).toEqual(3);
    expect(statsItems[2].getName()).toEqual('name3');
    expect(statsItems[2].getUnit()).toEqual('unit3');
    expect(statsItems[2].getSeq()).toEqual(3);
    expect(statsItems[2].getValues().length).toEqual(0);
  });
});
