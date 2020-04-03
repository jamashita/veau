import 'jest';
import { Failure } from '../Failure';
import { Success } from '../Success';
import { Try } from '../Try';
import { TryFilter } from '../TryFilter';

describe('TryFilter', () => {
  describe('isSuccess', () => {
    it('normal case', () => {
      const success: Try<string, Error> = Success.of<string, Error>('información');
      const failure: Try<string, Error> = Failure.of<string, Error>(new Error('canción'));

      expect(TryFilter.isSuccess(success)).toEqual(true);
      expect(TryFilter.isSuccess(failure)).toEqual(false);
    });
  });

  describe('isFailure', () => {
    it('normal case', () => {
      const success: Try<string, Error> = Success.of<string, Error>('información');
      const failure: Try<string, Error> = Failure.of<string, Error>(new Error('canción'));

      expect(TryFilter.isFailure(success)).toEqual(false);
      expect(TryFilter.isFailure(failure)).toEqual(true);
    });
  });
});
