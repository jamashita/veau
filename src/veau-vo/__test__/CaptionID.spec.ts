/* tslint:disable */
import 'jest';
import { CaptionID } from '../CaptionID';
import { UUID } from '../UUID';

describe('CaptionID', () => {
  it('equals', () => {
    const uuid1: string = 'db9c9de2-1fc6-4072-8348-b8894239b2b0';
    const uuid2: string = 'b5203963-d996-40a7-9adb-f05ea9524af0';
    const captionID1: CaptionID = CaptionID.of(UUID.of(uuid1));
    const captionID2: CaptionID = CaptionID.of(UUID.of(uuid2));
    const captionID3: CaptionID = CaptionID.of(UUID.of(uuid1));

    expect(captionID1.equals(captionID1)).toEqual(true);
    expect(captionID1.equals(captionID2)).toEqual(false);
    expect(captionID1.equals(captionID3)).toEqual(true);
  });
});
