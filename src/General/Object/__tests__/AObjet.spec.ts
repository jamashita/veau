import { Random } from '../../Random';
import { AObjet } from '../Mock/AObjet';

describe('AObjet', () => {
  describe('hashCode', () => {
    it('undefined', () => {
      expect(new AObjet<void>(undefined).hashCode()).toEqual(new AObjet<void>(undefined).hashCode());
    });

    it('null', () => {
      expect(new AObjet<null>(null).hashCode()).toEqual(new AObjet<null>(null).hashCode());
    });

    it('boolean', () => {
      expect(new AObjet<boolean>(true).hashCode()).toEqual(new AObjet<boolean>(true).hashCode());
      expect(new AObjet<boolean>(false).hashCode()).toEqual(new AObjet<boolean>(false).hashCode());
    });

    it('number', () => {
      for (let i: number = -500; i < 500; i++) {
        expect(new AObjet<number>(i).hashCode()).toEqual(new AObjet<number>(i).hashCode());
      }
    });

    it('string', () => {
      for (let i: number = 0; i < 1000; i++) {
        const str: string = Random.string(i);
        expect(new AObjet<string>(str).hashCode()).toEqual(new AObjet<string>(str).hashCode());
      }
    });

    it('object', () => {
      expect(new AObjet<object>({}).hashCode()).toEqual(new AObjet<object>({}).hashCode());
      expect(new AObjet<object>({
        a: 1000
      }).hashCode()).toEqual(new AObjet<object>({
        a: 1000
      }).hashCode());
      expect(new AObjet<object>({
        a: 1000,
        b: 'étoile'
      }).hashCode()).toEqual(new AObjet<object>({
        b: 'étoile',
        a: 1000
      }).hashCode());
      expect(new AObjet<object>({
        a: 1000,
        b: 'étoile',
        f: true
      }).hashCode()).toEqual(new AObjet<object>({
        b: 'étoile',
        a: 1000,
        f: true
      }).hashCode());
    });
  });
});
