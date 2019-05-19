/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsItems } from '../../veau-collection/StatsItems';
import { StatsValues } from '../../veau-collection/StatsValues';
import { Term } from '../../veau-enum/Term';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { UUID } from '../../veau-vo/UUID';
import { Language } from '../Language';
import { Region } from '../Region';
import { Stats } from '../Stats';
import { StatsItem } from '../StatsItem';

describe('Stats', () => {
  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const statsID1: StatsID = StatsID.of(UUID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'));
      const statsID2: StatsID = StatsID.of(UUID.of('f19bca43-511f-4d8c-bd12-af27bf0cd429'));
      const stats1: Stats = new Stats(
        statsID1,
        new Language(LanguageID.of(1), 'language1', 'LANGUAGE1', ISO639.of('lang1')),
        new Region(RegionID.of(1), 'region1', ISO3166.of('REGION1')),
        Term.DAILY,
        'name1',
        'unit1',
        moment(new Date(2000, 0, 1)),
        new StatsItems([])
      );
      const stats2: Stats = new Stats(
        statsID2,
        new Language(LanguageID.of(2), 'language2', 'LANGUAGE2', ISO639.of('lang2')),
        new Region(RegionID.of(2), 'region2', ISO3166.of('REGION2')),
        Term.WEEKLY,
        'name2',
        'unit2',
        moment(new Date(2001, 0, 1)),
        new StatsItems([
          new StatsItem(
            StatsItemID.of(UUID.of('30dd05bd-480f-4050-b8d4-5eec32ae11ed')),
            'stats1',
            new StatsValues([])
          )
        ])
      );
      const stats3: Stats = new Stats(
        statsID1,
        new Language(LanguageID.of(2), 'language2', 'LANGUAGE2', ISO639.of('lang2')),
        new Region(RegionID.of(2), 'region2', ISO3166.of('REGION2')),
        Term.WEEKLY,
        'name2',
        'unit2',
        moment(new Date(2001, 0, 1)),
        new StatsItems([
          new StatsItem(
            StatsItemID.of(UUID.of('30dd05bd-480f-4050-b8d4-5eec32ae11ed')),
            'stats1',
            new StatsValues([])
          )
        ])
      );

      expect(stats1.equals(stats1)).toEqual(true);
      expect(stats1.equals(stats2)).toEqual(false);
      expect(stats1.equals(stats3)).toEqual(true);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of(UUID.of('bfb0ebff-fc8c-450e-9265-82fa4938ae94'));
      const statsItemID: StatsItemID = StatsItemID.of(UUID.of('2e787bad-6727-47d0-af9a-9c8189342a50'));
      const statsItem: StatsItem = new StatsItem(statsItemID,'stats1', new StatsValues([StatsValue.of(moment.utc('2000-01-01'), 10)]));
      const stats: Stats = new Stats(
        statsID,
        new Language(LanguageID.of(1), 'language1', 'englishname1', ISO639.of('lang1')),
        new Region(RegionID.of(1), 'region1', ISO3166.of('regn1')),
        Term.DAILY,
        'name1',
        'unit1',
        moment.utc('2000-01-01'),
        new StatsItems([
          statsItem
        ])
      );

      expect(stats.toJSON()).toEqual({
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
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '2e787bad-6727-47d0-af9a-9c8189342a50',
            name: 'stats1',
            values: [
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

  describe('getColumns', () => {
    it('asOfs are taken and their duplicated values are eliminated', () => {
      const stats: Stats = new Stats(StatsID.of(UUID.of('f330c618-6127-46d1-ba10-a9f6af458b4c')), Language.default(), Region.default(), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([
          StatsValue.of(moment('2000-01-01'), 1),
          StatsValue.of(moment('2000-01-03'), 2)
        ])),
        new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([
          StatsValue.of(moment('2000-01-01'), 2),
          StatsValue.of(moment('2000-01-02'), 4),
          StatsValue.of(moment('2000-01-05'), 6)
        ]))
      ]));

      expect(stats.getColumns()).toEqual([
        '1999-12-31',
        '2000-01-01',
        '2000-01-02',
        '2000-01-03',
        '2000-01-04',
        '2000-01-05',
        '2000-01-06'
      ]);
    });
  });

  describe('getRows', () => {
    it('the statsItem names are taken', () => {
      const stats: Stats = new Stats(StatsID.of(UUID.of('f330c618-6127-46d1-ba10-a9f6af458b4c')), Language.default(), Region.default(), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([
          StatsValue.of(moment('2000-01-01'), 1),
          StatsValue.of(moment('2000-01-03'), 2)
        ])),
        new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([
          StatsValue.of(moment('2000-01-01'), 2),
          StatsValue.of(moment('2000-01-02'), 4),
          StatsValue.of(moment('2000-01-05'), 6)
        ]))
      ]));

      expect(stats.getRows()).toEqual([
        'stats item 1',
        'stats item 2'
      ]);
    });
  });

  describe('getData', () => {
    it('the matrix is made even if the value is not input', () => {
      const stats: Stats = new Stats(StatsID.of(UUID.of('f330c618-6127-46d1-ba10-a9f6af458b4c')), Language.default(), Region.default(), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', new StatsValues([
          StatsValue.of(moment('2000-01-01'), 1),
          StatsValue.of(moment('2000-01-03'), 2)
        ])),
        new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', new StatsValues([
          StatsValue.of(moment('2000-01-01'), 2),
          StatsValue.of(moment('2000-01-02'), 4),
          StatsValue.of(moment('2000-01-05'), 6)
        ]))
      ]));

      expect(stats.getData()).toEqual([
        ['', '1', '', '2', '', '', ''],
        ['', '2', '4', '', '', '6', '']
      ])
    });
  });

  describe('isFilled', () => {
    it('returns true if the language, region, name, and unit are filled', () => {
      const stats1: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.default(), Region.default(), Term.DAILY, '', '', moment('2000-01-01'), new StatsItems([]));
      const stats2: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), Region.default(), Term.DAILY, '', '', moment('2000-01-01'), new StatsItems([]));
      const stats3: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.default(), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', '', moment('2000-01-01'), new StatsItems([]));
      const stats4: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', '', moment('2000-01-01'), new StatsItems([]));
      const stats5: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', '', moment('2000-01-01'), new StatsItems([]));
      const stats6: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', 'unit1', moment('2000-01-01'), new StatsItems([]));
      const stats7: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([]));

      expect(stats1.isFilled()).toEqual(false);
      expect(stats2.isFilled()).toEqual(false);
      expect(stats3.isFilled()).toEqual(false);
      expect(stats4.isFilled()).toEqual(false);
      expect(stats5.isFilled()).toEqual(false);
      expect(stats6.isFilled()).toEqual(false);
      expect(stats7.isFilled()).toEqual(true);
    });
  });

  describe('isValid', () => {
    it('returns true if the stats is filled', () => {
      const stats1: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.default(), Region.default(), Term.DAILY, '', '', moment('2000-01-01'), new StatsItems([]));
      const stats2: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), Region.default(), Term.DAILY, '', '', moment('2000-01-01'), new StatsItems([]));
      const stats3: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.default(), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', '', moment('2000-01-01'), new StatsItems([]));
      const stats4: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', '', moment('2000-01-01'), new StatsItems([]));
      const stats5: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', '', moment('2000-01-01'), new StatsItems([]));
      const stats6: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', 'unit1', moment('2000-01-01'), new StatsItems([]));
      const stats7: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([]));

      expect(stats1.isValid()).toEqual(false);
      expect(stats2.isValid()).toEqual(false);
      expect(stats3.isValid()).toEqual(false);
      expect(stats4.isValid()).toEqual(false);
      expect(stats5.isValid()).toEqual(false);
      expect(stats6.isValid()).toEqual(false);
      expect(stats7.isValid()).toEqual(true);
    });

    it('stats is filled but statsItems are invalid', () => {
      const stats1: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('4905faa8-0b6d-4032-9788-704c2703a5c9')), '', new StatsValues([]))
      ]));
      const stats2: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('4905faa8-0b6d-4032-9788-704c2703a5c9')), 'name1', new StatsValues([]))
      ]));

      expect(stats1.isValid()).toEqual(false);
      expect(stats2.isValid()).toEqual(true);
    });

    it('stats and their items are filld', () => {
      const stats1: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([]));
      const stats2: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('4905faa8-0b6d-4032-9788-704c2703a5c9')), 'name', new StatsValues([]))
      ]));
      const stats3: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), new Language(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), new Region(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('4905faa8-0b6d-4032-9788-704c2703a5c9')), 'name1', new StatsValues([])),
        new StatsItem(StatsItemID.of(UUID.of('4905faa8-0b6d-4032-9788-704c2703a5c9')), 'name2', new StatsValues([]))
      ]));

      expect(stats1.isValid()).toEqual(true);
      expect(stats2.isValid()).toEqual(true);
      expect(stats3.isValid()).toEqual(true);
    });
  });

  describe('setData', () => {
    it('update pattern', () => {
      const stats: Stats = new Stats(StatsID.of(UUID.of('14351289-d8ce-48cd-8ef9-ac1b356c9233')), Language.default(), Region.default(), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06')), 'item1', new StatsValues([
          StatsValue.of(moment('2000-01-01'), 1),
          StatsValue.of(moment('2000-01-02'), 2)
        ]))
      ]));

      stats.setData(0, 2, 4);

      expect(stats.getItems().get(0).getValues().length()).toEqual(2);
      expect(stats.getItems().get(0).getValues().get(0).getAsOfAsString()).toEqual('2000-01-01');
      expect(stats.getItems().get(0).getValues().get(0).getValue()).toEqual(1);
      expect(stats.getItems().get(0).getValues().get(1).getAsOfAsString()).toEqual('2000-01-02');
      expect(stats.getItems().get(0).getValues().get(1).getValue()).toEqual(4);
    });

    it('insert pattern', () => {
      const stats: Stats = new Stats(StatsID.of(UUID.of('14351289-d8ce-48cd-8ef9-ac1b356c9233')), Language.default(), Region.default(), Term.DAILY, 'stats1', 'unit1', moment('2000-01-01'), new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06')), 'item1', new StatsValues([
          StatsValue.of(moment('2000-01-01'), 1),
          StatsValue.of(moment('2000-01-03'), 3)
        ]))
      ]));

      stats.setData(0, 2, 2);

      expect(stats.getItems().get(0).getValues().length()).toEqual(3);
      expect(stats.getItems().get(0).getValues().get(0).getAsOfAsString()).toEqual('2000-01-01');
      expect(stats.getItems().get(0).getValues().get(0).getValue()).toEqual(1);
      expect(stats.getItems().get(0).getValues().get(1).getAsOfAsString()).toEqual('2000-01-02');
      expect(stats.getItems().get(0).getValues().get(1).getValue()).toEqual(2);
      expect(stats.getItems().get(0).getValues().get(2).getAsOfAsString()).toEqual('2000-01-03');
      expect(stats.getItems().get(0).getValues().get(2).getValue()).toEqual(3);
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

      const stats: Stats = new Stats(statsID, language, region, term, name, unit, updatedAt, new StatsItems([]));
      const copy: Stats = stats.copy();

      expect(stats).not.toBe(copy);
      expect(stats.getStatsID()).toEqual(statsID);
      expect(stats.getLanguage()).toEqual(language);
      expect(stats.getRegion()).toEqual(region);
      expect(stats.getTerm()).toEqual(term);
      expect(stats.getName()).toEqual(name);
      expect(stats.getUnit()).toEqual(unit);
      expect(stats.getUpdatedAt().isSame(updatedAt)).toEqual(true);
    });
  });

  describe('getChart', () => {
    it('chart is output for recharts', () => {
      const statsID: StatsID = StatsID.of(UUID.of('f330c618-6127-46d1-ba10-a9f6af458b4c'));
      const language: Language = new Language(LanguageID.of(1), 'language', 'english language', ISO639.of('ab'));
      const region: Region = new Region(RegionID.of(2), 'region', ISO3166.of('AFG'));
      const term: Term = Term.DAILY;
      const name: string = 'stats';
      const unit: string = 'unit';
      const updatedAt: moment.Moment = moment('2000-01-01');

      const stats: Stats = new Stats(statsID, language, region, term, name, unit, updatedAt, new StatsItems([
        new StatsItem(StatsItemID.of(UUID.of('c4c9d345-251b-4397-9c54-0b38dc735dee')), 'stats1', new StatsValues([
          StatsValue.of(moment('2000-01-03'), 3),
          StatsValue.of(moment('2000-01-01'), 1)
        ])),
        new StatsItem(StatsItemID.of(UUID.of('0039e5ba-6192-447c-915d-9bbaddba9822')), 'stats2', new StatsValues([
          StatsValue.of(moment('2000-01-02'), 12),
          StatsValue.of(moment('2000-01-03'), 13),
          StatsValue.of(moment('2000-01-04'), 14)
        ])),
        new StatsItem(StatsItemID.of(UUID.of('e98da317-2130-48a2-a3f4-4c1f7bee0ae0')), 'stats3', new StatsValues([
        ]))
      ]));

      expect(stats.getChart()).toEqual([
        {name: '1999-12-31'},
        {name: '2000-01-01', stats1: 1},
        {name: '2000-01-02', stats2: 12},
        {name: '2000-01-03', stats1: 3, stats2: 13},
        {name: '2000-01-04', stats2: 14},
        {name: '2000-01-05'}
      ]);
    });
  });
});
