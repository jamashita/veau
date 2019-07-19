import 'jest';
import * as moment from 'moment';
import { Term } from '../../veau-enum/Term';
import { StatsValues } from '../../veau-vo/collection/StatsValues';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { StatsValue } from '../../veau-vo/StatsValue';
import { UpdatedAt } from '../../veau-vo/UpdatedAt';
import { StatsItems } from '../collection/StatsItems';
import { Language } from '../Language';
import { Region } from '../Region';
import { Stats, StatsJSON, StatsRow } from '../Stats';
import { StatsItem } from '../StatsItem';

describe('Stats', () => {
  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const statsID1: StatsID = StatsID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e');
      const statsID2: StatsID = StatsID.of('f19bca43-511f-4d8c-bd12-af27bf0cd429');
      const stats1: Stats = Stats.from(
        statsID1,
        Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([])
      );
      const stats2: Stats = Stats.from(
        statsID2,
        Language.from(LanguageID.of(2), LanguageName.of('language2'), LanguageName.of('LANGUAGE2'), ISO639.of('lang2')),
        Region.from(RegionID.of(2), RegionName.of('region2'), ISO3166.of('REGION2')),
        Term.WEEKLY,
        StatsName.of('name2'),
        StatsUnit.of('unit2'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([
          StatsItem.from(
            StatsItemID.of('30dd05bd-480f-4050-b8d4-5eec32ae11ed'),
            StatsItemName.of('stats1'),
            StatsValues.of([])
          )
        ])
      );
      const stats3: Stats = Stats.from(
        statsID1,
        Language.from(LanguageID.of(2), LanguageName.of('language2'), LanguageName.of('LANGUAGE2'), ISO639.of('lang2')),
        Region.from(RegionID.of(2), RegionName.of('region2'), ISO3166.of('REGION2')),
        Term.WEEKLY,
        StatsName.of('name2'),
        StatsUnit.of('unit2'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([
          StatsItem.from(
            StatsItemID.of('30dd05bd-480f-4050-b8d4-5eec32ae11ed'),
            StatsItemName.of('stats1'),
            StatsValues.of([])
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
      const statsID: StatsID = StatsID.of('bfb0ebff-fc8c-450e-9265-82fa4938ae94');
      const statsItemID: StatsItemID = StatsItemID.of('2e787bad-6727-47d0-af9a-9c8189342a50');
      const statsItem: StatsItem = StatsItem.from(statsItemID,StatsItemName.of('stats1'), StatsValues.of([StatsValue.of(moment.utc('2000-01-01'), 10)]));
      const stats: Stats = Stats.from(
        statsID,
        Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('englishname1'), ISO639.of('lang1')),
        Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01'),
        StatsItems.from([
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
      const stats: Stats = Stats.from(StatsID.of('f330c618-6127-46d1-ba10-a9f6af458b4c'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([
          StatsValue.of(moment('2000-01-01'), 1),
          StatsValue.of(moment('2000-01-03'), 2)
        ])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([
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
      const stats: Stats = Stats.from(StatsID.of('f330c618-6127-46d1-ba10-a9f6af458b4c'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([
          StatsValue.of(moment('2000-01-01'), 1),
          StatsValue.of(moment('2000-01-03'), 2)
        ])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([
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
      const stats: Stats = Stats.from(StatsID.of('f330c618-6127-46d1-ba10-a9f6af458b4c'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('8f7b1783-b09c-4010-aac1-dca1292ee700'), StatsItemName.of('stats item 1'), StatsValues.of([
          StatsValue.of(moment('2000-01-01'), 1),
          StatsValue.of(moment('2000-01-03'), 2)
        ])),
        StatsItem.from(StatsItemID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551'), StatsItemName.of('stats item 2'), StatsValues.of([
          StatsValue.of(moment('2000-01-01'), 2),
          StatsValue.of(moment('2000-01-02'), 4),
          StatsValue.of(moment('2000-01-05'), 6)
        ]))
      ]));

      expect(stats.getData()).toEqual([
        ['', '1', '', '2', '', '', ''],
        ['', '2', '4', '', '', '6', '']
      ]);
    });
  });

  describe('isFilled', () => {
    it('returns true if the language, region, name, and unit are filled', () => {
      const stats1: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.default(), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats2: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats3: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.default(), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats4: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats5: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats6: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats7: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));

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
      const stats1: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.default(), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats2: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats3: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.default(), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats4: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats5: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.default(), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats6: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats7: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));

      expect(stats1.isValid()).toEqual(false);
      expect(stats2.isValid()).toEqual(false);
      expect(stats3.isValid()).toEqual(false);
      expect(stats4.isValid()).toEqual(false);
      expect(stats5.isValid()).toEqual(false);
      expect(stats6.isValid()).toEqual(false);
      expect(stats7.isValid()).toEqual(true);
    });

    it('stats is filled but statsItems are invalid', () => {
      const stats1: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('4905faa8-0b6d-4032-9788-704c2703a5c9'), StatsItemName.default(), StatsValues.of([]))
      ]));
      const stats2: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('4905faa8-0b6d-4032-9788-704c2703a5c9'), StatsItemName.of('name1'), StatsValues.of([]))
      ]));

      expect(stats1.isValid()).toEqual(false);
      expect(stats2.isValid()).toEqual(true);
    });

    it('stats and their items are filled', () => {
      const stats1: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([]));
      const stats2: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('4905faa8-0b6d-4032-9788-704c2703a5c9'), StatsItemName.of('name'), StatsValues.of([]))
      ]));
      const stats3: Stats = Stats.from(StatsID.of('62e103f0-5299-4794-883f-62b9c91583e4'), Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('4905faa8-0b6d-4032-9788-704c2703a5c9'), StatsItemName.of('name1'), StatsValues.of([])),
        StatsItem.from(StatsItemID.of('4905faa8-0b6d-4032-9788-704c2703a5c9'), StatsItemName.of('name2'), StatsValues.of([]))
      ]));

      expect(stats1.isValid()).toEqual(true);
      expect(stats2.isValid()).toEqual(true);
      expect(stats3.isValid()).toEqual(true);
    });
  });

  describe('setData', () => {
    it('update pattern', () => {
      const stats: Stats = Stats.from(StatsID.of('14351289-d8ce-48cd-8ef9-ac1b356c9233'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06'), StatsItemName.of('item1'), StatsValues.of([
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
      const stats: Stats = Stats.from(StatsID.of('14351289-d8ce-48cd-8ef9-ac1b356c9233'), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01'), StatsItems.from([
        StatsItem.from(StatsItemID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06'), StatsItemName.of('item1'), StatsValues.of([
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
      const statsID: StatsID = StatsID.of('f330c618-6127-46d1-ba10-a9f6af458b4c');
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(2), RegionName.of('region'), ISO3166.of('AFG'));
      const term: Term = Term.DAILY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01');

      const stats: Stats = Stats.from(statsID, language, region, term, name, unit, updatedAt, StatsItems.from([]));
      const copy: Stats = stats.copy();

      expect(stats).not.toBe(copy);
      expect(stats.getStatsID()).toEqual(statsID);
      expect(stats.getLanguage()).toEqual(language);
      expect(stats.getRegion()).toEqual(region);
      expect(stats.getTerm()).toEqual(term);
      expect(stats.getName()).toEqual(name);
      expect(stats.getUnit()).toEqual(unit);
      expect(stats.getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('getChart', () => {
    it('chart is output for recharts', () => {
      const statsID: StatsID = StatsID.of('f330c618-6127-46d1-ba10-a9f6af458b4c');
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('ab'));
      const region: Region = Region.from(RegionID.of(2), RegionName.of('region'), ISO3166.of('AFG'));
      const term: Term = Term.DAILY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01');

      const stats: Stats = Stats.from(statsID, language, region, term, name, unit, updatedAt, StatsItems.from([
        StatsItem.from(StatsItemID.of('c4c9d345-251b-4397-9c54-0b38dc735dee'), StatsItemName.of('stats1'), StatsValues.of([
          StatsValue.of(moment('2000-01-03'), 3),
          StatsValue.of(moment('2000-01-01'), 1)
        ])),
        StatsItem.from(StatsItemID.of('0039e5ba-6192-447c-915d-9bbaddba9822'), StatsItemName.of('stats2'), StatsValues.of([
          StatsValue.of(moment('2000-01-02'), 12),
          StatsValue.of(moment('2000-01-03'), 13),
          StatsValue.of(moment('2000-01-04'), 14)
        ])),
        StatsItem.from(StatsItemID.of('e98da317-2130-48a2-a3f4-4c1f7bee0ae0'), StatsItemName.of('stats3'), StatsValues.of([
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

  describe('from', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.of('af272303-df5d-4d34-8604-398920b7d2bb');
      const language: Language = Language.from(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language english name 1'), ISO639.of('lang1'));
      const region: Region = Region.from(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: StatsName = StatsName.of('name1');
      const unit: StatsUnit = StatsUnit.of('unit1');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01');
      const items: StatsItems = StatsItems.from([
        StatsItem.from(StatsItemID.of('a28eceac-0451-4339-b1c5-0c298b3905f6'), StatsItemName.of('stats1'), StatsValues.of([]))
      ]);

      const stats: Stats = Stats.from(statsID, language, region, term, name, unit, updatedAt, items);

      expect(stats.getStatsID()).toEqual(statsID);
      expect(stats.getLanguage()).toEqual(language);
      expect(stats.getRegion()).toEqual(region);
      expect(stats.getTerm()).toEqual(term);
      expect(stats.getName()).toEqual(name);
      expect(stats.getUnit()).toEqual(unit);
      expect(stats.getUpdatedAt()).toEqual(updatedAt);
      expect(stats.getItems().equals(items)).toEqual(true);
    });
  });

  describe('fromJSON', () => {
    it('normal case', () => {
      const json: StatsJSON = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
        },
        region: {
          regionID: 1,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 1,
        name: 'stats1',
        unit: 'unit1',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '04166d3c-be62-4e13-8231-e718b5b96683',
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          {
            statsItemID: '',
            name: 'stats item2',
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

      const stats: Stats = Stats.fromJSON(json);

      expect(stats.getStatsID().get()).toEqual(json.statsID);
      expect(stats.getLanguage().getLanguageID().get()).toEqual(json.language.languageID);
      expect(stats.getLanguage().getName().get()).toEqual(json.language.name);
      expect(stats.getLanguage().getEnglishName().get()).toEqual(json.language.englishName);
      expect(stats.getLanguage().getISO639().get()).toEqual(json.language.iso639);
      expect(stats.getRegion().getRegionID().get()).toEqual(json.region.regionID);
      expect(stats.getRegion().getName().get()).toEqual(json.region.name);
      expect(stats.getRegion().getISO3166().get()).toEqual(json.region.iso3166);
      expect(stats.getTerm().getID()).toEqual(json.termID);
      expect(stats.getName().get()).toEqual(json.name);
      expect(stats.getUnit().get()).toEqual(json.unit);
      expect(stats.getUpdatedAt().getString()).toEqual(json.updatedAt);
      expect(stats.getItems().length()).toEqual(json.items.length);
      for (let i = 0; i < stats.getItems().length(); i++) {
        expect(stats.getItems().get(i).getStatsItemID().get()).toEqual(json.items[i].statsItemID);
        expect(stats.getItems().get(i).getName().get()).toEqual(json.items[i].name);
        expect(stats.getItems().get(i).getValues().length()).toEqual(json.items[i].values.length);
        for (let j = 0; j < stats.getItems().get(i).getValues().length(); j++) {
          expect(stats.getItems().get(i).getValues().get(j).getAsOfAsString()).toEqual(json.items[i].values[j].asOf);
          expect(stats.getItems().get(i).getValues().get(j).getValue()).toEqual(json.items[i].values[j].value);
        }
      }
    });
  });

  describe('fromRow', () => {
    it('normal case', () => {
      const row: StatsRow = {
        statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
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
      };
      const items: Array<StatsItem> = [
        StatsItem.from(
          StatsItemID.of('610b532b-5711-461a-b44a-7387e8d08596'),
          StatsItemName.of('stats item1'),
          StatsValues.of([
            StatsValue.of(moment('2000-01-01'), 1),
            StatsValue.of(moment('2000-01-02'), 2)
          ])
        ),
        StatsItem.from(
          StatsItemID.of('530e0e07-654f-4764-a3ac-77ce12a2a5e4'),
          StatsItemName.of('stats item2'),
          StatsValues.of([
          ])
        )
      ];

      const stats: Stats = Stats.fromRow(row, StatsItems.from(items));

      expect(stats.toJSON()).toEqual({
        statsID: '0ec47089-24d3-4035-a27d-b636bd7a5170',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'englishLanguage1',
          iso639: 'lang1'
        },
        region: {
          regionID: 2,
          name: 'region1',
          iso3166: 'regn1'
        },
        termID: 3,
        name: 'name',
        unit: 'unit',
        updatedAt: '2000-01-01 00:00:00',
        items: [
          {
            statsItemID: '610b532b-5711-461a-b44a-7387e8d08596',
            name: 'stats item1',
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
            name: 'stats item2',
            values: [
            ]
          }
        ]
      });
    });
  });
});
