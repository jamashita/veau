/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { StatsItems } from '../../veau-collection/StatsItems';
import { StatsValues } from '../../veau-collection/StatsValues';
import { Stats } from '../../veau-entity/Stats';
import { NoSuchElementError } from '../../veau-general/Error/NoSuchElementError';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { StatsID } from '../../veau-vo/StatsID';
import { UUID } from '../../veau-vo/UUID';
import { StatsQuery } from '../StatsQuery';

describe('StatsQuery', () => {
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
      R1.unit,
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
      .resolves([
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
          unit: 'unit',
          updatedAt: '2000-01-01T00:00:00.000Z'
        }
      ]);
    stub.withArgs(`SELECT
      R1.stats_item_id AS statsItemID,
      R1.name
      FROM stats_items R1
      WHERE R1.stats_id = :statsID
      ORDER BY R1.seq;`, [
      {
        statsID
      }
    ]).resolves([
      {
        statsItemID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        name: 'name1'
      },
      {
        statsItemID: '5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c',
        name: 'name2'
      },
      {
        statsItemID: '2ac64841-5267-48bc-8952-ba9ad1cb12d7',
        name: 'name3'
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
    ]).resolves([
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

    const statsQuery: StatsQuery = StatsQuery.getInstance();
    const stats: Stats = await statsQuery.findByStatsID(StatsID.of(UUID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307')));

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
    expect(stats.getUnit()).toEqual('unit');
    expect(stats.getUpdatedAt().toJSON()).toEqual('2000-01-01T00:00:00.000Z');

    const items: StatsItems = stats.getItems();
    expect(items.length()).toEqual(3);
    expect(items.get(0).getStatsItemID().get().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
    expect(items.get(0).getName()).toEqual('name1');

    let values: StatsValues = items.get(0).getValues();
    expect(values.length()).toEqual(3);
    expect(values.get(0).getAsOfAsString()).toEqual('2000-01-01');
    expect(values.get(0).getValue()).toEqual(1);
    expect(values.get(1).getAsOfAsString()).toEqual('2000-01-02');
    expect(values.get(1).getValue()).toEqual(2);
    expect(values.get(2).getAsOfAsString()).toEqual('2000-01-03');
    expect(values.get(2).getValue()).toEqual(3);

    expect(items.get(1).getStatsItemID().get().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
    expect(items.get(1).getName()).toEqual('name2');

    values = items.get(1).getValues();
    expect(values.length()).toEqual(2);
    expect(values.get(0).getAsOfAsString()).toEqual('2001-01-01');
    expect(values.get(0).getValue()).toEqual(11);
    expect(values.get(1).getAsOfAsString()).toEqual('2001-01-02');
    expect(values.get(1).getValue()).toEqual(12);

    expect(items.get(2).getStatsItemID().get().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
    expect(items.get(2).getName()).toEqual('name3');

    values = items.get(2).getValues();
    expect(values.length()).toEqual(0);
  });

  it('findByStatsID: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauMySQL.query = stub;
    stub.resolves([]);

    const statsQuery: StatsQuery = StatsQuery.getInstance();
    expect(statsQuery.findByStatsID(StatsID.of(UUID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307')))).rejects.toThrow(NoSuchElementError);
  });
});
