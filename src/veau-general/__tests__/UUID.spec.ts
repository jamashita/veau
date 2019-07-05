import 'jest';
import { UUID } from '../UUID';

describe('UUID', () => {
  describe('v4', () => {
    it('always generates 36 length string', () => {
      for (let i = 0; i < 1000; i++) {
        const v4: string = UUID.v4();
        expect(v4.length).toEqual(36);
      }
    });
  });

  describe('v5', () => {
    it('always generates 36 length string', () => {
      for (let i = 0; i < 1000; i++) {
        const v5: string = UUID.v5();
        expect(v5.length).toEqual(36);
      }
    });
  });
});
