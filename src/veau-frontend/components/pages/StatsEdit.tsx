import { HotTable } from '@handsontable/react';
import {
  Button,
  Card,
  CardContent,
  CardHeader, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';
import { I18NLabel } from '../atoms/I18NLabel';
import { TextField } from '../atoms/TextField';

type State = {
};

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
      statsItem,
      localeRepository,
      open,
      intl
    } = this.props;

    return (
      <Authenticated>
        <div
          className='stats-items-edit'
        >
          <div>
            CHART COMES HERE
          </div>
          <HotTable
            settings={{
              data: stats.getData(),
              colHeaders: stats.getColumn(),
              rowHeaders: stats.getRow(),
              manualRowResize: true,
              manualColumnResize: true,
              rowHeaderWidth: stats.getRowHeaderSize(),
              autoColumnSize: true,
              beforeChange: (changes: Array<Array<any>> | null): boolean => {
                if (!changes) {
                  return false;
                }
                const length: number = changes.length;
                for (let i: number = 0; i < length; i++) {
                  const str: string = changes[i][VALUE_INDEX];

                  if (isNaN(Number(str))) {
                    return false;
                  }
                }

                return true;
              },
              afterChange: (changes: Array<Array<any>> | null): void => {
                if (!changes) {
                  return;
                }
                const length: number = changes.length;
                for (let i: number = 0; i < length; i++) {
                  const str: string = changes[i][VALUE_INDEX];
                  const row: number = changes[i][ROW_INDEX];
                  const column: number = changes[i][COLUMN_INDEX];

                  if (str === '') {
                    this.props.dataDeleted(row, column);
                    continue;
                  }

                  const value: number = Number(str);
                  this.props.dataFilled(row, column, value);
                }
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
              onKeyUp={this.props.nameTyped}
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
            <Button
              color='primary'
              fullWidth={true}
              onClick={this.props.newItemButtonClicked}
            >
              <Icon
                className='fas fa-plus-square'
              />
              {intl.formatMessage({
                id: 'ADD_NEW_ITEM'
              })}
            </Button>
          </CardContent>
        </Card>
        <Dialog
          open={open}
          onClose={this.props.closeNewItemModal}
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle>
            {intl.formatMessage({
              id: 'CREATE_NEW_ITEM'
            })}
          </DialogTitle>
          <DialogContent>
            <TextField
              label={intl.formatMessage({
                id: 'NAME'
              })}
              type='text'
              value={statsItem.getName()}
              onKeyUp={this.props.itemNameTyped}
            />
            <TextField
              label={intl.formatMessage({
                id: 'UNIT'
              })}
              type='text'
              value={statsItem.getUnit()}
              onKeyUp={this.props.itemUnitTyped}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color='secondary'
              onClick={this.props.saveNewItem}
              disabled={!statsItem.isFilled()}
            >
              <Icon className='fas fa-check' />
              <I18NLabel
                id='SUBMIT'
              />
            </Button>
            <Button
              color='secondary'
              onClick={this.props.closeNewItemModal}
            >
              <Icon className='fas fa-times' />
              <I18NLabel
                id='CANCEL'
              />
            </Button>
          </DialogActions>
        </Dialog>
      </Authenticated>
    );
  }
}

export const StatsEdit: React.ComponentClass<Props, State> = injectIntl(StatsEditImpl);
