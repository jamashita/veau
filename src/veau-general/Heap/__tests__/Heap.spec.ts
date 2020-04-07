import 'jest';
import { Heap } from '../Heap';
import { HeapError } from '../HeapError';

describe('Heap', () => {
  describe('set', () => {
    it('normal case', () => {
      const heap: Heap = new Heap();

      const identifier: symbol = Symbol('test');

      heap.set(identifier, 1);
      heap.set(identifier, 0);
      heap.set(identifier, 0.1);
      heap.set(identifier, NaN);
      heap.set(identifier, Infinity);
    });
  });

  describe('get', () => {
    it('normal case', () => {
      const heap: Heap = new Heap();
      const identifier1: symbol = Symbol('test');
      const identifier2: symbol = Symbol('test');
      const identifier3: symbol = Symbol('test');
      const identifier4: symbol = Symbol('test');
      const identifier5: symbol = Symbol('test');

      let n: number = 1;
      heap.set(identifier1, n);
      expect(heap.get<number>(identifier1)).toEqual(n);
      n = 0;
      heap.set(identifier2, n);
      expect(heap.get<number>(identifier2)).toEqual(n);
      n = 0.1;
      heap.set(identifier3, n);
      expect(heap.get<number>(identifier3)).toEqual(n);
      n = NaN;
      heap.set(identifier4, n);
      expect(heap.get<number>(identifier4)).toEqual(n);
      n = Infinity;
      heap.set(identifier5, n);
      expect(heap.get<number>(identifier5)).toEqual(n);
    });

    it('only retains the last one', () => {
      const heap: Heap = new Heap();
      const identifier1: symbol = Symbol('test');

      let n: number = 1;
      heap.set(identifier1, n);
      expect(heap.get<number>(identifier1)).toEqual(n);
      n = 0;
      heap.set(identifier1, n);
      expect(heap.get<number>(identifier1)).toEqual(n);
    });

    it('throws HeapError when value is not set', () => {
      const heap: Heap = new Heap();
      const identifier: symbol = Symbol('test');

      expect(() => {
        heap.get<number>(identifier);
      }).toThrow(HeapError);
    });
  });
});
