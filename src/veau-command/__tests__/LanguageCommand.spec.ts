import 'jest';
import sinon, { SinonStub } from 'sinon';
import { CacheError } from '../../veau-error/CacheError';
import { Redis } from '../../veau-general/Redis/Redis';
import { RedisString } from '../../veau-general/Redis/RedisString';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Languages } from '../../veau-vo/Languages';
import { LanguageCommand } from '../LanguageCommand';

describe('LanguageCommand', () => {
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

      const languageCommand: LanguageCommand = LanguageCommand.getInstance();
      await languageCommand.insertAll(languages);

      expect(stub1.withArgs('LANGUAGES', '[{"languageID":1,"name":"language 1","englishName":"english 1","iso639":"aa"}]').called).toEqual(true);
      expect(stub2.withArgs('LANGUAGES', 3 * 60 * 60).called).toEqual(true);
    });
  });

  describe('deleteAll', () => {
    it('normal case', () => {
      const stub: SinonStub = sinon.stub();
      Redis.prototype.delete = stub;
      stub.resolves(true);

      const languageCommand: LanguageCommand = LanguageCommand.getInstance();

      expect(languageCommand.deleteAll()).rejects.not.toThrow(CacheError);
      expect(stub.withArgs('LANGUAGES').called).toEqual(true);
    });

    it('throws error', async () => {
      const stub: SinonStub = sinon.stub();
      Redis.prototype.delete = stub;
      stub.resolves(false);

      const languageCommand: LanguageCommand = LanguageCommand.getInstance();

      await expect(languageCommand.deleteAll()).rejects.toThrow(CacheError);
    });
  });
});
