/* tslint:disable */
import 'jest';
import { LanguageIdentifier } from '../LanguageIdentifier';

describe('LanguageIdentifier', () => {
  it('in case of supporting language, returns that language', () => {
    expect(LanguageIdentifier.toISO639('ja-JP')).toEqual('ja');
    expect(LanguageIdentifier.toISO639('en-US')).toEqual('en');
    expect(LanguageIdentifier.toISO639('en-GB')).toEqual('en');
    expect(LanguageIdentifier.toISO639('fr')).toEqual('fr');
    expect(LanguageIdentifier.toISO639('es-ES')).toEqual('es');
  });

  it('in case of not supporting language, returns en', () => {
    expect(LanguageIdentifier.toISO639('ru-MI')).toEqual('en');
    expect(LanguageIdentifier.toISO639('sr')).toEqual('en');
  });
});
