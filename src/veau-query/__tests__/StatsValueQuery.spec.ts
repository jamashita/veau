import 'jest';
import sinon, { SinonStub } from 'sinon';
import { veauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { StatsValues } from '../../veau-vo/collection/StatsValues';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsValueQuery } from '../StatsValueQuery';

describe('StatsValueQuery', () => {
  describe('findByStatsID', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      veauMySQL.execute = stub;
      stub.onCall(0).resolves([
        {
          statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
          asOf: '2000-01-01',
          value: 1
        },
        {
          statsItemID: '5318ad74-f15f-4835-9fd7-890be4cce933',
          asOf: '2001-01-01',
          value: 11
        },
        {
          statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
          asOf: '2000-01-02',
          value: 2
        },
        {
          statsItemID: '5318ad74-f15f-4835-9fd7-890be4cce933',
          asOf: '2001-01-02',
          value: 12
        },
        {
          statsItemID: '98d1e9b5-6b18-44de-b615-d8016f49977d',
          asOf: '2000-01-03',
          value: 3
        }
      ]);

      const statsValueQuery: StatsValueQuery = StatsValueQuery.getInstance();
      const values: Map<string, StatsValues> = await statsValueQuery.findByStatsID(StatsID.of('d4703058-a6ff-420b-95b2-4475beba9027'));

      const year2001: StatsValues | undefined = values.get('5318ad74-f15f-4835-9fd7-890be4cce933');

      expect(year2001!.length()).toEqual(2);
      expect(year2001!.get(0).getAsOfAsString()).toEqual('2001-01-01');
      expect(year2001!.get(0).getValue()).toEqual(11);
      expect(year2001!.get(1).getAsOfAsString()).toEqual('2001-01-02');
      expect(year2001!.get(1).getValue()).toEqual(12);

      const year2000: StatsValues | undefined = values.get('98d1e9b5-6b18-44de-b615-d8016f49977d');

      expect(year2000!.length()).toEqual(3);
      expect(year2000!.get(0).getAsOfAsString()).toEqual('2000-01-01');
      expect(year2000!.get(0).getValue()).toEqual(1);
      expect(year2000!.get(1).getAsOfAsString()).toEqual('2000-01-02');
      expect(year2000!.get(1).getValue()).toEqual(2);
      expect(year2000!.get(2).getAsOfAsString()).toEqual('2000-01-03');
      expect(year2000!.get(2).getValue()).toEqual(3);
    });
  });
});
