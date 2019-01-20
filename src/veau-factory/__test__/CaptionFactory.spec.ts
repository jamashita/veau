/* tslint:disable */
import 'jest';
import { Caption, CaptionJSON, CaptionRow } from '../../veau-entity/Caption';
import { Stats } from '../../veau-entity/Stats';
import { CaptionID } from '../../veau-vo/CaptionID';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { Locale } from '../../veau-vo/Locale';
import { LocaleID } from '../../veau-vo/LocaleID';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItem } from '../../veau-vo/StatsItem';
import { Term } from '../../veau-vo/Term';
import { UUID } from '../../veau-vo/UUID';
import { CaptionFactory } from '../CaptionFactory';

describe('CaptionFactory', () => {
  it('from', () => {
    const captionID: CaptionID = CaptionID.of(UUID.of('af272303-df5d-4d34-8604-398920b7d2bb'));
    const language: Language = Language.of(LanguageID.of(1), 'language1', 'language english name 1', ISO639.of('lang1'));
    const locale: Locale = Locale.of(LocaleID.of(1), 'locale1', ISO3166.of('locl1'));
    const name: string = 'name1';
    const updatedAt: Date = new Date(2000, 1, 1);
    const piece: Stats = new Stats(StatsID.of(UUID.of('a28eceac-0451-4339-b1c5-0c298b3905f6')), Term.ANNUAL, 'stats1', 'unit1', 1, []);
    const stats: Array<Stats> = [
      piece
    ];

    const captionFactory: CaptionFactory = CaptionFactory.getInstance();
    const caption: Caption = captionFactory.from(captionID, language, locale, name, updatedAt, stats);

    expect(caption.getCaptionID()).toEqual(captionID);
    expect(caption.getLanguage()).toEqual(language);
    expect(caption.getLocale()).toEqual(locale);
    expect(caption.getName()).toEqual(name);
    expect(caption.getUpdatedAt()).toEqual(updatedAt);
    expect(caption.getStats()).toEqual(stats);
  });

  it('fromJSON', () => {
    const json: CaptionJSON = {
      captionID: '5be730f5-ec94-4685-bc84-9ae969c49406',
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
      stats: [
        {
          statsID: '04166d3c-be62-4e13-8231-e718b5b96683',
          termID: 1,
          name: 'stats1',
          unit: 'unit1',
          seq: 1,
          items: [
            {
              asOf: '2001-01-01',
              value: 1
            }
          ]
        },
        {
          statsID: '',
          termID: 2,
          name: 'stats2',
          unit: 'unit1',
          seq: 2,
          items: [
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

    const captionFactory: CaptionFactory = CaptionFactory.getInstance();
    const caption: Caption = captionFactory.fromJSON(json);

    expect(caption.getCaptionID().get().get()).toEqual(json.captionID);
    expect(caption.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
    expect(caption.getLanguage().getName()).toEqual(json.language.name);
    expect(caption.getLanguage().getEnglishName()).toEqual(json.language.englishName);
    expect(caption.getLanguage().getISO639().get()).toEqual(json.language.iso639);
    expect(caption.getLocale().getLocaleID().get()).toEqual(json.locale.localeID);
    expect(caption.getLocale().getName()).toEqual(json.locale.name);
    expect(caption.getLocale().getISO3166().get()).toEqual(json.locale.iso3166);
    expect(caption.getName()).toEqual(json.name);
    expect(caption.getUpdatedAt().getTime()).toEqual(new Date(json.updatedAt).getTime());
    expect(caption.getStats().length).toEqual(json.stats.length);
    for (let i = 0; i < caption.getStats().length; i++) {
      expect(caption.getStats()[i].getStatsID().get().get()).toEqual(json.stats[i].statsID);
      expect(caption.getStats()[i].getTerm().get()).toEqual(json.stats[i].termID);
      expect(caption.getStats()[i].getName()).toEqual(json.stats[i].name);
      expect(caption.getStats()[i].getUnit()).toEqual(json.stats[i].unit);
      expect(caption.getStats()[i].getSeq()).toEqual(json.stats[i].seq);
      expect(caption.getStats()[i].getItems().length).toEqual(json.stats[i].items.length);
      for (let j = 0; j < caption.getStats()[i].getItems().length; j++) {
        expect(caption.getStats()[i].getItems()[j].getAsOf()).toEqual(json.stats[i].items[j].asOf);
        expect(caption.getStats()[i].getItems()[j].getValue()).toEqual(json.stats[i].items[j].value);
      }
    }
  });

  it('fromRow', () => {
    const row: CaptionRow = {
      captionID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
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
    const stats: Array<Stats> = [
      new Stats(
        StatsID.of(UUID.of('610b532b-5711-461a-b44a-7387e8d08596')),
        Term.DAILY,
        'stats1',
        'unit1',
        1,
        [
          StatsItem.of(
            '2000-01-01',
            1
          ),
          StatsItem.of(
            '2000-01-02',
            2
          )
        ]
      ),
      new Stats(
        StatsID.of(UUID.of('530e0e07-654f-4764-a3ac-77ce12a2a5e4')),
        Term.WEEKLY,
        'stats2',
        'unit2',
        2,
        [
        ]
      )
    ];

    const captionFactory: CaptionFactory = CaptionFactory.getInstance();
    const caption: Caption = captionFactory.fromRow(row, stats);

    expect(caption.toJSON()).toEqual({
      captionID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
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
      stats: [
        {
          statsID: '610b532b-5711-461a-b44a-7387e8d08596',
          termID: 1,
          name: 'stats1',
          unit: 'unit1',
          seq: 1,
          items: [
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
          statsID: '530e0e07-654f-4764-a3ac-77ce12a2a5e4',
          termID: 2,
          name: 'stats2',
          unit: 'unit2',
          seq: 2,
          items: [
          ]
        }
      ]
    });
  });
});
