import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { OffsetError } from '../Error/OffsetError';
import { PageError } from '../Error/PageError';
import { Limit } from '../Limit';
import { Offset } from '../Offset';
import { Page } from '../Page';

describe('Page', () => {
  describe('min', () => {
    it('always returns 1', () => {
      expect(Page.min().get()).toBe(1);
    });

    it('returns singleton instance', () => {
      expect(Page.min()).toBe(Page.min());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 1', async () => {
      const superposition1: Superposition<Page, PageError> = Page.of(0);
      const superposition2: Superposition<Page, PageError> = Page.of(-1);
      const schrodinger1: Schrodinger<Page, PageError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Page, PageError> = await superposition2.terminate();

      expect(schrodinger1.isDead()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(PageError);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(PageError);
    });

    it('returns Alive and its value is Page.min() when the argument 1', async () => {
      const superposition: Superposition<Page, PageError> = Page.of(1);
      const schrodinger: Schrodinger<Page, PageError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Page.min());
    });

    it('returns Dead when the argument is not integer', async () => {
      const superposition1: Superposition<Page, PageError> = Page.of(0.1);
      const superposition2: Superposition<Page, PageError> = Page.of(1.5);
      const schrodinger1: Schrodinger<Page, PageError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Page, PageError> = await superposition2.terminate();

      expect(schrodinger1.isDead()).toBe(true);
      expect(() => {
        schrodinger1.get();
      }).toThrow(PageError);
      expect(schrodinger2.isDead()).toBe(true);
      expect(() => {
        schrodinger2.get();
      }).toThrow(PageError);
    });

    it('normal case', async () => {
      const page1: number = 1;
      const page2: number = 4;
      const superposition1: Superposition<Page, PageError> = Page.of(page1);
      const superposition2: Superposition<Page, PageError> = Page.of(page2);
      const schrodinger1: Schrodinger<Page, PageError> = await superposition1.terminate();
      const schrodinger2: Schrodinger<Page, PageError> = await superposition2.terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger2.isAlive()).toBe(true);

      expect(schrodinger1.get().get()).toBe(page1);
      expect(schrodinger2.get().get()).toBe(page2);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', async () => {
      const page1: Page = await Page.of(1).get();
      const page2: Page = await Page.of(2).get();
      const page3: Page = await Page.of(1).get();

      expect(page1.equals(page1)).toBe(true);
      expect(page1.equals(page2)).toBe(false);
      expect(page1.equals(page3)).toBe(true);
    });
  });

  describe('getLimit', () => {
    it('always generates the same amount of limit', async () => {
      for (let i: number = 1; i <= 10; i++) {
        // eslint-disable-next-line no-await-in-loop
        const page: Page = await Page.of(i).get();
        const limit: Limit = page.getLimit();

        expect(limit.get()).toBe(40);
      }
    });
  });

  describe('getOffset', () => {
    it('depends the argument which generated Offset is', async () => {
      const page1: Page = await Page.of(1).get();
      const page2: Page = await Page.of(2).get();

      const schrodinger1: Schrodinger<Offset, OffsetError> = await page1.getOffset().terminate();
      const schrodinger2: Schrodinger<Offset, OffsetError> = await page2.getOffset().terminate();

      expect(schrodinger1.isAlive()).toBe(true);
      expect(schrodinger1.get().get()).toBe(0);
      expect(schrodinger2.isAlive()).toBe(true);
      expect(schrodinger2.get().get()).toBe(40);
    });
  });

  describe('toString', () => {
    it('normal case', async () => {
      const num: number = 2;
      const page: Page = await Page.of(num).get();

      expect(page.toString()).toBe(num.toString());
    });
  });
});
