import sinon, { SinonSpy } from 'sinon';

import { Superposition } from '@jamashita/publikum-monad';
import { UUID } from '@jamashita/publikum-uuid';

import { TermIDError } from '../Error/TermIDError';
import { TermID } from '../TermID';

describe('TermID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const termID: TermID = TermID.of(uuid);

      expect(termID.get()).toBe(uuid);
    });
  });

  describe('ofString', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const superposition: Superposition<TermID, TermIDError> = TermID.ofString(uuid.get());

      expect(superposition.isAlive()).toBe(true);
    });

    it('returns Dead when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<TermID, TermIDError> = TermID.ofString('cinq');

      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: TermIDError) => {
          spy2();
          expect(err).toBeInstanceOf(TermIDError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.v4();
      const uuid2: UUID = UUID.v4();
      const termID1: TermID = TermID.of(uuid1);
      const termID2: TermID = TermID.of(uuid2);
      const termID3: TermID = TermID.of(uuid1);

      expect(termID1.equals(termID1)).toBe(true);
      expect(termID1.equals(termID2)).toBe(false);
      expect(termID1.equals(termID3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const termID: TermID = TermID.of(uuid);

      expect(termID.toString()).toBe(uuid.toString());
    });
  });
});
