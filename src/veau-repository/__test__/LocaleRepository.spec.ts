import 'jest';
import { SinonSpy, SinonStub } from 'sinon';
import * as sinon from 'sinon';
import { NoSuchElementError } from '../../veau-general/Error';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../../veau-infrastructure/VeauRedis';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Locale } from '../../veau-vo/Locale';
import { LocaleRepository } from '../LocaleRepository';

describe('LocaleRepository', () => {
  it('all: Redis has locales', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"localeID":1,"name":"Afghanistan","iso3166":"AFG"},{"localeID":2,"name":"Albania","iso3166":"ALB"}]');
    const localeRepository: LocaleRepository = LocaleRepository.getInstance();
    const locales: Array<Locale> = await localeRepository.all();

    expect(locales.length).toEqual(2);
    expect(locales[0].getLocaleID().get()).toEqual(1);
    expect(locales[0].getName()).toEqual('Afghanistan');
    expect(locales[0].getISO3166().get()).toEqual('AFG');
    expect(locales[1].getLocaleID().get()).toEqual(2);
    expect(locales[1].getName()).toEqual('Albania');
    expect(locales[1].getISO3166().get()).toEqual('ALB');
  });

  it('all: Redis does not have locales', async () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    stub1.returns(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.query = stub2;
    stub2.returns([
      {
        localeID: 1,
        name: 'Afghanistan',
        iso3166: 'AFG'
      },
      {
        localeID: 2,
        name: 'Albania',
        iso3166: 'ALB'
      }
    ]);
    const spy: SinonSpy = sinon.spy();
    VeauRedis.getString().set = spy;
    const localeRepository: LocaleRepository = LocaleRepository.getInstance();
    const locales: Array<Locale> = await localeRepository.all();

    expect(locales.length).toEqual(2);
    expect(locales[0].getLocaleID().get()).toEqual(1);
    expect(locales[0].getName()).toEqual('Afghanistan');
    expect(locales[0].getISO3166().get()).toEqual('AFG');
    expect(locales[1].getLocaleID().get()).toEqual(2);
    expect(locales[1].getName()).toEqual('Albania');
    expect(locales[1].getISO3166().get()).toEqual('ALB');
    expect(spy.called).toEqual(true);
  });

  it('findByISO3166', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"localeID":1,"name":"Afghanistan","iso3166":"AFG"},{"localeID":2,"name":"Albania","iso3166":"ALB"}]');
    const localeRepository: LocaleRepository = LocaleRepository.getInstance();
    const locale: Locale = await localeRepository.findByISO3166(ISO3166.of('ALB'));

    expect(locale.getLocaleID().get()).toEqual(2);
    expect(locale.getName()).toEqual('Albania');
  });

  it('findByISO3166: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[]');
    const localeRepository: LocaleRepository = LocaleRepository.getInstance();

    expect(localeRepository.findByISO3166(ISO3166.of('ALB'))).rejects.toThrow(NoSuchElementError);
  });
});
