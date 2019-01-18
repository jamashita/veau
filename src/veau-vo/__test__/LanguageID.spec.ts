import 'jest';
import {LanguageID} from '../LanguageID';

describe('LanguageID', () => {
  it('equals', () => {
    const languageID1: LanguageID = LanguageID.of(1);
    const languageID2: LanguageID = LanguageID.of(2);
    const languageID3: LanguageID = LanguageID.of(1);

    expect(languageID1.equals(languageID1)).toEqual(true);
    expect(languageID1.equals(languageID2)).toEqual(false);
    expect(languageID1.equals(languageID3)).toEqual(true);
  });
});
