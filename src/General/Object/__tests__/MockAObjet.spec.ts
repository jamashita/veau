import { Random } from '../../Random';
import { MockAObjet } from '../Mock/MockAObjet';

describe('MockAObjet', () => {
  describe('hashCode', () => {
    it('undefined', () => {
      expect(new MockAObjet<void>(undefined).hashCode()).toBe(new MockAObjet<void>(undefined).hashCode());
    });

    it('null', () => {
      expect(new MockAObjet<null>(null).hashCode()).toBe(new MockAObjet<null>(null).hashCode());
    });

    it('boolean', () => {
      expect(new MockAObjet<boolean>(true).hashCode()).toBe(new MockAObjet<boolean>(true).hashCode());
      expect(new MockAObjet<boolean>(false).hashCode()).toBe(new MockAObjet<boolean>(false).hashCode());
    });

    it('number', () => {
      for (let i: number = -500; i < 500; i++) {
        expect(new MockAObjet<number>(i).hashCode()).toBe(new MockAObjet<number>(i).hashCode());
      }
    });

    it('string', () => {
      for (let i: number = 0; i < 1000; i++) {
        const str: string = Random.string(i);
        expect(new MockAObjet<string>(str).hashCode()).toBe(new MockAObjet<string>(str).hashCode());
      }
    });

    it('object', () => {
      expect(new MockAObjet<object>({}).hashCode()).toBe(new MockAObjet<object>({}).hashCode());
      expect(new MockAObjet<object>({
        a: 1000
      }).hashCode()).toBe(new MockAObjet<object>({
        a: 1000
      }).hashCode());
      expect(new MockAObjet<object>({
        a: 1000,
        b: 'étoile'
      }).hashCode()).toBe(new MockAObjet<object>({
        b: 'étoile',
        a: 1000
      }).hashCode());
      expect(new MockAObjet<object>({
        a: 1000,
        b: 'étoile',
        f: true
      }).hashCode()).toBe(new MockAObjet<object>({
        b: 'étoile',
        a: 1000,
        f: true
      }).hashCode());
    });
  });
});
