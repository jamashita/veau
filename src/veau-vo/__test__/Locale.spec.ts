import 'jest';
import {ISO3166} from '../ISO3166';
import {Locale} from '../Locale';

describe('Locale', () => {
  it('equals', () => {
    const locale1: Locale = new Locale('Afghanistan', new ISO3166('AFG'));
    const locale2: Locale = new Locale('Albania', new ISO3166('ALB'));
    const locale3: Locale = new Locale('Albania', new ISO3166('AFG'));

    expect(locale1.equals(locale1)).toEqual(true);
    expect(locale1.equals(locale2)).toEqual(false);
    expect(locale1.equals(locale3)).toEqual(true);
  });

  it('toJSON', () => {
    const locale: Locale = new Locale('Afghanistan', new ISO3166('AFG'));

    expect(locale.toJSON()).toEqual({
      name: 'Afghanistan',
      iso3166: 'AFG'
    });
  });
});
