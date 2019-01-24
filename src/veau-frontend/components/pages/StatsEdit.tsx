import { HotTable } from '@handsontable/react';
import { Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { TermRepository } from '../../../veau-repository/TermRepository';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Term } from '../../../veau-vo/Term';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';
import { TextField } from '../atoms/TextField';

type State = {
};

const termRepository: TermRepository = TermRepository.getInstance();

const ROW_INDEX: number = 0;
const COLUMN_INDEX: number = 1;
const VALUE_INDEX: number = 3;

export class StatsEditImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      stats,
      localeRepository,
      intl
    } = this.props;

    return (
      <Authenticated>
        <div
          className='stats-items-edit'
        >
          <HotTable
            settings={{
              data: stats.getDataMatrix(),
              colHeaders: stats.getColumn(),
              rowHeaders: stats.getRow(),
              manualRowResize: true,
              manualColumnResize: true,
              beforeChange: (changes: Array<Array<any>> | null): boolean => {
                if (changes) {
                  const length: number = changes.length;
                  for (let i: number = 0; i < length; i++) {
                    const str: string = changes[i][VALUE_INDEX];
                    if (str === '') {
                      return false;
                    }

                    const value: number = Number(str);
                    if (isNaN(value)) {
                      return false;
                    }

                    this.props.dataFilled(changes[i][ROW_INDEX], changes[i][COLUMN_INDEX], value);
                  }
                }
                return true;
              }
            }}
          />
        </div>
        <Card
          className='stats-edit'
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
                  const language: Language = localeRepository.findByISO639(ISO639.of(iso639));
                  this.props.languageSelected(language);
                }}
              >
                {localeRepository.allLanguages().map<React.ReactNode>((language: Language) => {
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
                  const region: Region = localeRepository.findByISO3166(ISO3166.of(iso3166));
                  this.props.regionSelected(region);
                }}
              >
                {localeRepository.allRegions().map<React.ReactNode>((region: Region) => {
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
            <FormControl
              fullWidth={true}
            >
              <InputLabel>
                {intl.formatMessage({
                  id: 'TERM'
                })}
              </InputLabel>
              <Select
                value={stats.getTerm().get()}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                  const termID: number = Number(event.target.value);
                  this.props.termSelected(Term.of(termID));
                }}
              >
                {termRepository.all().map<React.ReactNode>((term: Term) => {
                  const termID: number = term.get();

                  return (
                    <MenuItem
                      key={termID}
                      value={termID}
                    >
                      {intl.formatMessage({
                        id: term.getKey()
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Authenticated>
    );
  }
}

export const StatsEdit: React.ComponentClass<Props, State> = injectIntl(StatsEditImpl);
