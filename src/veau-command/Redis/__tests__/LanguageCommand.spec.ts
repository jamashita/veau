import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { kernel } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { CacheError } from '../../../veau-error/CacheError';
import { Redis } from '../../../veau-general/Redis/Redis';
import { RedisString } from '../../../veau-general/Redis/RedisString';
import { Try } from '../../../veau-general/Try/Try';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { LanguageID } from '../../../veau-vo/LanguageID';
import { LanguageName } from '../../../veau-vo/LanguageName';
import { Languages } from '../../../veau-vo/Languages';
import { LanguageCommand } from '../LanguageCommand';

describe('LanguageCommand', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageCommand1: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageRedisCommand);
      const languageCommand2: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageRedisCommand);

      expect(languageCommand1).toBeInstanceOf(LanguageCommand);
      expect(languageCommand1).toBe(languageCommand2);
    });
  });

  describe('insertAll', () => {
    it('normal case', async () => {
      const stub1: SinonStub = sinon.stub();
      RedisString.prototype.set = stub1;
      stub1.resolves();
      const stub2: SinonStub = sinon.stub();
      Redis.prototype.expires = stub2;
      stub2.resolves();

      const languages: Languages = Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('language 1'), LanguageName.of('english 1'), ISO639.of('aa'))
      ]);

      const languageCommand: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageRedisCommand);
      await languageCommand.insertAll(languages);

      expect(stub1.withArgs('LANGUAGES', '[{"languageID":1,"name":"language 1","englishName":"english 1","iso639":"aa"}]').called).toEqual(true);
      expect(stub2.withArgs('LANGUAGES', 3 * 60 * 60).called).toEqual(true);
    });
  });

  describe('deleteAll', () => {
    it('normal case', async () => {
      const stub: SinonStub = sinon.stub();
      Redis.prototype.delete = stub;
      stub.resolves(true);

      const languageCommand: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageRedisCommand);
      const trial: Try<void, CacheError> = await languageCommand.deleteAll();

      expect(trial.isSuccess()).toEqual(true);
      expect(stub.withArgs('LANGUAGES').called).toEqual(true);
    });

    it('throws CacheError', async () => {
      const stub: SinonStub = sinon.stub();
      Redis.prototype.delete = stub;
      stub.resolves(false);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageCommand: LanguageCommand = kernel.get<LanguageCommand>(TYPE.LanguageRedisCommand);
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
