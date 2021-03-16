import { Kind } from '@jamashita/publikum-type';
import { Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Stats } from '../../../Entity/Stats/Stats';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Language } from '../../../VO/Language/Language';
import { Locale } from '../../../VO/Locale/Locale';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { Region } from '../../../VO/Region/Region';
import { StatsName } from '../../../VO/StatsOutline/StatsName';
import { StatsUnit } from '../../../VO/StatsOutline/StatsUnit';
import { TextField } from '../Atom/TextField';

type Props = Readonly<{
  stats: Stats;
  locale: Locale;
  nameTyped(name: StatsName): void;
  unitTyped(unit: StatsUnit): void;
  iso639Selected(iso639: ISO639): void;
  iso3166Selected(iso3166: ISO3166): void;
}>;
type State = Readonly<{}>;

class StatsInformationImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      stats,
      locale
    } = this.props;

    if (!stats.same(nextProps.stats)) {
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
      <Card className='stats-info'>
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
            onKeyUp={(value: string) => {
              nameTyped(StatsName.of(value));
            }}
          />
          <TextField
            label={intl.formatMessage({
              id: 'UNIT'
            })}
            type='text'
            value={stats.getUnit().get()}
            onKeyUp={(value: string) => {
              unitTyped(StatsUnit.of(value));
            }}
          />
          <FormControl fullWidth={true}>
            <InputLabel>
              {intl.formatMessage({
                id: 'LANGUAGE'
              })}
            </InputLabel>
            <Select
              value={stats.getLanguage().getISO639().get()}
              onChange={(
                event: React.ChangeEvent<{
                  name?: string;
                  value: unknown;
                }>
              ) => {
                if (Kind.isString(event.target.value)) {
                  iso639Selected(ISO639.of(event.target.value));
                }
              }}
            >
              {locale.getLanguages().map<React.ReactNode>((language: Language) => {
                const iso639: string = language.getISO639().get();

                return (
                  <MenuItem key={iso639} value={iso639}>
                    {language.getName().get()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth={true}>
            <InputLabel>
              {intl.formatMessage({
                id: 'REGION'
              })}
            </InputLabel>
            <Select
              value={stats.getRegion().getISO3166().get()}
              onChange={(
                event: React.ChangeEvent<{
                  name?: string;
                  value: unknown;
                }>
              ) => {
                if (Kind.isString(event.target.value)) {
                  iso3166Selected(ISO3166.of(event.target.value));
                }
              }}
            >
              {locale.getRegions().map<React.ReactNode>((region: Region) => {
                const iso3166: string = region.getISO3166().get();

                return (
                  <MenuItem key={iso3166} value={iso3166}>
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
              id: stats.getTerm().getKey().get()
            })}
            disabled={true}
          />
        </CardContent>
      </Card>
    );
  }
}

export const StatsInformation: React.ComponentType<WithIntlProps<Props>> = injectIntl(
  StatsInformationImpl
);
