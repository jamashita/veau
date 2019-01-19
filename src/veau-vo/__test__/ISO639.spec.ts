import 'jest';
import { ISO639 } from '../ISO639';

describe('ISO639', () => {
  it('equals', () => {
    const iso6391: ISO639 = ISO639.of('ab');
    const iso6392: ISO639 = ISO639.of('aa');
    const iso6393: ISO639 = ISO639.of('ab');

    expect(iso6391.equals(iso6391)).toEqual(true);
    expect(iso6391.equals(iso6392)).toEqual(false);
    expect(iso6391.equals(iso6393)).toEqual(true);
  });
});
