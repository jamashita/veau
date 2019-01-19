import 'jest';
import {SinonStub} from 'sinon';
import * as sinon from 'sinon';
import {Caption} from '../../veau-entity/Caption';
import {Stats} from '../../veau-entity/Stats';
import {VeauDB} from '../../veau-infrastructure/VeauDB';
import {CaptionID} from '../../veau-vo/CaptionID';
import {StatsItem} from '../../veau-vo/StatsItem';
import {UUID} from '../../veau-vo/UUID';
import {CaptionRepository} from '../CaptionRepository';

describe('CaptionRepository', () => {
  it('findByCaptionID', async () => {
    const captionID: string = 'a25a8b7f-c810-4dc0-b94e-e97e74329307';
    const stub: SinonStub = sinon.stub();
    VeauDB.query = stub;
    stub.withArgs(`SELECT
      R1.caption_id AS captionID,
      R1.language_id AS languageID,
      R2.name AS languageName,
      R2.english_name AS languageEnglishName,
      R2.iso639,
      R1.locale_id AS localeID,
      R3.name AS localeName,
      R3.iso3166,
      R1.name,
      R1.updated_at AS updatedAt
      FROM captions R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN locales R3
      USING(locale_id)
      WHERE R1.caption_id = :captionID;`,
    [
      {
        captionID
      }
    ])
    .returns([
      {
        captionID,
        languageID: 1,
        languageName: 'language1',
        languageEnglishName: 'englishLanguage1',
        iso639: 'lang1',
        localeID: 2,
        localeName: 'locale1',
        iso3166: 'locl1',
        name: 'name',
        updatedAt: '2000-01-01T00:00:00.000Z'
      }
    ]);
    stub.withArgs(`SELECT
      R1.stats_id AS statsID,
      R1.term_id AS termID,
      R1.name,
      R1.unit,
      R1.seq
      FROM stats R1
      WHERE R1.caption_id = :captionID;`,[
      {
        captionID
      }
    ]).returns([
      {
        statsID: 'c0e18d31-d026-4a84-af4f-d5d26c520600',
        termID: 1,
        name: 'name1',
        unit: 'unit1',
        seq: 1,
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

    const captionRepository: CaptionRepository = CaptionRepository.getInstance();
    const caption: Caption = await captionRepository.findByCaptionID(CaptionID.of(UUID.of('a25a8b7f-c810-4dc0-b94e-e97e74329307')));

    expect(caption.getCaptionID().get().get()).toEqual('a25a8b7f-c810-4dc0-b94e-e97e74329307');
    expect(caption.getLanguage().getLanguageID().get()).toEqual(1);
    expect(caption.getLanguage().getName()).toEqual('language1');
    expect(caption.getLanguage().getEnglishName()).toEqual('englishLanguage1');
    expect(caption.getLanguage().getISO639().get()).toEqual('lang1');
    expect(caption.getLocale().getLocaleID().get()).toEqual(2);
    expect(caption.getLocale().getName()).toEqual('locale1');
    expect(caption.getLocale().getISO3166().get()).toEqual('locl1');
    expect(caption.getName()).toEqual('name');
    expect(caption.getUpdatedAt().toJSON()).toEqual('2000-01-01T00:00:00.000Z');

    const stats: Array<Stats> = caption.getStats();
    expect(stats.length).toEqual(3);
    expect(stats[0].getStatsID().get().get()).toEqual('c0e18d31-d026-4a84-af4f-d5d26c520600');
    expect(stats[0].getTerm().get()).toEqual(1);
    expect(stats[0].getName()).toEqual('name1');
    expect(stats[0].getUnit()).toEqual('unit1');
    expect(stats[0].getSeq()).toEqual(1);

    let items: Array<StatsItem> = stats[0].getItems();
    expect(items.length).toEqual(3);
    expect(items[0].getAsOf()).toEqual('2000-01-01');
    expect(items[0].getValue()).toEqual(1);
    expect(items[1].getAsOf()).toEqual('2000-01-02');
    expect(items[1].getValue()).toEqual(2);
    expect(items[2].getAsOf()).toEqual('2000-01-03');
    expect(items[2].getValue()).toEqual(3);

    expect(stats[1].getStatsID().get().get()).toEqual('5fb3c1aa-d23e-4eaa-9f67-01b8d3f24d0c');
    expect(stats[1].getTerm().get()).toEqual(2);
    expect(stats[1].getName()).toEqual('name2');
    expect(stats[1].getUnit()).toEqual('unit2');
    expect(stats[1].getSeq()).toEqual(2);

    items = stats[1].getItems();
    expect(items.length).toEqual(2);
    expect(items[0].getAsOf()).toEqual('2001-01-01');
    expect(items[0].getValue()).toEqual(11);
    expect(items[1].getAsOf()).toEqual('2001-01-02');
    expect(items[1].getValue()).toEqual(12);

    expect(stats[2].getStatsID().get().get()).toEqual('2ac64841-5267-48bc-8952-ba9ad1cb12d7');
    expect(stats[2].getTerm().get()).toEqual(3);
    expect(stats[2].getName()).toEqual('name3');
    expect(stats[2].getUnit()).toEqual('unit3');
    expect(stats[2].getSeq()).toEqual(3);

    items = stats[2].getItems();
    expect(items.length).toEqual(0);
  });
});
