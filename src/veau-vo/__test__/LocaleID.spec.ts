/* tslint:disable */
import 'jest';
import { LocaleID } from '../LocaleID';

describe('LocaleID', () => {
  it('equals', () => {
    const localeID1: LocaleID = LocaleID.of(1);
    const localeID2: LocaleID = LocaleID.of(2);
    const localeID3: LocaleID = LocaleID.of(1);

    expect(localeID1.equals(localeID1)).toEqual(true);
    expect(localeID1.equals(localeID2)).toEqual(false);
    expect(localeID1.equals(localeID3)).toEqual(true);
  });
});
