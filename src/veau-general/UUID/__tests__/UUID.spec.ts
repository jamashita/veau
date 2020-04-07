import sinon, { SinonSpy } from 'sinon';
import { UUID } from '../UUID';

describe('UUID', () => {
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

  describe('of', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      try {
        UUID.of('998106de-b2e7-4981-9643-22cd30cd74de');
        spy1();
      }
      catch (err) {
        spy2();
      }

      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(false);
    });

    it('returns Failure when uuid length string is not given', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      try {
        UUID.of('cinq');
        spy1();
      }
      catch (err) {
        spy2();
      }

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('v4', () => {
    it('always generates 36 length string', () => {
      for (let i: number = 0; i < 1000; i++) {
        const v4: UUID = UUID.v4();
        expect(v4.get().length).toEqual(UUID.size());
      }
    });
  });

  describe('v5', () => {
    it('always generates 36 length string', () => {
      for (let i: number = 0; i < 1000; i++) {
        const v5: UUID = UUID.v5();
        expect(v5.get().length).toEqual(UUID.size());
      }
    });
  });
});
