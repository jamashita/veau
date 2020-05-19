import { Superposition, UUID } from 'publikum';
import sinon, { SinonSpy } from 'sinon';
import { TermIDError } from '../Error/TermIDError';
import { TermID } from '../TermID';

describe('TermID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: UUID = UUID.v4();

      const veauAccountID: TermID = TermID.of(uuid);

      expect(veauAccountID.get()).toBe(uuid);
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
      superposition.match<void>(
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
      const veauAccountID1: TermID = TermID.of(uuid1);
      const veauAccountID2: TermID = TermID.of(uuid2);
      const veauAccountID3: TermID = TermID.of(uuid1);

      expect(veauAccountID1.equals(veauAccountID1)).toBe(true);
      expect(veauAccountID1.equals(veauAccountID2)).toBe(false);
      expect(veauAccountID1.equals(veauAccountID3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const uuid: UUID = UUID.v4();
      const veauAccountID: TermID = TermID.of(uuid);

      expect(veauAccountID.toString()).toBe(uuid.toString());
    });
  });
});
