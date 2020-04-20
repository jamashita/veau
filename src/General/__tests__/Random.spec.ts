import { Random } from '../Random';

describe('Random', () => {
  describe('string', () => {
    it('length is fixed', () => {
      const length: number = 10;
      for (let i: number = 0; i < 10000; i++) {
        expect(Random.string(length).length).toBe(length);
      }
    });
  });

  describe('integer', () => {
    it('value is over min and under max', () => {
      const min: number = 0;
      const max: number = 100;
      for (let i: number = 0; i < 10000; i++) {
        const value: number = Random.integer(min, max);

        expect(value <= max).toBe(true);
        expect(min <= value).toBe(true);
      }
    });
  });
});
