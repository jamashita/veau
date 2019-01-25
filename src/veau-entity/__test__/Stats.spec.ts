/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import { StatsID } from '../../veau-vo/StatsID';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsValues } from '../../veau-vo/StatsValues';
import { Term } from '../../veau-vo/Term';
import { UUID } from '../../veau-vo/UUID';
import { Stats } from '../Stats';
import { StatsItem } from '../StatsItem';

describe('Stats', () => {
  it('equals', () => {
    const statsID1: StatsID = StatsID.of(UUID.of('d5d311b5-c09a-4f82-91e5-b7b55736120e'));
    const statsID2: StatsID = StatsID.of(UUID.of('f19bca43-511f-4d8c-bd12-af27bf0cd429'));
    const stats1: Stats = new Stats(
      statsID1,
      Language.of(LanguageID.of(1), 'language1', 'LANGUAGE1', ISO639.of('lang1')),
      Region.of(RegionID.of(1), 'region1', ISO3166.of('REGION1')),
      Term.DAILY,
      'name1',
      moment.utc(new Date(2000, 0, 1)),
      []
    );
    const stats2: Stats = new Stats(
      statsID2,
      Language.of(LanguageID.of(2), 'language2', 'LANGUAGE2', ISO639.of('lang2')),
      Region.of(RegionID.of(2), 'region2', ISO3166.of('REGION2')),
      Term.WEEKLY,
      'name2',
      moment.utc(new Date(2001, 0, 1)),
      [
        new StatsItem(
          StatsItemID.of(UUID.of('30dd05bd-480f-4050-b8d4-5eec32ae11ed')),
          'stats1',
          'unit1',
          1,
          StatsValues.of([])
        )
      ]
    );
    const stats3: Stats = new Stats(
      statsID1,
      Language.of(LanguageID.of(2), 'language2', 'LANGUAGE2', ISO639.of('lang2')),
      Region.of(RegionID.of(2), 'region2', ISO3166.of('REGION2')),
      Term.WEEKLY,
      'name2',
      moment.utc(new Date(2001, 0, 1)),
      [
        new StatsItem(
          StatsItemID.of(UUID.of('30dd05bd-480f-4050-b8d4-5eec32ae11ed')),
          'stats1',
          'unit1',
          1,
          StatsValues.of([])
        )
      ]
    );

    expect(stats1.equals(stats1)).toEqual(true);
    expect(stats1.equals(stats2)).toEqual(false);
    expect(stats1.equals(stats3)).toEqual(true);
  });

  it('toJSON', () => {
    const statsID: StatsID = StatsID.of(UUID.of('bfb0ebff-fc8c-450e-9265-82fa4938ae94'));
    const statsItemID: StatsItemID = StatsItemID.of(UUID.of('2e787bad-6727-47d0-af9a-9c8189342a50'));
    const statsItem: StatsItem = new StatsItem(statsItemID,'stats1', 'unit1', 1, StatsValues.of([StatsValue.of(moment.utc('2000-01-01'), 10)]));
    const stats: Stats = new Stats(
      statsID,
      Language.of(LanguageID.of(1), 'language1', 'englishname1', ISO639.of('lang1')),
      Region.of(RegionID.of(1), 'region1', ISO3166.of('regn1')),
      Term.DAILY,
      'name1',
      moment.utc('2000-01-01'),
      [
        statsItem
      ]
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
      updatedAt: '2000-01-01 00:00:00',
      items: [
        {
          statsItemID: '2e787bad-6727-47d0-af9a-9c8189342a50',
          name: 'stats1',
          unit: 'unit1',
          seq: 1,
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

  it('getColumn', () => {
    const stats: Stats = new Stats(StatsID.of(UUID.of('f330c618-6127-46d1-ba10-a9f6af458b4c')), Language.default(), Region.default(), Term.DAILY, 'stats1', moment.utc('2000-01-01'), [
      new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', 'unit1', 1, StatsValues.of([
        StatsValue.of(moment.utc('2000-01-01'), 1),
        StatsValue.of(moment.utc('2000-01-03'), 2)
      ])),
      new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', 'unit2', 2, StatsValues.of([
        StatsValue.of(moment.utc('2000-01-01'), 2),
        StatsValue.of(moment.utc('2000-01-02'), 4),
        StatsValue.of(moment.utc('2000-01-05'), 6)
      ]))
    ]);

    expect(stats.getColumn()).toEqual([
      '2000-01-01',
      '2000-01-02',
      '2000-01-03',
      '2000-01-04',
      '2000-01-05'
    ]);
  });

  it('getRow', () => {
    const stats: Stats = new Stats(StatsID.of(UUID.of('f330c618-6127-46d1-ba10-a9f6af458b4c')), Language.default(), Region.default(), Term.DAILY, 'stats1', moment.utc('2000-01-01'), [
      new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', 'unit1', 1, StatsValues.of([
        StatsValue.of(moment.utc('2000-01-01'), 1),
        StatsValue.of(moment.utc('2000-01-03'), 2)
      ])),
      new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', 'unit2', 2, StatsValues.of([
        StatsValue.of(moment.utc('2000-01-01'), 2),
        StatsValue.of(moment.utc('2000-01-02'), 4),
        StatsValue.of(moment.utc('2000-01-05'), 6)
      ]))
    ]);

    expect(stats.getRow()).toEqual([
      'stats item 1',
      'stats item 2'
    ]);
  });

  it('getDataMatrix', () => {
    const stats: Stats = new Stats(StatsID.of(UUID.of('f330c618-6127-46d1-ba10-a9f6af458b4c')), Language.default(), Region.default(), Term.DAILY, 'stats1', moment.utc('2000-01-01'), [
      new StatsItem(StatsItemID.of(UUID.of('8f7b1783-b09c-4010-aac1-dca1292ee700')), 'stats item 1', 'unit1', 1, StatsValues.of([
        StatsValue.of(moment.utc('2000-01-01'), 1),
        StatsValue.of(moment.utc('2000-01-03'), 2)
      ])),
      new StatsItem(StatsItemID.of(UUID.of('9e6b3c69-580c-4c19-9f3f-9bd82f582551')), 'stats item 2', 'unit2', 2, StatsValues.of([
        StatsValue.of(moment.utc('2000-01-01'), 2),
        StatsValue.of(moment.utc('2000-01-02'), 4),
        StatsValue.of(moment.utc('2000-01-05'), 6)
      ]))
    ]);

    expect(stats.getDataMatrix()).toEqual([
      ['1', '', '2', '', ''],
      ['2', '4', '', '', '6']
    ])
  });

  it('isFilled', () => {
    const stats1: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.default(), Region.default(), Term.DAILY, '', moment.utc('2000-01-01'), []);
    const stats2: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.of(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), Region.default(), Term.DAILY, '', moment.utc('2000-01-01'), []);
    const stats3: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.default(), Region.of(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', moment.utc('2000-01-01'), []);
    const stats4: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.of(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), Region.of(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, '', moment.utc('2000-01-01'), []);
    const stats5: Stats = new Stats(StatsID.of(UUID.of('62e103f0-5299-4794-883f-62b9c91583e4')), Language.of(LanguageID.of(1), 'language1', 'language1', ISO639.of('ab')), Region.of(RegionID.of(1), 'region1', ISO3166.of('AFG')), Term.DAILY, 'stats1', moment.utc('2000-01-01'), []);

    expect(stats1.isFilled()).toEqual(false);
    expect(stats2.isFilled()).toEqual(false);
    expect(stats3.isFilled()).toEqual(false);
    expect(stats4.isFilled()).toEqual(false);
    expect(stats5.isFilled()).toEqual(true);
  });

  it('setData: update pattern', () => {
    const stats: Stats = new Stats(StatsID.of(UUID.of('14351289-d8ce-48cd-8ef9-ac1b356c9233')), Language.default(), Region.default(), Term.DAILY, 'stats1', moment.utc('2000-01-01'), [
      new StatsItem(StatsItemID.of(UUID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06')), 'item1', 'unit1', 1, StatsValues.of([
        StatsValue.of(moment.utc('2000-01-01'), 1),
        StatsValue.of(moment.utc('2000-01-02'), 2)
      ]))
    ]);

    stats.setData(0, 1, 4);

    expect(stats.getItems()[0].getValues().length()).toEqual(2);
    expect(stats.getItems()[0].getValues().get()[0].getAsOfAsString()).toEqual('2000-01-01');
    expect(stats.getItems()[0].getValues().get()[0].getValue()).toEqual(1);
    expect(stats.getItems()[0].getValues().get()[1].getAsOfAsString()).toEqual('2000-01-02');
    expect(stats.getItems()[0].getValues().get()[1].getValue()).toEqual(4);
  });

  it('setData: insert pattern', () => {
    const stats: Stats = new Stats(StatsID.of(UUID.of('14351289-d8ce-48cd-8ef9-ac1b356c9233')), Language.default(), Region.default(), Term.DAILY, 'stats1', moment.utc('2000-01-01'), [
      new StatsItem(StatsItemID.of(UUID.of('bf04b0fa-ed4d-4114-84a3-c963871dfe06')), 'item1', 'unit1', 1, StatsValues.of([
        StatsValue.of(moment.utc('2000-01-01'), 1),
        StatsValue.of(moment.utc('2000-01-03'), 3)
      ]))
    ]);

    stats.setData(0, 1, 2);

    expect(stats.getItems()[0].getValues().length()).toEqual(3);
    expect(stats.getItems()[0].getValues().get()[0].getAsOfAsString()).toEqual('2000-01-01');
    expect(stats.getItems()[0].getValues().get()[0].getValue()).toEqual(1);
    expect(stats.getItems()[0].getValues().get()[1].getAsOfAsString()).toEqual('2000-01-02');
    expect(stats.getItems()[0].getValues().get()[1].getValue()).toEqual(2);
    expect(stats.getItems()[0].getValues().get()[2].getAsOfAsString()).toEqual('2000-01-03');
    expect(stats.getItems()[0].getValues().get()[2].getValue()).toEqual(3);
  });
});
