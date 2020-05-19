import 'reflect-metadata';

import { AJAXError, Alive, DataSourceError, Dead, Superposition } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { IdentityError } from '../../../VO/Identity/Error/IdentityError';
import { RegionError } from '../../../VO/Region/Error/RegionError';
import { VeauAccountError } from '../../../VO/VeauAccount/Error/VeauAccountError';
import { Identity } from '../../../VO/Identity/Identity';
import { LanguageError } from '../../../VO/Language/Error/LanguageError';
import { Language } from '../../../VO/Language/Language';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockAccountName } from '../../../VO/Account/Mock/MockAccountName';
import { MockEntranceInformation } from '../../../VO/EntranceInformation/Mock/MockEntranceInformation';
import { MockVeauAccount } from '../../../VO/VeauAccount/Mock/MockVeauAccount';
import { MockVeauAccountID } from '../../../VO/VeauAccount/Mock/MockVeauAccountID';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { Region } from '../../../VO/Region/Region';
import { VeauAccount } from '../../../VO/VeauAccount/VeauAccount';
import { MockLanguageQuery } from '../../Mock/MockLanguageQuery';
import { MockRegionQuery } from '../../Mock/MockRegionQuery';
import { MockVeauAccountQuery } from '../../Mock/MockVeauAccountQuery';
import { IdentityQuery } from '../IdentityQuery';

describe('IdentityQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const identityQuery1: IdentityQuery = vault.get<IdentityQuery>(Type.IdentityVaultQuery);
      const identityQuery2: IdentityQuery = vault.get<IdentityQuery>(Type.IdentityVaultQuery);

      expect(identityQuery1).toBeInstanceOf(IdentityQuery);
      expect(identityQuery1).toBe(identityQuery2);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const account: MockAccountName = new MockAccountName();
      const veauAccount: MockVeauAccount = new MockVeauAccount({
        veauAccountID,
        account
      });
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.find = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Alive.of<Language, DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Alive.of<Region, DataSourceError>(region));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<Identity, IdentityError | DataSourceError> = await identityQuery.find();

      expect(superposition.isAlive()).toBe(true);
      const identity: Identity = superposition.get();
      expect(identity.getVeauAccountID()).toBe(veauAccountID);
      expect(identity.getAccountName()).toBe(account);
      expect(identity.getLanguage()).toBe(language);
      expect(identity.getRegion()).toBe(region);
    });

    it('returns Dead when VeauAccountQuery returns Dead VeauAccountError', async () => {
      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.find = stub1;
      stub1.resolves(Dead.of<VeauAccount, VeauAccountError>(new VeauAccountError('test failed')));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<Identity, IdentityError | DataSourceError> = await identityQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(IdentityError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when VeauAccountQuery returns Dead AJAXError', async () => {
      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.find = stub1;
      stub1.resolves(Dead.of<VeauAccount, AJAXError>(new AJAXError('test failed', 500)));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<Identity, IdentityError | DataSourceError> = await identityQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when LanguageQuery returns Dead LanguageError', async () => {
      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.find = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Dead.of<Language, LanguageError>(new LanguageError('test faield')));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Alive.of<Region, DataSourceError>(region));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<Identity, IdentityError | DataSourceError> = await identityQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(IdentityError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when LanguageQuery returns Dead AJAXError', async () => {
      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.find = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Dead.of<Language, AJAXError>(new AJAXError('test faield', 500)));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Alive.of<Region, DataSourceError>(region));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<Identity, IdentityError | DataSourceError> = await identityQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when RegionQuery returns Dead RegionError', async () => {
      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const language: MockLanguage = new MockLanguage();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.find = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Alive.of<Language, DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Dead.of<Region, RegionError>(new RegionError('test failed')));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<Identity, IdentityError | DataSourceError> = await identityQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(IdentityError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when RegionQuery returns Dead AJAXError', async () => {
      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const language: MockLanguage = new MockLanguage();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.find = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Alive.of<Language, DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Dead.of<Region, AJAXError>(new AJAXError('test failed', 500)));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<Identity, IdentityError | DataSourceError> = await identityQuery.find();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByEntranceInfo', () => {
    it('normal case', async () => {
      const veauAccountID: MockVeauAccountID = new MockVeauAccountID();
      const account: MockAccountName = new MockAccountName();
      const veauAccount: MockVeauAccount = new MockVeauAccount({
        veauAccountID,
        account
      });
      const language: MockLanguage = new MockLanguage();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Alive.of<Language, DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Alive.of<Region, DataSourceError>(region));

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Identity,
        IdentityError | DataSourceError
      > = await identityQuery.findByEntranceInfo(new MockEntranceInformation());

      expect(superposition.isAlive()).toBe(true);
      const identity: Identity = superposition.get();
      expect(identity.getVeauAccountID()).toBe(veauAccountID);
      expect(identity.getAccountName()).toBe(account);
      expect(identity.getLanguage()).toBe(language);
      expect(identity.getRegion()).toBe(region);
    });

    it('returns Dead when VeauAccountQuery returns Dead VeauAccountError', async () => {
      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.resolves(Dead.of<VeauAccount, VeauAccountError>(new VeauAccountError('test failed')));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Identity,
        IdentityError | DataSourceError
      > = await identityQuery.findByEntranceInfo(new MockEntranceInformation());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(IdentityError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when VeauAccountQuery returns Dead AJAXError', async () => {
      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.resolves(Dead.of<VeauAccount, AJAXError>(new AJAXError('test failed', 500)));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const regionQuery: MockRegionQuery = new MockRegionQuery();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Identity,
        IdentityError | DataSourceError
      > = await identityQuery.findByEntranceInfo(new MockEntranceInformation());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when LanguageQuery returns Dead LanguageError', async () => {
      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Dead.of<Language, LanguageError>(new LanguageError('test faield')));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Alive.of<Region, DataSourceError>(region));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Identity,
        IdentityError | DataSourceError
      > = await identityQuery.findByEntranceInfo(new MockEntranceInformation());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(IdentityError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when LanguageQuery returns Dead AJAXError', async () => {
      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const region: MockRegion = new MockRegion();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Dead.of<Language, AJAXError>(new AJAXError('test faield', 500)));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Alive.of<Region, DataSourceError>(region));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Identity,
        IdentityError | DataSourceError
      > = await identityQuery.findByEntranceInfo(new MockEntranceInformation());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when RegionQuery returns Dead RegionError', async () => {
      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const language: MockLanguage = new MockLanguage();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Alive.of<Language, DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Dead.of<Region, RegionError>(new RegionError('test failed')));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Identity,
        IdentityError | DataSourceError
      > = await identityQuery.findByEntranceInfo(new MockEntranceInformation());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(IdentityError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead when RegionQuery returns Dead AJAXError', async () => {
      const veauAccount: MockVeauAccount = new MockVeauAccount();
      const language: MockLanguage = new MockLanguage();

      const veauAccountQuery: MockVeauAccountQuery = new MockVeauAccountQuery();
      const stub1: SinonStub = sinon.stub();
      veauAccountQuery.findByEntranceInfo = stub1;
      stub1.resolves(Alive.of<VeauAccount, DataSourceError>(veauAccount));
      const languageQuery: MockLanguageQuery = new MockLanguageQuery();
      const stub2: SinonStub = sinon.stub();
      languageQuery.find = stub2;
      stub2.resolves(Alive.of<Language, DataSourceError>(language));
      const regionQuery: MockRegionQuery = new MockRegionQuery();
      const stub3: SinonStub = sinon.stub();
      regionQuery.find = stub3;
      stub3.resolves(Dead.of<Region, AJAXError>(new AJAXError('test failed', 500)));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const identityQuery: IdentityQuery = new IdentityQuery(veauAccountQuery, languageQuery, regionQuery);
      const superposition: Superposition<
        Identity,
        IdentityError | DataSourceError
      > = await identityQuery.findByEntranceInfo(new MockEntranceInformation());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: IdentityError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
