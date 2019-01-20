/* tslint:disable */
import 'jest';
import { Stats, StatsJSON, StatsRow } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { Locale } from '../../veau-vo/Locale';
import { LocaleID } from '../../veau-vo/LocaleID';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { Term } from '../../veau-vo/Term';
import { UUID } from '../../veau-vo/UUID';
import { StatsFactory } from '../StatsFactory';

describe('StatsFactory', () => {
  it('from', () => {
    const statsID: StatsID = StatsID.of(UUID.of('af272303-df5d-4d34-8604-398920b7d2bb'));
    const language: Language = Language.of(LanguageID.of(1), 'language1', 'language english name 1', ISO639.of('lang1'));
    const locale: Locale = Locale.of(LocaleID.of(1), 'locale1', ISO3166.of('locl1'));
    const name: string = 'name1';
    const updatedAt: Date = new Date(2000, 1, 1);
    const item: StatsItem = new StatsItem(StatsItemID.of(UUID.of('a28eceac-0451-4339-b1c5-0c298b3905f6')), Term.ANNUAL, 'stats1', 'unit1', 1, []);
    const items: Array<StatsItem> = [
      item
    ];

    const statsFactory: StatsFactory = StatsFactory.getInstance();
    const stats: Stats = statsFactory.from(statsID, language, locale, name, updatedAt, items);

    expect(stats.getStatsID()).toEqual(statsID);
    expect(stats.getLanguage()).toEqual(language);
    expect(stats.getLocale()).toEqual(locale);
    expect(stats.getName()).toEqual(name);
    expect(stats.getUpdatedAt()).toEqual(updatedAt);
    expect(stats.getStats()).toEqual(items);
  });

  it('fromJSON', () => {
    const json: StatsJSON = {
      statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
      language: {
        languageID: 1,
        name: 'language1',
        englishName: 'english name 1',
        iso639: 'lang1'
      },
      locale: {
        localeID: 1,
        name: 'locale1',
        iso3166: 'locl1'
      },
      name: 'caption1',
      updatedAt: '2000-01-01T00:00:00.000Z',
      items: [
        {
          statsItemID: '04166d3c-be62-4e13-8231-e718b5b96683',
          termID: 1,
          name: 'stats1',
          unit: 'unit1',
          seq: 1,
          values: [
            {
              asOf: '2001-01-01',
              value: 1
            }
          ]
        },
        {
          statsItemID: '',
          termID: 2,
          name: 'stats2',
          unit: 'unit1',
          seq: 2,
          values: [
            {
              asOf: '2002-01-01',
              value: 10
            },
            {
              asOf: '2002-01-02',
              value: 100
            }
          ]
        }
      ]
    };

    const statsFactory: StatsFactory = StatsFactory.getInstance();
    const stats: Stats = statsFactory.fromJSON(json);

    expect(stats.getStatsID().get().get()).toEqual(json.statsID);
    expect(stats.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
    expect(stats.getLanguage().getName()).toEqual(json.language.name);
    expect(stats.getLanguage().getEnglishName()).toEqual(json.language.englishName);
    expect(stats.getLanguage().getISO639().get()).toEqual(json.language.iso639);
    expect(stats.getLocale().getLocaleID().get()).toEqual(json.locale.localeID);
    expect(stats.getLocale().getName()).toEqual(json.locale.name);
    expect(stats.getLocale().getISO3166().get()).toEqual(json.locale.iso3166);
    expect(stats.getName()).toEqual(json.name);
    expect(stats.getUpdatedAt().getTime()).toEqual(new Date(json.updatedAt).getTime());
    expect(stats.getStats().length).toEqual(json.items.length);
    for (let i = 0; i < stats.getStats().length; i++) {
      expect(stats.getStats()[i].getStatsItemID().get().get()).toEqual(json.items[i].statsItemID);
      expect(stats.getStats()[i].getTerm().get()).toEqual(json.items[i].termID);
      expect(stats.getStats()[i].getName()).toEqual(json.items[i].name);
      expect(stats.getStats()[i].getUnit()).toEqual(json.items[i].unit);
      expect(stats.getStats()[i].getSeq()).toEqual(json.items[i].seq);
      expect(stats.getStats()[i].getValues().length).toEqual(json.items[i].values.length);
      for (let j = 0; j < stats.getStats()[i].getValues().length; j++) {
        expect(stats.getStats()[i].getValues()[j].getAsOf()).toEqual(json.items[i].values[j].asOf);
        expect(stats.getStats()[i].getValues()[j].getValue()).toEqual(json.items[i].values[j].value);
      }
    }
  });

  it('fromRow', () => {
    const row: StatsRow = {
      statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
      languageID: 1,
      languageName: 'language1',
      languageEnglishName: 'englishLanguage1',
      iso639: 'lang1',
      localeID: 2,
      localeName: 'locale1',
      iso3166: 'locl1',
      name: 'name',
      updatedAt: '2000-01-01T00:00:00.000Z'
    };
    const items: Array<StatsItem> = [
      new StatsItem(
        StatsItemID.of(UUID.of('610b532b-5711-461a-b44a-7387e8d08596')),
        Term.DAILY,
        'stats1',
        'unit1',
        1,
        [
          StatsValue.of(
            '2000-01-01',
            1
          ),
          StatsValue.of(
            '2000-01-02',
            2
          )
        ]
      ),
      new StatsItem(
        StatsItemID.of(UUID.of('530e0e07-654f-4764-a3ac-77ce12a2a5e4')),
        Term.WEEKLY,
        'stats2',
        'unit2',
        2,
        [
        ]
      )
    ];

    const statsFactory: StatsFactory = StatsFactory.getInstance();
    const stats: Stats = statsFactory.fromRow(row, items);

    expect(stats.toJSON()).toEqual({
      statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
      language: {
        languageID: 1,
        name: 'language1',
        englishName: 'englishLanguage1',
        iso639: 'lang1'
      },
      locale: {
        localeID: 2,
        name: 'locale1',
        iso3166: 'locl1'
      },
      name: 'name',
      updatedAt: '2000-01-01T00:00:00.000Z',
      items: [
        {
          statsItemID: '610b532b-5711-461a-b44a-7387e8d08596',
          termID: 1,
          name: 'stats1',
          unit: 'unit1',
          seq: 1,
          values: [
            {
              asOf: '2000-01-01',
              value: 1
            },
            {
              asOf: '2000-01-02',
              value: 2
            }
          ]
        },
        {
          statsItemID: '530e0e07-654f-4764-a3ac-77ce12a2a5e4',
          termID: 2,
          name: 'stats2',
          unit: 'unit2',
          seq: 2,
          values: [
          ]
        }
      ]
    });
  });
});
