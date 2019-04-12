import { Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Stats } from '../../../veau-entity/Stats';
import { LocaleQuery } from '../../../veau-query/LocaleQuery';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { TextField } from '../atoms/TextField';

type Props = {
  stats: Stats;
  localeQuery: LocaleQuery;
  nameTyped: (name: string) => void;
  unitTyped: (unit: string) => void;
  languageSelected: (language: Language) => void;
  regionSelected: (region: Region) => void;
};
type State = {
};

class StatsInformationImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      stats,
      localeQuery
    } = this.props;

    if (stats.getName() !== nextProps.stats.getName()) {
      return true;
    }
    if (stats.getUnit() !== nextProps.stats.getUnit()) {
      return true;
    }
    if (!stats.getLanguage().equals(nextProps.stats.getLanguage())) {
      return true;
    }
    if (!stats.getRegion().equals(nextProps.stats.getRegion())) {
      return true;
    }
    if (localeQuery !== nextProps.localeQuery) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      stats,
      localeQuery,
      intl,
      nameTyped,
      unitTyped,
      languageSelected,
      regionSelected
    } = this.props;

    return (
      <Card
        className='stats-info'
      >
        <CardHeader
          title={intl.formatMessage({
            id: 'STATS_INFO'
          })}
        />
        <CardContent>
          <TextField
            label={intl.formatMessage({
              id: 'NAME'
            })}
            type='text'
            value={stats.getName()}
            onKeyUp={nameTyped}
          />
          <TextField
            label={intl.formatMessage({
              id: 'UNIT'
            })}
            type='text'
            value={stats.getUnit()}
            onKeyUp={unitTyped}
          />
          <FormControl
            fullWidth={true}
          >
            <InputLabel>
              {intl.formatMessage({
                id: 'LANGUAGE'
              })}
            </InputLabel>
            <Select
              value={stats.getLanguage().getISO639().get()}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                const iso639: string = event.target.value;
                const language: Language = localeQuery.findByISO639(ISO639.of(iso639));
                languageSelected(language);
              }}
            >
              {localeQuery.allLanguages().map<React.ReactNode>((language: Language) => {
                const iso639: string = language.getISO639().get();

                return (
                  <MenuItem
                    key={iso639}
                    value={iso639}
                  >
                    {language.getName()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            fullWidth={true}
          >
            <InputLabel>
              {intl.formatMessage({
                id: 'REGION'
              })}
            </InputLabel>
            <Select
              value={stats.getRegion().getISO3166().get()}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                const iso3166: string = event.target.value;
                const region: Region = localeQuery.findByISO3166(ISO3166.of(iso3166));
                regionSelected(region);
              }}
            >
              {localeQuery.allRegions().map<React.ReactNode>((region: Region) => {
                const iso3166: string = region.getISO3166().get();

                return (
                  <MenuItem
                    key={iso3166}
                    value={iso3166}
                  >
                    {region.getName()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            label={intl.formatMessage({
              id: 'TERM'
            })}
            type='text'
            value={intl.formatMessage({
              id: stats.getTerm().getKey()
            })}
            disabled={true}
          />
        </CardContent>
      </Card>
    );
  }
}

export const StatsInformation: React.ComponentClass<Props, State> = injectIntl(StatsInformationImpl);
