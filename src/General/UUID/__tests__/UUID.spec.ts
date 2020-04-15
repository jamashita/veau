import { UUID } from '../UUID';
import { UUIDError } from '../UUIDError';

describe('UUID', () => {
  describe('of', () => {
    it('normal case', () => {
      const uuid: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      expect(UUID.of(uuid).get()).toEqual(uuid);
    });

    it('throws UUIDError when the argument is not satisfied UUID format', () => {
      expect(() => {
        UUID.of('cinq');
      }).toThrow(UUIDError);
    });
  });

  describe('v4', () => {
    it('always generates 36 length string', () => {
      for (let i: number = 0; i < 100; i++) {
        const v4: UUID = UUID.v4();
        expect(v4.get().length).toEqual(UUID.size());
      }
    });
  });

  describe('v5', () => {
    it('always generates 36 length string', () => {
      for (let i: number = 0; i < 100; i++) {
        const v5: UUID = UUID.v5();
        expect(v5.get().length).toEqual(UUID.size());
      }
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const uuid1: UUID = UUID.of('998106de-b2e7-4981-9643-22cd30cd74de');
      const uuid2: UUID = UUID.of('ee49aef0-b515-4fd8-9c4b-5ad9740ef4f9');
      const uuid3: UUID = UUID.of('998106de-b2e7-4981-9643-22cd30cd74de');

      expect(uuid1.equals(uuid1)).toEqual(true);
      expect(uuid1.equals(uuid2)).toEqual(false);
      expect(uuid1.equals(uuid3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const id: string = '998106de-b2e7-4981-9643-22cd30cd74de';
      const uuid: UUID = UUID.of(id);

      expect(uuid.get().toString()).toEqual(id);
    });
  });
});
