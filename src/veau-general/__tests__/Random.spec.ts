/* tslint:disable */
import 'jest';
import { Random } from '../Random';

describe('Random', () => {
  describe('string', () => {
    it('length is fixed', () => {
      const length = 10;
      for (let i = 0; i < 10000; i++) {
        const str: string = Random.string(length);
        expect(str.length).toEqual(length);
      }
    });
  });

  describe('integer', () => {
    it('value is over min and under max', () => {
      const min = 0;
      const max = 100;
      for (let i = 0; i < 10000; i++) {
        const value: number = Random.integer(min, max);

        expect(value <= max).toEqual(true);
        expect(min <= value).toEqual(true);
      }
    });
  });

  describe('v4', () => {
    it('always generates 36 length string', () => {
      for (let i = 0; i < 1000; i++) {
        const v4: string = Random.v4();
        expect(v4.length).toEqual(36);
      }
    });
  });

  describe('v5', () => {
    it('always generates 36 length string', () => {
      for (let i = 0; i < 1000; i++) {
        const v5: string = Random.v5();
        expect(v5.length).toEqual(36);
      }
    });
  });
});
