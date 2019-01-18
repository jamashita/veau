import 'jest';
import * as sinon from 'sinon';
import {NoSuchElementError} from '../../veau-general/Error';
import {VeauDB} from '../../veau-infrastructure/VeauDB';
import {VeauRedis} from '../../veau-infrastructure/VeauRedis';
import {ISO3166} from '../../veau-vo/ISO3166';
import {Locale} from '../../veau-vo/Locale';
import {LocaleRepository} from '../LocaleRepository';

describe('LocaleRepository', () => {
  it('all: Redis has locales', async () => {
    const stub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"name":"Afghanistan","iso3166":"AFG"},{"name":"Albania","iso3166":"ALB"}]');
    const localeRepository: LocaleRepository = LocaleRepository.getInstance();
    const locales: Array<Locale> = await localeRepository.all();

    expect(locales.length).toEqual(2);
    expect(locales[0].getISO3166().get()).toEqual('AFG');
    expect(locales[1].getISO3166().get()).toEqual('ALB');
  });

  it('all: Redis does not have locales', async () => {
    const stub1 = sinon.stub();
    VeauRedis.getString().get = stub1;
    stub1.returns(null);
    const stub2 = sinon.stub();
    VeauDB.query = stub2;
    stub2.returns([
      {
        name: 'Afghanistan',
        iso3166: 'AFG'
      },
      {
        name: 'Albania',
        iso3166: 'ALB'
      }
    ]);
    const spy = sinon.spy();
    VeauRedis.getString().set = spy;
    const localeRepository: LocaleRepository = LocaleRepository.getInstance();
    const locales: Array<Locale> = await localeRepository.all();

    expect(locales.length).toEqual(2);
    expect(locales[0].getISO3166().get()).toEqual('AFG');
    expect(locales[1].getISO3166().get()).toEqual('ALB');
    expect(spy.called).toEqual(true);
  });

  it('findByISO3166', async () => {
    const stub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"name":"Afghanistan","iso3166":"AFG"},{"name":"Albania","iso3166":"ALB"}]');
    const localeRepository: LocaleRepository = LocaleRepository.getInstance();
    const locale: Locale = await localeRepository.findByISO3166(ISO3166.of('ALB'));

    expect(locale.getName()).toEqual('Albania');
  });

  it('findByISO3166: throws error', () => {
    const stub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[]');
    const localeRepository: LocaleRepository = LocaleRepository.getInstance();

    expect(localeRepository.findByISO3166(ISO3166.of('ALB'))).rejects.toThrow(NoSuchElementError);
  });
});
