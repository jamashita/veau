/* tslint:disable */
import 'jest';
import { SinonStub } from 'sinon';
import * as sinon from 'sinon';
import { Stats } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import {NoSuchElementError} from '../../veau-general/NoSuchElementError';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { UUID } from '../../veau-vo/UUID';
import { StatsRepository } from '../StatsRepository';

describe('StatsRepository', () => {
  it('findByStatsID', async () => {
    const statsID: string = 'a25a8b7f-c810-4dc0-b94e-e97e74329307';
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.withArgs(`SELECT
      R1.stats_id AS statsID,
      R1.language_id AS languageID,
      R1.term_id AS termID,
      R2.name AS languageName,
      R2.english_name AS languageEnglishName,
      R2.iso639,
      R1.region_id AS regionID,
      R3.name AS regionName,
      R3.iso3166,
      R1.name,
      R1.updated_at AS updatedAt
      FROM stats R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN regions R3
      USING(region_id)
      WHERE R1.stats_id = :statsID;`,
      [
        {
          statsID
        }
      ]
    )
    .returns([
      {
        statsID,
        languageID: 1,
        languageName: 'language1',
        languageEnglishName: 'englishLanguage1',
        iso639: 'lang1',
        regionID: 2,
        regionName: 'region1',
        iso3166: 'regn1',
        termID: 3,
        name: 'name',
        updatedAt: '2000-01-01T00:00:00.000Z'
      }
    ]);
    stub.withArgs(`SELECT
      R1.stats_item_id AS statsItemID,
      R1.name,
      R1.unit,
      R1.seq
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`, [
      {
        statsID
      }
    ]).returns([
      {
        statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        name: 'name1',
        unit: 'unit1',
        seq: 1
      },
      {
        statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
        name: 'name2',
        unit: 'unit2',
        seq: 2
      },
      {
        statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
        name: 'name3',
        unit: 'unit3',
        seq: 3
      }
    ]);
    stub.withArgs(`SELECT
      R1.stats_item_id AS statsItemID,
      R1.as_of AS asOf,
      R1.value
      FROM stats_values R1
      INNER JOIN stats_items R2
      USING(stats_item_id)
      WHERE R2.stats_id = :statsID;`, [
      {
        statsID
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

    const statsRepository: StatsRepository = StatsRepository.getInstance();
    const stats: Stats = await statsRepository.findByStatsID(StatsID.of(UUID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307')));

    expect(stats.getStatsID().get().get()).toEqual('a25a8b7f-c810-4dc0-b94e-e97e74329307');
    expect(stats.getLanguage().getLanguageID().get()).toEqual(1);
    expect(stats.getLanguage().getName()).toEqual('language1');
    expect(stats.getLanguage().getEnglishName()).toEqual('englishLanguage1');
    expect(stats.getLanguage().getISO639().get()).toEqual('lang1');
    expect(stats.getRegion().getRegionID().get()).toEqual(2);
    expect(stats.getRegion().getName()).toEqual('region1');
    expect(stats.getRegion().getISO3166().get()).toEqual('regn1');
    expect(stats.getTerm().get()).toEqual(3);
    expect(stats.getName()).toEqual('name');
    expect(stats.getUpdatedAt().toJSON()).toEqual('2000-01-01T00:00:00.000Z');

    const items: Array<StatsItem> = stats.getStats();
    expect(items.length).toEqual(3);
    expect(items[0].getStatsItemID().get().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
    expect(items[0].getName()).toEqual('name1');
    expect(items[0].getUnit()).toEqual('unit1');
    expect(items[0].getSeq()).toEqual(1);

    let values: Array<StatsValue> = items[0].getValues();
    expect(values.length).toEqual(3);
    expect(values[0].getAsOf().format('YYYY-MM-DD')).toEqual('2000-01-01');
    expect(values[0].getValue()).toEqual(1);
    expect(values[1].getAsOf().format('YYYY-MM-DD')).toEqual('2000-01-02');
    expect(values[1].getValue()).toEqual(2);
    expect(values[2].getAsOf().format('YYYY-MM-DD')).toEqual('2000-01-03');
    expect(values[2].getValue()).toEqual(3);

    expect(items[1].getStatsItemID().get().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
    expect(items[1].getName()).toEqual('name2');
    expect(items[1].getUnit()).toEqual('unit2');
    expect(items[1].getSeq()).toEqual(2);

    values = items[1].getValues();
    expect(values.length).toEqual(2);
    expect(values[0].getAsOf().format('YYYY-MM-DD')).toEqual('2001-01-01');
    expect(values[0].getValue()).toEqual(11);
    expect(values[1].getAsOf().format('YYYY-MM-DD')).toEqual('2001-01-02');
    expect(values[1].getValue()).toEqual(12);

    expect(items[2].getStatsItemID().get().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
    expect(items[2].getName()).toEqual('name3');
    expect(items[2].getUnit()).toEqual('unit3');
    expect(items[2].getSeq()).toEqual(3);

    values = items[2].getValues();
    expect(values.length).toEqual(0);
  });

  it('findByStatsID: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.returns([]);

    const statsRepository: StatsRepository = StatsRepository.getInstance();
    expect(statsRepository.findByStatsID(StatsID.of(UUID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307')))).rejects.toThrow(NoSuchElementError);
  });
});
