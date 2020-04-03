import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { StatsIDError } from '../../veau-error/StatsIDError';
import { Try } from '../../veau-general/Try/Try';
import { UUID } from '../../veau-general/UUID';
import { StatsID } from '../StatsID';

describe('StatsID', () => {
  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
      const uuid2: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
      const statsID1: Try<StatsID, StatsIDError> = StatsID.of(uuid1);
      const statsID2: Try<StatsID, StatsIDError> = StatsID.of(uuid2);
      const statsID3: Try<StatsID, StatsIDError> = StatsID.of(uuid1);

      expect(statsID1.get().equals(statsID1.get())).toEqual(true);
      expect(statsID1.get().equals(statsID2.get())).toEqual(false);
      expect(statsID1.get().equals(statsID3.get())).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
      const statsID: Try<StatsID, StatsIDError> = StatsID.of(uuid);

      expect(statsID.get().toString()).toEqual(uuid);
    });
  });

  describe('of', () => {
    it('normal case', () => {
      const uuid1: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
      const statsID: Try<StatsID, StatsIDError> = StatsID.of(uuid1);

      expect(statsID.isSuccess()).toEqual(true);
    });

    it('throws StatsIDError when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsID: Try<StatsID, StatsIDError> = StatsID.of('trois');

      expect(statsID.isFailure()).toEqual(true);
      statsID.match<void>(() => {
        spy1();
      }, (e: StatsIDError) => {
        spy2();
        expect(e).toBeInstanceOf(StatsIDError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
