import { StatsError } from '../../veau-error/StatsError';
import { None } from '../../veau-general/Optional/None';
import { Some } from '../../veau-general/Optional/Some';
import { Try } from '../../veau-general/Try/Try';
import { UUID } from '../../veau-general/UUID/UUID';
import { AsOf } from '../../veau-vo/AsOf';
import { AsOfs } from '../../veau-vo/AsOfs';
import { Column } from '../../veau-vo/Column';
import { Coordinate } from '../../veau-vo/Coordinate';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { NumericalValue } from '../../veau-vo/NumericalValue';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { Row } from '../../veau-vo/Row';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { StatsItemName } from '../../veau-vo/StatsItemName';
import { StatsItemNames } from '../../veau-vo/StatsItemNames';
import { StatsName } from '../../veau-vo/StatsName';
import { StatsUnit } from '../../veau-vo/StatsUnit';
import { StatsValue } from '../../veau-vo/StatsValue';
import { StatsValues } from '../../veau-vo/StatsValues';
import { Term } from '../../veau-vo/Term';
import { UpdatedAt } from '../../veau-vo/UpdatedAt';
import { Stats, StatsJSON, StatsRow } from '../Stats';
import { StatsItem } from '../StatsItem';
import { StatsItems } from '../StatsItems';

describe('Stats', () => {
  describe('equals', () => {
    it('returns true if the ids equal', () => {
      const statsID1: StatsID = StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get();
      const statsID2: StatsID = StatsID.ofString('f19bca43-511f-4d8c-bd12-af27bf0cd429').get();
      const stats1: Stats = Stats.of(
        statsID1,
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('LANGUAGE1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('REGION1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.empty()
      );
      const stats2: Stats = Stats.of(
        statsID2,
        Language.of(LanguageID.of(2), LanguageName.of('language2'), LanguageName.of('LANGUAGE2'), ISO639.of('lang2')),
        Region.of(RegionID.of(2), RegionName.of('region2'), ISO3166.of('REGION2')),
        Term.WEEKLY,
        StatsName.of('name2'),
        StatsUnit.of('unit2'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats1'),
            StatsValues.empty()
          )
        ])
      );
      const stats3: Stats = Stats.of(
        statsID1,
        Language.of(LanguageID.of(2), LanguageName.of('language2'), LanguageName.of('LANGUAGE2'), ISO639.of('lang2')),
        Region.of(RegionID.of(2), RegionName.of('region2'), ISO3166.of('REGION2')),
        Term.WEEKLY,
        StatsName.of('name2'),
        StatsUnit.of('unit2'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats1'),
            StatsValues.empty()
          )
        ])
      );

      expect(stats1.equals(stats1)).toEqual(true);
      expect(stats1.equals(stats2)).toEqual(false);
      expect(stats1.equals(stats3)).toEqual(true);
    });
  });

  describe('isSame', () => {
    it('returns true if all the properties are the same', () => {
      const stats1: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats2: Stats = Stats.of(
        StatsID.ofString('f19bca43-511f-4d8c-bd12-af27bf0cd429').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats3: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(2), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats4: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats5: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.WEEKLY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats6: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('namae'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats7: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unito'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats8: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-02 03:04:05').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats9: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
        ])
      );
      const stats10: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ee').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats11: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('statsu'),
            StatsValues.empty()
          )
        ])
      );
      const stats12: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.of([StatsValue.of(StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))])
          )
        ])
      );
      const stats13: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );
      const stats14: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ]),
        Some.of<AsOf>(AsOf.ofString('2000-01-01').get())
      );
      const stats15: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ]),
        Some.of<AsOf>(AsOf.ofString('2000-01-02').get())
      );
      const stats16: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ]),
        Some.of<AsOf>(AsOf.ofString('2000-01-01').get())
      );
      const stats17: Stats = Stats.of(
        StatsID.ofString('d5d311b5-c09a-4f82-91e5-b7b55736120e').get(),
        Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('LANGUAGE'), ISO639.of('lang')),
        Region.of(RegionID.of(1), RegionName.of('region'), ISO3166.of('REGION')),
        Term.DAILY,
        StatsName.of('name'),
        StatsUnit.of('unit'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('30dd05bd-480f-4050-b8d4-5eec32ae11ed').get(),
            StatsItemName.of('stats'),
            StatsValues.empty()
          )
        ])
      );


      expect(stats1.isSame(stats1)).toEqual(true);
      expect(stats1.isSame(stats2)).toEqual(false);
      expect(stats1.isSame(stats3)).toEqual(false);
      expect(stats1.isSame(stats4)).toEqual(false);
      expect(stats1.isSame(stats5)).toEqual(false);
      expect(stats1.isSame(stats6)).toEqual(false);
      expect(stats1.isSame(stats7)).toEqual(false);
      expect(stats1.isSame(stats8)).toEqual(false);
      expect(stats1.isSame(stats9)).toEqual(false);
      expect(stats1.isSame(stats10)).toEqual(false);
      expect(stats1.isSame(stats11)).toEqual(false);
      expect(stats1.isSame(stats12)).toEqual(false);
      expect(stats1.isSame(stats13)).toEqual(true);
      expect(stats1.isSame(stats14)).toEqual(true);
      expect(stats1.isSame(stats15)).toEqual(false);
      expect(stats1.isSame(stats16)).toEqual(false);
      expect(stats1.isSame(stats17)).toEqual(true);
      expect(stats14.isSame(stats14)).toEqual(true);
      expect(stats14.isSame(stats15)).toEqual(false);
      expect(stats14.isSame(stats16)).toEqual(true);
      expect(stats14.isSame(stats17)).toEqual(false);
    });
  });

  describe('toJSON', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.ofString('bfb0ebff-fc8c-450e-9265-82fa4938ae94').get();
      const statsItemID: StatsItemID = StatsItemID.ofString('2e787bad-6727-47d0-af9a-9c8189342a50').get();
      const statsItem: StatsItem = StatsItem.of(statsItemID, StatsItemName.of('stats1'), StatsValues.of([StatsValue.of(statsItemID, AsOf.ofString('2000-01-01').get(), NumericalValue.of(10))]));
      const stats: Stats = Stats.of(
        statsID,
        Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('englishname1'), ISO639.of('lang1')),
        Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1')),
        Term.DAILY,
        StatsName.of('name1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
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

  describe('toString', () => {
    it('normal case', () => {
      const id1: string = 'bfb0ebff-fc8c-450e-9265-82fa4938ae94';
      const id2: string = '2e787bad-6727-47d0-af9a-9c8189342a50';
      const name1: string = 'stats1';
      const name2: string = 'name1';
      const at1: string = '2000-01-02';
      const at2: string = '2000-01-01 02:03:04';
      const value1: number = 10;
      const term: Term = Term.DAILY;
      const unit: string = 'unit1';
      const statsID: StatsID = StatsID.ofString(id1).get();
      const statsItemID: StatsItemID = StatsItemID.ofString(id2).get();
      const statsItem: StatsItem = StatsItem.of(statsItemID, StatsItemName.of(name1), StatsValues.of([StatsValue.of(statsItemID, AsOf.ofString(at1).get(), NumericalValue.of(value1))]));
      const stats: Stats = Stats.of(
        statsID,
        Language.default(),
        Region.default(),
        term,
        StatsName.of(name2),
        StatsUnit.of(unit),
        UpdatedAt.ofString(at2).get(),
        StatsItems.of([
          statsItem
        ])
      );

      expect(stats.toString()).toEqual(`${id1} ${Language.default().toString()} ${Region.default().toString()} ${term.toString()} ${name2} ${unit} ${at2}`);
    });
  });

  describe('getColumns', () => {
    it('asOfs are taken and their duplicated values are eliminated', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(),
            StatsItemName.of('stats item 1'),
            StatsValues.of([
              StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
              StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
            ])),
          StatsItem.of(
            StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(),
            StatsItemName.of('stats item 2'),
            StatsValues.of([
              StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2)),
              StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(4)),
              StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-05').get(), NumericalValue.of(6))
            ]))
        ])
      );

      const columns: AsOfs = stats.getColumns();
      expect(columns.size()).toEqual(7);
      expect(columns.get(0).get().toString()).toEqual('1999-12-31');
      expect(columns.get(1).get().toString()).toEqual('2000-01-01');
      expect(columns.get(2).get().toString()).toEqual('2000-01-02');
      expect(columns.get(3).get().toString()).toEqual('2000-01-03');
      expect(columns.get(4).get().toString()).toEqual('2000-01-04');
      expect(columns.get(5).get().toString()).toEqual('2000-01-05');
      expect(columns.get(6).get().toString()).toEqual('2000-01-06');
    });

    it('startDate is present', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
          ])),
          StatsItem.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(4)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-05').get(), NumericalValue.of(6))
          ]))
        ]),
        Some.of<AsOf>(AsOf.ofString('2000-01-08').get())
      );

      const columns: AsOfs = stats.getColumns();
      expect(columns.size()).toEqual(10);
      expect(columns.get(0).get().toString()).toEqual('1999-12-31');
      expect(columns.get(1).get().toString()).toEqual('2000-01-01');
      expect(columns.get(2).get().toString()).toEqual('2000-01-02');
      expect(columns.get(3).get().toString()).toEqual('2000-01-03');
      expect(columns.get(4).get().toString()).toEqual('2000-01-04');
      expect(columns.get(5).get().toString()).toEqual('2000-01-05');
      expect(columns.get(6).get().toString()).toEqual('2000-01-06');
      expect(columns.get(7).get().toString()).toEqual('2000-01-07');
      expect(columns.get(8).get().toString()).toEqual('2000-01-08');
      expect(columns.get(9).get().toString()).toEqual('2000-01-09');
    });

    it('no AsOfs', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
        ])
      );

      const columns: AsOfs = stats.getColumns();
      expect(columns.isEmpty()).toEqual(true);
    });
  });

  describe('getColumn', () => {
    it('properly bring the very correct AsOf', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(), Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
          ])),
          StatsItem.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(4)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-05').get(), NumericalValue.of(6))
          ]))
        ])
      );

      expect(stats.getColumn(Column.of(0).get()).get().toString()).toEqual('1999-12-31');
      expect(stats.getColumn(Column.of(1).get()).get().toString()).toEqual('2000-01-01');
      expect(stats.getColumn(Column.of(2).get()).get().toString()).toEqual('2000-01-02');
      expect(stats.getColumn(Column.of(3).get()).get().toString()).toEqual('2000-01-03');
      expect(stats.getColumn(Column.of(4).get()).get().toString()).toEqual('2000-01-04');
      expect(stats.getColumn(Column.of(5).get()).get().toString()).toEqual('2000-01-05');
      expect(stats.getColumn(Column.of(6).get()).get().toString()).toEqual('2000-01-06');
    });
  });

  describe('getRow', () => {
    const statsItem1: StatsItem = StatsItem.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([
      StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
      StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
    ]));
    const statsItem2: StatsItem = StatsItem.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.of([
      StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2)),
      StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(4)),
      StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-05').get(), NumericalValue.of(6))
    ]));

    const stats: Stats = Stats.of(
      StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
      Language.default(),
      Region.default(),
      Term.DAILY,
      StatsName.of('stats1'),
      StatsUnit.of('unit1'),
      UpdatedAt.ofString('2000-01-01 00:00:00').get(),
      StatsItems.of([
        statsItem1,
        statsItem2
      ])
    );

    expect(stats.getRow(Row.of(0).get()).get()).toEqual(statsItem1);
    expect(stats.getRow(Row.of(1).get()).get()).toEqual(statsItem2);
  });

  describe('getRowHeaders', () => {
    it('the statsItem names are taken', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
          ])),
          StatsItem.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(4)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-05').get(), NumericalValue.of(6))
          ]))
        ])
      );

      const rowHeaders: StatsItemNames = stats.getRowHeaders();
      expect(rowHeaders.size()).toEqual(2);
      expect(rowHeaders.get(0).get().get()).toEqual('stats item 1');
      expect(rowHeaders.get(1).get().get()).toEqual('stats item 2');
    });
  });

  describe('getRowHeaderSize', () => {
    it('normal case ', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
          ])),
          StatsItem.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 11'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(4)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-05').get(), NumericalValue.of(6))
          ]))
        ])
      );

      expect(stats.getRowHeaderSize().get()).toEqual('stats item 11'.length * 14);
    });

    it('gives 1 * 14 when given stats', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
        ])
      );

      expect(stats.getRowHeaderSize().get()).toEqual(1 * 14);
    });
  });

  describe('getData', () => {
    it('the matrix is made even if the value is not input', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats item 1'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
          ])),
          StatsItem.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats item 2'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(2)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(4)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-05').get(), NumericalValue.of(6))
          ]))
        ])
      );

      expect(stats.getData()).toEqual([
        ['', '1', '', '2', '', '', ''],
        ['', '2', '4', '', '', '6', '']
      ]);
    });
  });

  describe('isFilled', () => {
    it('returns true if the language, region, name, and unit are filled', () => {
      const stats1: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.default(), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats2: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats3: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.default(), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats4: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats5: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats6: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats7: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());

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
      const stats1: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.default(), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats2: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.default(), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats3: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.default(), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats4: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats5: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.default(), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats6: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.default(), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());
      const stats7: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 00:00:00').get(), StatsItems.empty());

      expect(stats1.isValid()).toEqual(false);
      expect(stats2.isValid()).toEqual(false);
      expect(stats3.isValid()).toEqual(false);
      expect(stats4.isValid()).toEqual(false);
      expect(stats5.isValid()).toEqual(false);
      expect(stats6.isValid()).toEqual(false);
      expect(stats7.isValid()).toEqual(true);
    });

    it('stats is filled but statsItems are invalid', () => {
      const stats1: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 10:10:10').get(), StatsItems.of([
        StatsItem.of(StatsItemID.ofString('4905faa8-0b6d-4032-9788-704c2703a5c9').get(), StatsItemName.default(), StatsValues.empty())
      ]));
      const stats2: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 11:11:11').get(), StatsItems.of([
        StatsItem.of(StatsItemID.ofString('4905faa8-0b6d-4032-9788-704c2703a5c9').get(), StatsItemName.of('name1'), StatsValues.empty())
      ]));

      expect(stats1.isValid()).toEqual(false);
      expect(stats2.isValid()).toEqual(true);
    });

    it('stats and their items are filled', () => {
      const stats1: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 08:08:08').get(), StatsItems.empty());
      const stats2: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 09:09:09').get(), StatsItems.of([
        StatsItem.of(StatsItemID.ofString('4905faa8-0b6d-4032-9788-704c2703a5c9').get(), StatsItemName.of('name'), StatsValues.empty())
      ]));
      const stats3: Stats = Stats.of(StatsID.ofString('62e103f0-5299-4794-883f-62b9c91583e4').get(), Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language1'), ISO639.of('ab')), Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('AFG')), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 10:10:10').get(), StatsItems.of([
        StatsItem.of(StatsItemID.ofString('4905faa8-0b6d-4032-9788-704c2703a5c9').get(), StatsItemName.of('name1'), StatsValues.empty()),
        StatsItem.of(StatsItemID.ofString('4905faa8-0b6d-4032-9788-704c2703a5c9').get(), StatsItemName.of('name2'), StatsValues.empty())
      ]));

      expect(stats1.isValid()).toEqual(true);
      expect(stats2.isValid()).toEqual(true);
      expect(stats3.isValid()).toEqual(true);
    });
  });

  describe('setData', () => {
    it('update pattern', () => {
      const stats: Stats = Stats.of(StatsID.ofString('14351289-d8ce-48cd-8ef9-ac1b356c9233').get(), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 06:06:06').get(), StatsItems.of([
        StatsItem.of(StatsItemID.ofString('bf04b0fa-ed4d-4114-84a3-c963871dfe06').get(), StatsItemName.of('item1'), StatsValues.of([
          StatsValue.of(StatsItemID.ofString('bf04b0fa-ed4d-4114-84a3-c963871dfe06').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
          StatsValue.of(StatsItemID.ofString('bf04b0fa-ed4d-4114-84a3-c963871dfe06').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(2))
        ]))
      ]));

      stats.setData(Coordinate.of(Row.of(0).get(), Column.of(2).get()), NumericalValue.of(4));

      expect(stats.getItems().get(0).get().getValues().size()).toEqual(2);
      expect(stats.getItems().get(0).get().getValues().get(0).get().getAsOf().toString()).toEqual('2000-01-01');
      expect(stats.getItems().get(0).get().getValues().get(0).get().getValue().get()).toEqual(1);
      expect(stats.getItems().get(0).get().getValues().get(1).get().getAsOf().toString()).toEqual('2000-01-02');
      expect(stats.getItems().get(0).get().getValues().get(1).get().getValue().get()).toEqual(4);
    });

    it('insert pattern', () => {
      const stats: Stats = Stats.of(StatsID.ofString('14351289-d8ce-48cd-8ef9-ac1b356c9233').get(), Language.default(), Region.default(), Term.DAILY, StatsName.of('stats1'), StatsUnit.of('unit1'), UpdatedAt.ofString('2000-01-01 05:05:05').get(), StatsItems.of([
        StatsItem.of(StatsItemID.ofString('bf04b0fa-ed4d-4114-84a3-c963871dfe06').get(), StatsItemName.of('item1'), StatsValues.of([
          StatsValue.of(StatsItemID.ofString('bf04b0fa-ed4d-4114-84a3-c963871dfe06').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
          StatsValue.of(StatsItemID.ofString('bf04b0fa-ed4d-4114-84a3-c963871dfe06').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(3))
        ]))
      ]));

      stats.setData(Coordinate.of(Row.of(0).get(), Column.of(2).get()), NumericalValue.of(2));

      expect(stats.getItems().get(0).get().getValues().size()).toEqual(3);
      expect(stats.getItems().get(0).get().getValues().get(0).get().getAsOf().toString()).toEqual('2000-01-01');
      expect(stats.getItems().get(0).get().getValues().get(0).get().getValue().get()).toEqual(1);
      expect(stats.getItems().get(0).get().getValues().get(1).get().getAsOf().toString()).toEqual('2000-01-02');
      expect(stats.getItems().get(0).get().getValues().get(1).get().getValue().get()).toEqual(2);
      expect(stats.getItems().get(0).get().getValues().get(2).get().getAsOf().toString()).toEqual('2000-01-03');
      expect(stats.getItems().get(0).get().getValues().get(2).get().getValue().get()).toEqual(3);
    });
  });

  describe('deleteData', () => {
    it('correctly deletes the specified StatsValue', () => {
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats1'), StatsValues.of([
              StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
              StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
            ])),
          StatsItem.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats2'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(12)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(13)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-04').get(), NumericalValue.of(14))
          ]))
        ])
      );

      stats.deleteData(Coordinate.of(Row.of(0).get(), Column.of(1).get()));

      const items: StatsItems = stats.getItems();
      expect(items.size()).toEqual(3);
      expect(items.get(0).get().getValues().size()).toEqual(1);
      expect(items.get(0).get().getValues().get(0).get().getAsOf().toString()).toEqual('2000-01-03');
      expect(items.get(1).get().getValues().size()).toEqual(3);
      expect(items.get(1).get().getValues().get(0).get().getAsOf().toString()).toEqual('2000-01-02');
      expect(items.get(1).get().getValues().get(1).get().getAsOf().toString()).toEqual('2000-01-03');
      expect(items.get(1).get().getValues().get(2).get().getAsOf().toString()).toEqual('2000-01-04');
      expect(items.get(2).get().getValues().size()).toEqual(0);
    });
  });

  describe('copy', () => {
    it('every properties are copied', () => {
      const statsID: StatsID = StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language'), LanguageName.of('english language'), ISO639.of('ab'));
      const region: Region = Region.of(RegionID.of(2), RegionName.of('region'), ISO3166.of('AFG'));
      const term: Term = Term.DAILY;
      const name: StatsName = StatsName.of('stats');
      const unit: StatsUnit = StatsUnit.of('unit');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 04:04:04').get();

      const stats: Stats = Stats.of(statsID, language, region, term, name, unit, updatedAt, StatsItems.empty());
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
      const stats: Stats = Stats.of(
        StatsID.ofString('f330c618-6127-46d1-ba10-a9f6af458b4c').get(),
        Language.default(),
        Region.default(),
        Term.DAILY,
        StatsName.of('stats1'),
        StatsUnit.of('unit1'),
        UpdatedAt.ofString('2000-01-01 00:00:00').get(),
        StatsItems.of([
          StatsItem.of(
            StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), StatsItemName.of('stats1'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
            StatsValue.of(StatsItemID.ofString('8f7b1783-b09c-4010-aac1-dca1292ee700').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(2))
          ])),
          StatsItem.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), StatsItemName.of('stats2'), StatsValues.of([
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(12)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-03').get(), NumericalValue.of(13)),
            StatsValue.of(StatsItemID.ofString('9e6b3c69-580c-4c19-9f3f-9bd82f582551').get(), AsOf.ofString('2000-01-04').get(), NumericalValue.of(14))
          ]))
        ])
      );

      expect(stats.getChart()).toEqual([
        {name: '1999-12-31'},
        {name: '2000-01-01', stats1: 1},
        {name: '2000-01-02', stats2: 12},
        {name: '2000-01-03', stats1: 2, stats2: 13},
        {name: '2000-01-04', stats2: 14},
        {name: '2000-01-05'}
      ]);
    });
  });

  describe('isDetermined', () => {
    it('has values , that means it already has some AsOfs', () => {
      const statsID: StatsID = StatsID.ofString('af272303-df5d-4d34-8604-398920b7d2bb').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language english name 1'), ISO639.of('lang1'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: StatsName = StatsName.of('name1');
      const unit: StatsUnit = StatsUnit.of('unit1');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 03:03:03').get();
      const items: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.ofString('c4c9d345-251b-4397-9c54-0b38dc735dee').get(), StatsItemName.of('stats1'), StatsValues.of([
          StatsValue.of(StatsItemID.ofString('c4c9d345-251b-4397-9c54-0b38dc735dee').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1))
        ])),
      ]);

      const stats: Stats = Stats.of(statsID, language, region, term, name, unit, updatedAt, items);

      expect(stats.isDetermined()).toEqual(true);
    });

    it('even if it doesn\'t have values , if startDate is set, returns true', () => {
      const statsID: StatsID = StatsID.ofString('af272303-df5d-4d34-8604-398920b7d2bb').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language english name 1'), ISO639.of('lang1'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: StatsName = StatsName.of('name1');
      const unit: StatsUnit = StatsUnit.of('unit1');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 00:00:00').get();
      const items: StatsItems = StatsItems.of([
      ]);

      const stats: Stats = Stats.of(statsID, language, region, term, name, unit, updatedAt, items, Some.of<AsOf>(AsOf.ofString('2000-01-01').get()));

      expect(stats.isDetermined()).toEqual(true);
    });

    it('returns false if stats doesn\'t have values nor startDate', () => {
      const statsID: StatsID = StatsID.ofString('af272303-df5d-4d34-8604-398920b7d2bb').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language english name 1'), ISO639.of('lang1'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: StatsName = StatsName.of('name1');
      const unit: StatsUnit = StatsUnit.of('unit1');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 00:00:00').get();
      const items: StatsItems = StatsItems.of([
      ]);

      const stats: Stats = Stats.of(statsID, language, region, term, name, unit, updatedAt, items);

      expect(stats.isDetermined()).toEqual(false);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const statsID: StatsID = StatsID.ofString('af272303-df5d-4d34-8604-398920b7d2bb').get();
      const language: Language = Language.of(LanguageID.of(1), LanguageName.of('language1'), LanguageName.of('language english name 1'), ISO639.of('lang1'));
      const region: Region = Region.of(RegionID.of(1), RegionName.of('region1'), ISO3166.of('regn1'));
      const term: Term = Term.ANNUAL;
      const name: StatsName = StatsName.of('name1');
      const unit: StatsUnit = StatsUnit.of('unit1');
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 02:02:02').get();
      const items: StatsItems = StatsItems.of([
        StatsItem.of(StatsItemID.ofString('a28eceac-0451-4339-b1c5-0c298b3905f6').get(), StatsItemName.of('stats1'), StatsValues.empty())
      ]);

      const stats: Stats = Stats.of(statsID, language, region, term, name, unit, updatedAt, items);

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

  describe('ofJSON', () => {
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      const trial: Try<Stats, StatsError> = Stats.ofJSON(json);

      expect(trial.isSuccess()).toEqual(true);
      const stats: Stats = trial.get();
      expect(stats.getStatsID().get().get()).toEqual(json.statsID);
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
      expect(stats.getUpdatedAt().toString()).toEqual(json.updatedAt);
      expect(stats.getItems().size()).toEqual(json.items.length);
      for (let i: number = 0; i < stats.getItems().size(); i++) {
        expect(stats.getItems().get(i).get().getStatsItemID().get().get()).toEqual(json.items[i].statsItemID);
        expect(stats.getItems().get(i).get().getName().get()).toEqual(json.items[i].name);
        expect(stats.getItems().get(i).get().getValues().size()).toEqual(json.items[i].values.length);
        for (let j: number = 0; j < stats.getItems().get(i).get().getValues().size(); j++) {
          expect(stats.getItems().get(i).get().getValues().get(j).get().getAsOf().toString()).toEqual(json.items[i].values[j].asOf);
          expect(stats.getItems().get(i).get().getValues().get(j).get().getValue().get()).toEqual(json.items[i].values[j].value);
        }
      }
    });
  });

  describe('ofRow', () => {
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
        updatedAt: '2000-01-01 00:00:00'
      };
      const items: Array<StatsItem> = [
        StatsItem.of(
          StatsItemID.ofString('610b532b-5711-461a-b44a-7387e8d08596').get(),
          StatsItemName.of('stats item1'),
          StatsValues.of([
            StatsValue.of(StatsItemID.ofString('610b532b-5711-461a-b44a-7387e8d08596').get(), AsOf.ofString('2000-01-01').get(), NumericalValue.of(1)),
            StatsValue.of(StatsItemID.ofString('610b532b-5711-461a-b44a-7387e8d08596').get(), AsOf.ofString('2000-01-02').get(), NumericalValue.of(2))
          ])
        ),
        StatsItem.of(
          StatsItemID.ofString('530e0e07-654f-4764-a3ac-77ce12a2a5e4').get(),
          StatsItemName.of('stats item2'),
          StatsValues.of([
          ])
        )
      ];

      const trial: Try<Stats, StatsError> = Stats.ofRow(row, StatsItems.of(items));

      expect(trial.isSuccess()).toEqual(true);
      const stats: Stats = trial.get();
      expect(stats.getStatsID().get().get()).toEqual(row.statsID);
      expect(stats.getLanguage().getLanguageID().get()).toEqual(row.languageID);
      expect(stats.getLanguage().getName().get()).toEqual(row.languageName);
      expect(stats.getLanguage().getEnglishName().get()).toEqual(row.languageEnglishName);
      expect(stats.getLanguage().getISO639().get()).toEqual(row.iso639);
      expect(stats.getRegion().getRegionID().get()).toEqual(row.regionID);
      expect(stats.getRegion().getName().get()).toEqual(row.regionName);
      expect(stats.getRegion().getISO3166().get()).toEqual(row.iso3166);
      expect(stats.getTerm().getID()).toEqual(row.termID);
      expect(stats.getName().get()).toEqual(row.name);
      expect(stats.getUnit().get()).toEqual(row.unit);
      expect(stats.getUpdatedAt().toString()).toEqual(row.updatedAt);
      expect(stats.getItems().size()).toEqual(items.length);
      for (let i: number = 0; i < items.length; i++) {
        expect(stats.getItems().get(i).get().getStatsItemID()).toEqual(items[i].getStatsItemID());
        expect(stats.getItems().get(i).get().getName()).toEqual(items[i].getName());
        expect(stats.getItems().get(i).get().getValues().size()).toEqual(items[i].getValues().size());
        for (let j: number = 0; j < stats.getItems().get(i).get().getValues().size(); j++) {
          expect(stats.getItems().get(i).get().getValues().get(j).get().getAsOf()).toEqual(items[i].getValues().get(j).get().getAsOf());
          expect(stats.getItems().get(i).get().getValues().get(j).get().getValue()).toEqual(items[i].getValues().get(j).get().getValue());
        }
      }
    });
  });

  describe('isJSON', () => {
    it('normal case', () => {
      const n: unknown = {
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(true);
    });

    it('returns false because given parameter is not an object', () => {
      expect(Stats.isJSON(null)).toEqual(false);
      expect(Stats.isJSON(undefined)).toEqual(false);
      expect(Stats.isJSON(56)).toEqual(false);
      expect(Stats.isJSON('fjafsd')).toEqual(false);
      expect(Stats.isJSON(false)).toEqual(false);
    });

    it('returns false because statsID is missing', () => {
      const n: unknown = {
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because statsID is not string', () => {
      const n: unknown = {
        statsID: false,
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because language is missing', () => {
      const n: unknown = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because language is LanguageJSON', () => {
      const n: unknown = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: true,
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false region statsID is missing', () => {
      const n: unknown = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because region is not RegionJSON', () => {
      const n: unknown = {
        statsID: '5be730f5-ec94-4685-bc84-9ae969c49406',
        language: {
          languageID: 1,
          name: 'language1',
          englishName: 'english name 1',
          iso639: 'lang1'
        },
        region: 8,
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because termID is missing', () => {
      const n: unknown = {
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because termID is not number', () => {
      const n: unknown = {
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
        termID: 'soixante',
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because name is missing', () => {
      const n: unknown = {
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because name is not string', () => {
      const n: unknown = {
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
        name: null,
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because unit is missing', () => {
      const n: unknown = {
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because unit is not string', () => {
      const n: unknown = {
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
        unit: null,
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because updatedAt is missing', () => {
      const n: unknown = {
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because updatedAt is not string', () => {
      const n: unknown = {
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
        updatedAt: 2000,
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
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because items is missing', () => {
      const n: unknown = {
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
        updatedAt: '2000-01-01 00:00:00'
      };

      expect(Stats.isJSON(n)).toEqual(false);
    });

    it('returns false because items is not array', () => {
      const n: unknown = {
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
        items: {
          c: {
            statsItemID: '04166d3c-be62-4e13-8231-e718b5b96683',
            name: 'stats item1',
            values: [
              {
                asOf: '2001-01-01',
                value: 1
              }
            ]
          },
          d: {
            statsItemID: 'd5619e72-3233-43a8-9cc8-571e53b2ff87',
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
        }
      };

      expect(Stats.isJSON(n)).toEqual(false);
    });
  });

  describe('default', () => {
    it('id will be generated, data are empty', () => {
      const stats: Stats = Stats.default();

      expect(stats.getStatsID().get().get().length).toEqual(UUID.size());
      expect(stats.getLanguage().getLanguageID().get()).toEqual(0);
      expect(stats.getRegion().getRegionID().get()).toEqual(0);
      expect(stats.getTerm()).toEqual(Term.DAILY);
      expect(stats.getName().get()).toEqual('');
      expect(stats.getUnit().get()).toEqual('');
      expect(stats.getItems().isEmpty()).toEqual(true);
      expect(stats.getStartDate().isPresent()).toEqual(false);
    });
  });
});
