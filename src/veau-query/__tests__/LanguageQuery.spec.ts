import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/LanguageCommand';
import { Languages } from '../../veau-entity/collection/Languages';
import { Language } from '../../veau-entity/Language';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { veauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { veauRedis } from '../../veau-infrastructure/VeauRedis';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('all', () => {
    it('Redis returns languages', async () => {
      const stub: SinonStub = sinon.stub();
      veauRedis.getString().get = stub;
      stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');

      const languageQuery: LanguageQuery = LanguageQuery.getInstance();
      const languages: Languages = await languageQuery.all();

      expect(languages.length()).toEqual(2);
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
      veauRedis.getString().get = stub1;
      // @ts-ignore
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      veauMySQL.execute = stub2;
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

      const languageQuery: LanguageQuery = LanguageQuery.getInstance();
      const languages: Languages = await languageQuery.all();

      expect(languages.length()).toEqual(2);
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
      veauRedis.getString().get = stub;
      stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');

      const languageQuery: LanguageQuery = LanguageQuery.getInstance();
      const language: Language = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(language.getLanguageID().get()).toEqual(2);
      expect(language.getName().get()).toEqual('Afaraf');
      expect(language.getEnglishName().get()).toEqual('Afar');
    });

    it('MySQL returns a language', async () => {
      const stub1: SinonStub = sinon.stub();
      veauRedis.getString().get = stub1;
      // @ts-ignore
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      veauMySQL.execute = stub2;
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

      const languageQuery: LanguageQuery = LanguageQuery.getInstance();
      const language: Language = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(language.getLanguageID().get()).toEqual(2);
      expect(language.getName().get()).toEqual('Afaraf');
      expect(language.getEnglishName().get()).toEqual('Afar');
    });

    it('Redis throws error', () => {
      const stub: SinonStub = sinon.stub();
      veauRedis.getString().get = stub;
      stub.resolves('[]');

      const languageQuery: LanguageQuery = LanguageQuery.getInstance();

      expect(languageQuery.findByISO639(ISO639.of('ac'))).rejects.toThrow(NoSuchElementError);
    });

    it('MySQL throws error', () => {
      const stub1: SinonStub = sinon.stub();
      veauRedis.getString().get = stub1;
      // @ts-ignore
      stub1.resolves(null);
      const stub2: SinonStub = sinon.stub();
      veauMySQL.execute = stub2;
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

      const languageQuery: LanguageQuery = LanguageQuery.getInstance();

      expect(languageQuery.findByISO639(ISO639.of('ac'))).rejects.toThrow(NoSuchElementError);
    });
  });
});
