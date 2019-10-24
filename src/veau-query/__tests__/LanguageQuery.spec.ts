import 'jest';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/LanguageCommand';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { MySQL } from '../../veau-general/MySQL/MySQL';
import { RedisString } from '../../veau-general/Redis/RedisString';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Languages } from '../../veau-vo/Languages';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: LanguageQuery = container.get<LanguageQuery>(TYPE.LanguageQuery);
      const languageQuery2: LanguageQuery = container.get<LanguageQuery>(TYPE.LanguageQuery);

      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('Redis returns languages', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');

      const languageQuery: LanguageQuery = container.get<LanguageQuery>(TYPE.LanguageQuery);
      const languages: Languages = await languageQuery.all();

      expect(languages.size()).toEqual(2);
      expect(languages.get(0).getLanguageID().get()).toEqual(1);
      expect(languages.get(0).getName().get()).toEqual('аҧсуа бызшәа');
      expect(languages.get(0).getEnglishName().get()).toEqual('Abkhazian');
      expect(languages.get(0).getISO639().get()).toEqual('ab');
      expect(languages.get(1).getLanguageID().get()).toEqual(2);
      expect(languages.get(1).getName().get()).toEqual('Afaraf');
      expect(languages.get(1).getEnglishName().get()).toEqual('Afar');
      expect(languages.get(1).getISO639().get()).toEqual('aa');
    });

    it('MySQL returns languages', async () => {
      const stub1: SinonStub = sinon.stub();
      RedisString.prototype.get = stub1;
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub2;
      stub2.resolves([
        {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: 2,
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ]);
      const stub3: SinonStub = sinon.stub();
      LanguageCommand.prototype.insertAll = stub3;
      stub3.resolves();

      const languageQuery: LanguageQuery = container.get<LanguageQuery>(TYPE.LanguageQuery);
      const languages: Languages = await languageQuery.all();

      expect(languages.size()).toEqual(2);
      expect(languages.get(0).getLanguageID().get()).toEqual(1);
      expect(languages.get(0).getName().get()).toEqual('аҧсуа бызшәа');
      expect(languages.get(0).getEnglishName().get()).toEqual('Abkhazian');
      expect(languages.get(0).getISO639().get()).toEqual('ab');
      expect(languages.get(1).getLanguageID().get()).toEqual(2);
      expect(languages.get(1).getName().get()).toEqual('Afaraf');
      expect(languages.get(1).getEnglishName().get()).toEqual('Afar');
      expect(languages.get(1).getISO639().get()).toEqual('aa');
    });
  });

  describe('findByISO639', () => {
    it('Redis returns a language', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');

      const languageQuery: LanguageQuery = container.get<LanguageQuery>(TYPE.LanguageQuery);
      const language: Language = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(language.getLanguageID().get()).toEqual(2);
      expect(language.getName().get()).toEqual('Afaraf');
      expect(language.getEnglishName().get()).toEqual('Afar');
    });

    it('MySQL returns a language', async () => {
      const stub1: SinonStub = sinon.stub();
      RedisString.prototype.get = stub1;
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub2;
      stub2.resolves([
        {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: 2,
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ]);
      const stub3: SinonStub = sinon.stub();
      LanguageCommand.prototype.insertAll = stub3;
      stub3.resolves();

      const languageQuery: LanguageQuery = container.get<LanguageQuery>(TYPE.LanguageQuery);
      const language: Language = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(language.getLanguageID().get()).toEqual(2);
      expect(language.getName().get()).toEqual('Afaraf');
      expect(language.getEnglishName().get()).toEqual('Afar');
    });

    it('Redis throws error', async () => {
      const stub: SinonStub = sinon.stub();
      RedisString.prototype.get = stub;
      stub.resolves('[]');

      const languageQuery: LanguageQuery = container.get<LanguageQuery>(TYPE.LanguageQuery);

      await expect(languageQuery.findByISO639(ISO639.of('ac'))).rejects.toThrow(NoSuchElementError);
    });

    it('MySQL throws error', async () => {
      const stub1: SinonStub = sinon.stub();
      RedisString.prototype.get = stub1;
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      MySQL.prototype.execute = stub2;
      stub2.resolves([
        {
          languageID: 1,
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: 2,
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ]);
      const stub3: SinonStub = sinon.stub();
      LanguageCommand.prototype.insertAll = stub3;
      stub3.resolves();

      const languageQuery: LanguageQuery = container.get<LanguageQuery>(TYPE.LanguageQuery);

      await expect(languageQuery.findByISO639(ISO639.of('ac'))).rejects.toThrow(NoSuchElementError);
    });
  });
});
