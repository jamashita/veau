import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
import { UUID } from '../../veau-general/UUID';
import { StatsID } from '../StatsID';

describe('StatsID', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
      const uuid2: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
      const statsID1: StatsID = StatsID.of(uuid1);
      const statsID2: StatsID = StatsID.of(uuid2);
      const statsID3: StatsID = StatsID.of(uuid1);

      expect(statsID1.equals(statsID1)).toEqual(true);
      expect(statsID1.equals(statsID2)).toEqual(false);
      expect(statsID1.equals(statsID3)).toEqual(true);
    });
  });

  describe('of', () => {
    it('noraml case', () => {
      expect(() => {
        const uuid1: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
        StatsID.of(uuid1);
      }).not.toThrow(RuntimeError);
    });

    it('throws RuntimeError when uuid length string is not given', () => {
      expect(() => {
        StatsID.of('trois');
      }).toThrow(RuntimeError);
    });
  });

  describe('generate', () => {
    it('always gives UUID length string', () => {
      for (let i: number = 0; i < 100; i++) {
        expect(StatsID.generate().get().length).toEqual(UUID.size());
      }
    });
  });
});
