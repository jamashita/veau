import 'jest';
import { Heap } from '../Heap';
import { HeapError } from '../HeapError';

describe('Heap', () => {
  describe('set', () => {
    it('normal case', () => {
      const heap: Heap<number> = new Heap<number>();

      heap.set(1);
      heap.set(0);
      heap.set(0.1);
      heap.set(NaN);
      heap.set(Infinity);
    });
  });

  describe('get', () => {
    it('normal case', () => {
      const heap: Heap<number> = new Heap<number>();

      let n: number = 1;
      heap.set(n);
      expect(heap.get()).toEqual(n);
      n = 0;
      heap.set(n);
      expect(heap.get()).toEqual(n);
      n = 0.1;
      heap.set(n);
      expect(heap.get()).toEqual(n);
      n = NaN;
      heap.set(n);
      expect(heap.get()).toEqual(n);
      n = Infinity;
      heap.set(n);
      expect(heap.get()).toEqual(n);
    });

    it('throws HeapError when value is not set', () => {
      const heap: Heap<number> = new Heap<number>();

      expect(() => {
        heap.get();
      }).toThrow(HeapError);
    });
  });
});
