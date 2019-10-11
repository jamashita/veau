import { Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Locale } from '../../../veau-vo/aggregate/Locale';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Stats } from '../../../veau-entity/Stats';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { TextField } from '../atoms/TextField';

type Props = {
  stats: Stats;
  locale: Locale;
  nameTyped: (name: string) => void;
  unitTyped: (unit: string) => void;
  iso639Selected: (iso639: ISO639) => void;
  iso3166Selected: (iso3166: ISO3166) => void;
};
type State = {
};

class StatsInformationImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      stats,
      locale
    } = this.props;

    if (!stats.isSame(nextProps.stats)) {
      return true;
    }
    if (!locale.equals(nextProps.locale)) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      stats,
      locale,
      intl,
      nameTyped,
      unitTyped,
      iso639Selected,
      iso3166Selected
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
            value={stats.getName().get()}
            onKeyUp={nameTyped}
          />
          <TextField
            label={intl.formatMessage({
              id: 'UNIT'
            })}
            type='text'
            value={stats.getUnit().get()}
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
              onChange={(event: React.ChangeEvent<{
                name?: string;
                value: unknown;
              }>): void => {
                const iso639: string = event.target.value as string;
                iso639Selected(ISO639.of(iso639));
              }}
            >
              {locale.getLanguages().map<React.ReactNode>((language: Language): React.ReactNode => {
                const iso639: string = language.getISO639().get();

                return (
                  <MenuItem
                    key={iso639}
                    value={iso639}
                  >
                    {language.getName().get()}
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
              onChange={(event: React.ChangeEvent<{
                name?: string;
                value: unknown;
              }>): void => {
                const iso3166: string = event.target.value as string;
                iso3166Selected(ISO3166.of(iso3166));
              }}
            >
              {locale.getRegions().map<React.ReactNode>((region: Region): React.ReactNode => {
                const iso3166: string = region.getISO3166().get();

                return (
                  <MenuItem
                    key={iso3166}
                    value={iso3166}
                  >
                    {region.getName().get()}
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

export const StatsInformation: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(StatsInformationImpl);
