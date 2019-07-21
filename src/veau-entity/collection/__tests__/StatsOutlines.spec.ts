import 'jest';
import { Term } from '../../../veau-enum/Term';
import { NoSuchElementError } from '../../../veau-error/NoSuchElementError';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsName } from '../../../veau-vo/StatsName';
import { StatsUnit } from '../../../veau-vo/StatsUnit';
import { UpdatedAt } from '../../../veau-vo/UpdatedAt';
import { Language } from '../../Language';
import { Region } from '../../Region';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../../StatsOutline';
import { StatsOutlines } from '../StatsOutlines';

describe('StatsOutlines', () => {
  describe('get', () => {
    it('returns StatsOutline of index-th item', () => {
      const outline1: StatsOutline = StatsOutline.from(StatsID.of('stats id 1'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));
      const outline2: StatsOutline = StatsOutline.from(StatsID.of('stats id 2'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));
      const outline3: StatsOutline = StatsOutline.from(StatsID.of('stats id 3'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));

      const outlines: StatsOutlines = StatsOutlines.from([
        outline1,
        outline2,
        outline3
      ]);

      expect(outlines.length()).toEqual(3);
      expect(outlines.get(0)).toEqual(outline1);
      expect(outlines.get(1)).toEqual(outline2);
      expect(outlines.get(2)).toEqual(outline3);
    });

    it('throws error if the index is out of range', () => {
      const outlines: StatsOutlines = StatsOutlines.from([]);

      expect(() => {
        outlines.get(-1);
      }).toThrow(NoSuchElementError);
      expect(() => {
        outlines.get(0);
      }).toThrow(NoSuchElementError);
    });
  });

  describe('equals', () => {
    it('returns false if the lengths are different', () => {
      const outline1: StatsOutline = StatsOutline.from(StatsID.of('stats id 1'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));
      const outline2: StatsOutline = StatsOutline.from(StatsID.of('stats id 2'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));
      const outline3: StatsOutline = StatsOutline.from(StatsID.of('stats id 3'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));

      const outlines1: StatsOutlines = StatsOutlines.from([outline1, outline2, outline3]);
      const outlines2: StatsOutlines = StatsOutlines.from([outline1, outline2]);

      expect(outlines1.equals(outlines2)).toEqual(false);
    });

    it('returns false if the sequences are different', () => {
      const outline1: StatsOutline = StatsOutline.from(StatsID.of('stats id 1'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));
      const outline2: StatsOutline = StatsOutline.from(StatsID.of('stats id 2'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));

      const outlines1: StatsOutlines = StatsOutlines.from([outline1, outline2]);
      const outlines2: StatsOutlines = StatsOutlines.from([outline2, outline1]);

      expect(outlines1.equals(outlines2)).toEqual(false);
    });

    it('returns true if the length and the sequence are the same', () => {
      const outline1: StatsOutline = StatsOutline.from(StatsID.of('stats id 1'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));
      const outline2: StatsOutline = StatsOutline.from(StatsID.of('stats id 2'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));

      const outlines1: StatsOutlines = StatsOutlines.from([outline1, outline2]);
      const outlines2: StatsOutlines = StatsOutlines.from([outline1, outline2]);

      expect(outlines1.equals(outlines2)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const outline1: StatsOutline = StatsOutline.from(StatsID.of('stats id 1'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));
      const outline2: StatsOutline = StatsOutline.from(StatsID.of('stats id 2'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats name'), StatsUnit.of('stats unit'), UpdatedAt.ofString('2000-01-01'));

      const outlines: StatsOutlines = StatsOutlines.from([outline1, outline2]);

      expect(outlines.toJSON()).toEqual([
        {
          statsID: 'stats id 1',
          language: {
            languageID: 0,
            name: '',
            englishName: '',
            iso639: ''
          },
          region: {
            regionID: 0,
            name: '',
            iso3166: ''
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        },
        {
          statsID: 'stats id 2',
          language: {
            languageID: 0,
            name: '',
            englishName: '',
            iso639: ''
          },
          region: {
            regionID: 0,
            name: '',
            iso3166: ''
          },
          termID: 1,
          name: 'stats name',
          unit: 'stats unit',
          updatedAt: '2000-01-01 00:00:00'
        }
      ]);
    });
  });

  describe('fromJSON', () => {
    const json: Array<StatsOutlineJSON> = [
      {
        statsID: 'stats id 1',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'aa'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'bb'
        },
        termID: 1,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 00:00:00'
      },
      {
        statsID: 'stats id 2',
        language: {
          languageID: 1,
          name: 'language',
          englishName: 'english name',
          iso639: 'aa'
        },
        region: {
          regionID: 1,
          name: 'region',
          iso3166: 'bb'
        },
        termID: 1,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 00:00:00'
      }
    ];

    const outlines: StatsOutlines = StatsOutlines.fromJSON(json);

    for (let i = 0; i < 2; i++) {
      expect(outlines.get(i).getStatsID().get()).toEqual(json[i].statsID);
      expect(outlines.get(i).getLanguage().getLanguageID().get()).toEqual(json[i].language.languageID);
      expect(outlines.get(i).getLanguage().getName().get()).toEqual(json[i].language.name);
      expect(outlines.get(i).getLanguage().getEnglishName().get()).toEqual(json[i].language.englishName);
      expect(outlines.get(i).getLanguage().getISO639().get()).toEqual(json[i].language.iso639);
      expect(outlines.get(i).getRegion().getRegionID().get()).toEqual(json[i].region.regionID);
      expect(outlines.get(i).getRegion().getName().get()).toEqual(json[i].region.name);
      expect(outlines.get(i).getRegion().getISO3166().get()).toEqual(json[i].region.iso3166);
      expect(outlines.get(i).getTerm().getID()).toEqual(json[i].termID);
      expect(outlines.get(i).getName().get()).toEqual(json[i].name);
      expect(outlines.get(i).getUnit().get()).toEqual(json[i].unit);
      expect(outlines.get(i).getUpdatedAt().getString()).toEqual(json[i].updatedAt);
    }
  });

  describe('fromRow', () => {
    const rows: Array<StatsOutlineRow> = [
      {
        statsID: 'stats id 1',
        languageID: 1,
        languageName: 'language',
        languageEnglishName: 'english name',
        iso639: 'aa',
        regionID: 1,
        regionName: 'region',
        iso3166: 'bb',
        termID: 1,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 00:00:00'
      },
      {
        statsID: 'stats id 2',
        languageID: 1,
        languageName: 'language',
        languageEnglishName: 'english name',
        iso639: 'aa',
        regionID: 1,
        regionName: 'region',
        iso3166: 'bb',
        termID: 1,
        name: 'stats name',
        unit: 'stats unit',
        updatedAt: '2000-01-01 00:00:00'
      }
    ];

    const outlines: StatsOutlines = StatsOutlines.fromRow(rows);

    for (let i = 0; i < 2; i++) {
      expect(outlines.get(i).getStatsID().get()).toEqual(rows[i].statsID);
      expect(outlines.get(i).getLanguage().getLanguageID().get()).toEqual(rows[i].languageID);
      expect(outlines.get(i).getLanguage().getName().get()).toEqual(rows[i].languageName);
      expect(outlines.get(i).getLanguage().getEnglishName().get()).toEqual(rows[i].languageEnglishName);
      expect(outlines.get(i).getLanguage().getISO639().get()).toEqual(rows[i].iso639);
      expect(outlines.get(i).getRegion().getRegionID().get()).toEqual(rows[i].regionID);
      expect(outlines.get(i).getRegion().getName().get()).toEqual(rows[i].regionName);
      expect(outlines.get(i).getRegion().getISO3166().get()).toEqual(rows[i].iso3166);
      expect(outlines.get(i).getTerm().getID()).toEqual(rows[i].termID);
      expect(outlines.get(i).getName().get()).toEqual(rows[i].name);
      expect(outlines.get(i).getUnit().get()).toEqual(rows[i].unit);
      expect(outlines.get(i).getUpdatedAt().getString()).toEqual(rows[i].updatedAt);
    }
  });
});