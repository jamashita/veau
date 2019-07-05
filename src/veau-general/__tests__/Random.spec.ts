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
});
