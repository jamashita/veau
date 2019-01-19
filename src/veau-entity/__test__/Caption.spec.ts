import 'jest';
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
import { Caption } from '../Caption';
import { Stats } from '../Stats';

describe('Caption', () => {
  it('equals', () => {
    const captionID1: CaptionID = CaptionID.of(UUID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'));
    const captionID2: CaptionID = CaptionID.of(UUID.of('f19bca43-511f-4d8c-bd12-af27bf0cd429'));
    const caption1: Caption = new Caption(
      captionID1,
      Language.of(LanguageID.of(1), 'language1', 'LANGUAGE1', ISO639.of('lang1')),
      Locale.of(LocaleID.of(1), 'locale1', ISO3166.of('LOCALE1')),
      'name1',
      new Date(2000, 1, 1),
      []
    );
    const caption2: Caption = new Caption(
      captionID2,
      Language.of(LanguageID.of(2), 'language2', 'LANGUAGE2', ISO639.of('lang2')),
      Locale.of(LocaleID.of(2), 'locale2', ISO3166.of('LOCALE2')),
      'name2',
      new Date(2001, 1, 1),
      [
        new Stats(
          StatsID.of(UUID.of('30dd05bd-480f-4050-b8d4-5eec32ae11ed')),
          Term.DAILY,
          'stats1',
          'unit1',
          1,
          []
        )
      ]
    );
    const caption3: Caption = new Caption(
      captionID1,
      Language.of(LanguageID.of(2), 'language2', 'LANGUAGE2', ISO639.of('lang2')),
      Locale.of(LocaleID.of(2), 'locale2', ISO3166.of('LOCALE2')),
      'name2',
      new Date(2001, 1, 1),
      [
        new Stats(
          StatsID.of(UUID.of('30dd05bd-480f-4050-b8d4-5eec32ae11ed')),
          Term.DAILY,
          'stats1',
          'unit1',
          1,
          []
        )
      ]
    );

    expect(caption1.equals(caption1)).toEqual(true);
    expect(caption1.equals(caption2)).toEqual(false);
    expect(caption1.equals(caption3)).toEqual(true);
  });

  it('toJSON', () => {
    const captionID: CaptionID = CaptionID.of(UUID.of('bfb0ebff-fc8c-450e-9265-82fa4938ae94'));
    const statsID: StatsID = StatsID.of(UUID.of('2e787bad-6727-47d0-af9a-9c8189342a50'));
    const stats: Stats = new Stats(statsID, Term.DAILY, 'stats1', 'unit1', 1, [StatsItem.of('2000-01-01', 10)]);
    const caption: Caption = new Caption(
      captionID,
      Language.of(LanguageID.of(1), 'language1', 'englishname1', ISO639.of('lang1')),
      Locale.of(LocaleID.of(1), 'locale1', ISO3166.of('locl1')),
      'name1',
      new Date(2000, 1, 1),
      [
        stats
      ]
    );

    expect(caption.toJSON()).toEqual({
      captionID: 'bfb0ebff-fc8c-450e-9265-82fa4938ae94',
      language: {
        languageID: 1,
        name: 'language1',
        englishName: 'englishname1',
        iso639: 'lang1'
      },
      locale: {
        localeID: 1,
        name: 'locale1',
        iso3166: 'locl1'
      },
      name: 'name1',
      updatedAt: new Date(2000, 1,  1).toJSON(),
      stats: [
        {
          statsID: '2e787bad-6727-47d0-af9a-9c8189342a50',
          termID: 1,
          name: 'stats1',
          unit: 'unit1',
          seq: 1,
          items: [
            {
              asOf: '2000-01-01',
              value: 10
            }
          ]
        }
      ]
    });
  });
});
