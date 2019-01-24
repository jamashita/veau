import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle, FormControl,
  Icon, InputLabel, MenuItem, Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { TermRepository } from '../../../veau-repository/TermRepository';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Term } from '../../../veau-vo/Term';
import { Props } from '../../containers/pages/StatsList';
import { Authenticated } from '../../containers/templates/Authenticated';
import { I18NLabel } from '../atoms/I18NLabel';
import { TextField } from '../atoms/TextField';

type State = {
};

const termRepository: TermRepository = TermRepository.getInstance();

class StatsListImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      statsOverviews,
      localeRepository,
      open,
      newStatsOverview
    } = this.props;

    const length: number = statsOverviews.length;
    if (length !== nextProps.statsOverviews.length) {
      return true;
    }
    for (let i: number = 0; i < length; i++) {
      if (!statsOverviews[i].equals(nextProps.statsOverviews[i])) {
        return true;
      }
    }
    if (localeRepository !== nextProps.localeRepository) {
      return true;
    }
    if (open !== nextProps.open) {
      return true;
    }
    if (newStatsOverview.getName() !== nextProps.newStatsOverview.getName()) {
      return true;
    }
    if (!newStatsOverview.getISO639().equals(nextProps.newStatsOverview.getISO639())) {
      return true;
    }
    if (!newStatsOverview.getISO3166().equals(nextProps.newStatsOverview.getISO3166())) {
      return true;
    }
    if (!newStatsOverview.getTerm().equals(nextProps.newStatsOverview.getTerm())) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      statsOverviews,
      localeRepository,
      open,
      newStatsOverview,
      intl
    } = this.props;

    return (
      <Authenticated>
        <Button
          variant='contained'
          color='primary'
          onClick={this.props.newStatsClicked}
        >
          <Icon className='fas fa-plus-circle' />
          {intl.formatMessage({
            id: 'CREATE_NEW_STATS'
          })}
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {intl.formatMessage({
                  id: 'NAME'
                })}
              </TableCell>
              <TableCell>
                {intl.formatMessage({
                  id: 'LANGUAGE'
                })}
              </TableCell>
              <TableCell>
                {intl.formatMessage({
                  id: 'REGION'
                })}
              </TableCell>
              <TableCell>
                {intl.formatMessage({
                  id: 'TERM'
                })}
              </TableCell>
              <TableCell>
                {intl.formatMessage({
                  id: 'UPDATED_AT'
                })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statsOverviews.map<React.ReactNode>((statsOverview: StatsOverview) => {

              try {
                const language: Language = localeRepository.findByISO639(statsOverview.getISO639());
                const region: Region = localeRepository.findByISO3166(statsOverview.getISO3166());

                return (
                  <TableRow
                    key={statsOverview.getStatsID().get().get()}
                    hover={true}
                    onClick={(): void => {
                      this.props.toStatsEdit(statsOverview.getStatsID());
                    }}
                  >
                    <TableCell>{statsOverview.getName()}</TableCell>
                    <TableCell>{language.getName()}</TableCell>
                    <TableCell>{region.getName()}</TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: statsOverview.getTerm().getKey()
                      })}
                    </TableCell>
                    <TableCell>{statsOverview.getUpdatedAtAsString()}</TableCell>
                  </TableRow>
                );
              }
              catch (err) {
                return (
                  <TableRow
                    key={statsOverview.getStatsID().get().get()}
                    hover={true}
                    onClick={(): void => {
                      this.props.toStatsEdit(statsOverview.getStatsID());
                    }}
                  >
                    <TableCell>{statsOverview.getName()}</TableCell>
                    <TableCell>{statsOverview.getISO639().get()}</TableCell>
                    <TableCell>{statsOverview.getISO3166().get()}</TableCell>
                    <TableCell>
                      {intl.formatMessage({
                        id: statsOverview.getTerm().getKey()
                      })}
                    </TableCell>
                    <TableCell>{statsOverview.getUpdatedAtAsString()}</TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
        <Dialog
          open={open}
          onClose={this.props.closeNewStatsModal}
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle>
            {intl.formatMessage({
              id: 'CREATE_NEW_STATS'
            })}
          </DialogTitle>
          <DialogContent>
            <TextField
              label={intl.formatMessage({
                id: 'NAME'
              })}
              type='text'
              value={newStatsOverview.getName()}
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
                value={newStatsOverview.getISO639().get()}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                  const iso639: string = event.target.value;
                  this.props.iso639Selected(ISO639.of(iso639));
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
                value={newStatsOverview.getISO3166().get()}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                  const iso3166: string = event.target.value;
                  this.props.iso3166Selected(ISO3166.of(iso3166));
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
                value={newStatsOverview.getTerm().get()}
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
          </DialogContent>
          <DialogActions>
            <Button
              color='secondary'
              onClick={this.props.saveNewStats}
              disabled={!newStatsOverview.isFilled()}
            >
              <Icon className='fas fa-check' />
              <I18NLabel
                id='SUBMIT'
              />
            </Button>
            <Button
              color='secondary'
              onClick={this.props.closeNewStatsModal}
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

export const StatsList: React.ComponentClass<Props, State> = injectIntl(StatsListImpl);
