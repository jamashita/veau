import 'jest';
import {ISO3166} from '../ISO3166';
import {Locale} from '../Locale';
import {LocaleID} from '../LocaleID';

describe('Locale', () => {
  it('equals', () => {
    const locale1: Locale = Locale.of(LocaleID.of(1),'Afghanistan', ISO3166.of('AFG'));
    const locale2: Locale = Locale.of(LocaleID.of(2),'Albania', ISO3166.of('ALB'));
    const locale3: Locale = Locale.of(LocaleID.of(1),'Albania', ISO3166.of('ALB'));

    expect(locale1.equals(locale1)).toEqual(true);
    expect(locale1.equals(locale2)).toEqual(false);
    expect(locale1.equals(locale3)).toEqual(true);
  });

  it('toJSON', () => {
    const locale: Locale = Locale.of(LocaleID.of(1), 'Afghanistan', ISO3166.of('AFG'));

    expect(locale.toJSON()).toEqual({
      localeID: 1,
      name: 'Afghanistan',
      iso3166: 'AFG'
    });
  });
});
