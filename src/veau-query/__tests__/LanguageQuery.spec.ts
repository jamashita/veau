/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/LanguageCommand';
import { Language } from '../../veau-entity/Language';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../../veau-infrastructure/VeauRedis';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  it('allLanguages: Redis', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');
    const languageQuery: LanguageQuery = LanguageQuery.getInstance();
    const languages: Array<Language> = await languageQuery.allLanguages();

    expect(languages.length).toEqual(2);
    expect(languages[0].getLanguageID().get()).toEqual(1);
    expect(languages[0].getName()).toEqual('аҧсуа бызшәа');
    expect(languages[0].getEnglishName()).toEqual('Abkhazian');
    expect(languages[0].getISO639().get()).toEqual('ab');
    expect(languages[1].getLanguageID().get()).toEqual(2);
    expect(languages[1].getName()).toEqual('Afaraf');
    expect(languages[1].getEnglishName()).toEqual('Afar');
    expect(languages[1].getISO639().get()).toEqual('aa');
  });

  it('allLanguages: MySQL', async () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    // @ts-ignore
    stub1.resolves(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.execute = stub2;
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
    const languages: Array<Language> = await languageQuery.allLanguages();

    expect(languages.length).toEqual(2);
    expect(languages[0].getLanguageID().get()).toEqual(1);
    expect(languages[0].getName()).toEqual('аҧсуа бызшәа');
    expect(languages[0].getEnglishName()).toEqual('Abkhazian');
    expect(languages[0].getISO639().get()).toEqual('ab');
    expect(languages[1].getLanguageID().get()).toEqual(2);
    expect(languages[1].getName()).toEqual('Afaraf');
    expect(languages[1].getEnglishName()).toEqual('Afar');
    expect(languages[1].getISO639().get()).toEqual('aa');
  });

  it('findByISO639: Redis', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');
    const languageQuery: LanguageQuery = LanguageQuery.getInstance();
    const language: Language = await languageQuery.findByISO639(ISO639.of('aa'));

    expect(language.getLanguageID().get()).toEqual(2);
    expect(language.getName()).toEqual('Afaraf');
    expect(language.getEnglishName()).toEqual('Afar');
  });

  it('findByISO639: MySQL', async () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    // @ts-ignore
    stub1.resolves(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.execute = stub2;
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
    expect(language.getName()).toEqual('Afaraf');
    expect(language.getEnglishName()).toEqual('Afar');
  });

  it('findByISO639: Redis: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.resolves('[]');
    const languageQuery: LanguageQuery = LanguageQuery.getInstance();

    expect(languageQuery.findByISO639(ISO639.of('ac'))).rejects.toThrow(NoSuchElementError);
  });

  it('findByISO639: MySQL: throws error', () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    // @ts-ignore
    stub1.resolves(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.execute = stub2;
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
