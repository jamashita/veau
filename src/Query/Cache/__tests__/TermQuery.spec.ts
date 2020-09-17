import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger } from '@jamashita/publikum-monad';
import 'reflect-metadata';
import { TermError } from '../../../VO/Term/Error/TermError';
import { Terms } from '../../../VO/Term/Terms';
import { TermQuery } from '../TermQuery';

describe('TermQuery', () => {
  // TODO
  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('container', () => {
  // eslint-disable-next-line jest/no-commented-out-tests
  //   it('must be a singleton', () => {
  //     const termQuery1: TermQuery = v.get<TermQuery>(Type.TermCacheQuery);
  //     const termQuery2: TermQuery = v.get<TermQuery>(Type.TermCacheQuery);
  //
  //     expect(termQuery1).toBeInstanceOf(TermQuery);
  //     expect(termQuery1).toBe(termQuery2);
  //   });
  // });

  describe('all', () => {
    it('returns singleton Terms', async () => {
      expect.assertions(2);

      const termQuery: TermQuery = new TermQuery();
      const schrodinger: Schrodinger<Terms, TermError | DataSourceError> = await termQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(Terms.all());
    });
  });
});
