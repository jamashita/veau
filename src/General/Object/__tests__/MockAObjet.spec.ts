import { Random } from '../../Random';
import { MockAObjet } from '../Mock/MockAObjet';

describe('MockAObjet', () => {
  describe('hashCode', () => {
    it('undefined', () => {
      expect(new MockAObjet<void>(undefined).hashCode()).toEqual(new MockAObjet<void>(undefined).hashCode());
    });

    it('null', () => {
      expect(new MockAObjet<null>(null).hashCode()).toEqual(new MockAObjet<null>(null).hashCode());
    });

    it('boolean', () => {
      expect(new MockAObjet<boolean>(true).hashCode()).toEqual(new MockAObjet<boolean>(true).hashCode());
      expect(new MockAObjet<boolean>(false).hashCode()).toEqual(new MockAObjet<boolean>(false).hashCode());
    });

    it('number', () => {
      for (let i: number = -500; i < 500; i++) {
        expect(new MockAObjet<number>(i).hashCode()).toEqual(new MockAObjet<number>(i).hashCode());
      }
    });

    it('string', () => {
      for (let i: number = 0; i < 1000; i++) {
        const str: string = Random.string(i);
        expect(new MockAObjet<string>(str).hashCode()).toEqual(new MockAObjet<string>(str).hashCode());
      }
    });

    it('object', () => {
      expect(new MockAObjet<object>({}).hashCode()).toEqual(new MockAObjet<object>({}).hashCode());
      expect(new MockAObjet<object>({
        a: 1000
      }).hashCode()).toEqual(new MockAObjet<object>({
        a: 1000
      }).hashCode());
      expect(new MockAObjet<object>({
        a: 1000,
        b: 'étoile'
      }).hashCode()).toEqual(new MockAObjet<object>({
        b: 'étoile',
        a: 1000
      }).hashCode());
      expect(new MockAObjet<object>({
        a: 1000,
        b: 'étoile',
        f: true
      }).hashCode()).toEqual(new MockAObjet<object>({
        b: 'étoile',
        a: 1000,
        f: true
      }).hashCode());
    });
  });
});
