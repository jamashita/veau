import 'jest';
import * as moment from 'moment';
import { Term } from '../../veau-enum/Term';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { StatsID } from '../../veau-vo/StatsID';
import { UUID } from '../../veau-vo/UUID';
import { Language } from '../Language';
import { Region } from '../Region';
import { StatsOutline } from '../StatsOutline';

describe('StatsOutline', () => {
  describe('equals', () => {
    it('returns true if the ids equals', () => {
      const statsOutline1: StatsOutline = new StatsOutline(
        StatsID.of(UUID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e')),
        new Language(LanguageID.of(1), 'language1', 'LANGUAGE1', ISO639.of('lang1')),
        new Region(RegionID.of(1), 'region1', ISO3166.of('REGION1')),
        Term.DAILY,
        'name1',
        'unit1',
        moment(new Date(2000, 0, 1))
      );
      const statsOutline2: StatsOutline = new StatsOutline(
        StatsID.of(UUID.of('f19bca43-511f-4d8c-bd12-af27bf0cd429')),
        new Language(LanguageID.of(2), 'language2', 'LANGUAGE2', ISO639.of('lang2')),
        new Region(RegionID.of(2), 'region2', ISO3166.of('REGION2')),
        Term.WEEKLY,
        'name2',
        'unit2',
        moment(new Date(2001, 0, 1))
      );
      const statsOutline3: StatsOutline = new StatsOutline(
        StatsID.of(UUID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e')),
        new Language(LanguageID.of(2), 'language2', 'LANGUAGE2', ISO639.of('lang2')),
        new Region(RegionID.of(2), 'region2', ISO3166.of('REGION2')),
        Term.WEEKLY,
        'name2',
        'unit2',
        moment(new Date(2001, 0, 1))
      );

      expect(statsOutline1.equals(statsOutline1)).toEqual(true);
      expect(statsOutline1.equals(statsOutline2)).toEqual(false);
      expect(statsOutline1.equals(statsOutline3)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of(UUID.of('bfb0ebff-fc8c-450e-9265-82fa4938ae94'));
      const statsOutline: StatsOutline = new StatsOutline(
        statsID,
        new Language(LanguageID.of(1), 'language1', 'englishname1', ISO639.of('lang1')),
        new Region(RegionID.of(1), 'region1', ISO3166.of('regn1')),
        Term.DAILY,
        'name1',
        'unit1',
        moment.utc('2000-01-01')
      );

      expect(statsOutline.toJSON()).toEqual({
        statsID: 'bfb0ebff-fc8c-450e-9265-82fa4938ae94',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'englishname1',
          iso639: 'lang1'
        },
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'name1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00'
      });
    });
  });

  describe('isFilled', () => {
    it('returns true is language, region, name and unit are filled', () => {
      const statsOutline1: StatsOutline = new StatsOutline(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.default(), Region.default(), Term.DAILY, '', '', moment('2000-01-01'));
      const statsOutline2: StatsOutline = new StatsOutline(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), Region.default(), Term.DAILY, '', '', moment('2000-01-01'));
      const statsOutline3: StatsOutline = new StatsOutline(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.default(), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', '', moment('2000-01-01'));
      const statsOutline4: StatsOutline = new StatsOutline(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', '', moment('2000-01-01'));
      const statsOutline5: StatsOutline = new StatsOutline(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', '', moment('2000-01-01'));
      const statsOutline6: StatsOutline = new StatsOutline(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', 'unit1', moment('2000-01-01'));
      const statsOutline7: StatsOutline = new StatsOutline(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'));

      expect(statsOutline1.isFilled()).toEqual(false);
      expect(statsOutline2.isFilled()).toEqual(false);
      expect(statsOutline3.isFilled()).toEqual(false);
      expect(statsOutline4.isFilled()).toEqual(false);
      expect(statsOutline5.isFilled()).toEqual(false);
      expect(statsOutline6.isFilled()).toEqual(false);
      expect(statsOutline7.isFilled()).toEqual(true);
    });
  });

  describe('copy', () => {
    it('every properties are copied', () => {
      const statsID: StatsID = StatsID.of(UUID.of('f330c618-6127-46d1-ba10-a9f6af458b4c'));
      const language: Language = new Language(LanguageID.of(1), 'language', 'english language', ISO639.of('ab'));
      const region: Region = new Region(RegionID.of(2), 'region', ISO3166.of('AFG'));
      const term: Term = Term.DAILY;
      const name: string = 'stats';
      const unit: string = 'unit';
      const updatedAt: moment.Moment = moment('2000-01-01');

      const statsOutline: StatsOutline = new StatsOutline(statsID, language, region, term, name, unit, updatedAt);
      const copy: StatsOutline = statsOutline.copy();

      expect(statsOutline).not.toBe(copy);
      expect(statsOutline.getStatsID()).toEqual(statsID);
      expect(statsOutline.getLanguage()).toEqual(language);
      expect(statsOutline.getRegion()).toEqual(region);
      expect(statsOutline.getTerm()).toEqual(term);
      expect(statsOutline.getName()).toEqual(name);
      expect(statsOutline.getUnit()).toEqual(unit);
      expect(statsOutline.getUpdatedAt().isSame(updatedAt)).toEqual(true);
    });
  });
});
