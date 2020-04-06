import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Languages } from '../../veau-vo/Languages';
import { LanguageCommand } from '../LanguageCommand';
import { LanguageCommand as LanguageRedisCommand } from '../Redis/LanguageCommand';

describe('LanguageCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageCommand1: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageCommand);
      const languageCommand2: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageCommand);

      expect(languageCommand1).toBeInstanceOf(LanguageCommand);
      expect(languageCommand1).toBe(languageCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      LanguageRedisCommand.prototype.insertAll = stub;
      stub.resolves();

      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
      ]);

      const languageCommand: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageCommand);

      try {
        await languageCommand.insertAll(languages);
      }
      catch (err) {
        fail(err);
      }
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      LanguageRedisCommand.prototype.deleteAll = stub;
      stub.resolves(Success.of<void, CacheError>(undefined));

      const languageCommand: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageCommand);
      const trial: Try<void, CacheError> = await languageCommand.deleteAll();

      expect(trial.isSuccess()).toEqual(true);
    });

    it('returns Failure, contains CacheError', async () => {
      const stub: SinonStub = sinon.stub();
      LanguageRedisCommand.prototype.deleteAll = stub;
      stub.resolves(Failure.of<void, CacheError>(new CacheError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageCommand: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageCommand);
      const trial: Try<void, CacheError> = await languageCommand.deleteAll();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
        }, (err: CacheError) => {
        expect(err).toBeInstanceOf(CacheError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
