import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, Icon,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import * as React from 'react';
import {injectIntl, InjectedIntlProps} from 'react-intl';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { TermRepository } from '../../../veau-repository/TermRepository';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Term } from '../../../veau-vo/Term';
import { I18NLabel } from '../atoms/I18NLabel';
import { TextField } from '../atoms/TextField';

type Props = {
  open: boolean;
  newStatsOverview: StatsOverview;
  languages: Array<Language>;
  regions: Array<Region>;
  closeNewStatsModal: () => void;
  nameTyped: (name: string) => void;
  iso639Selected: (iso639: ISO639) => void;
  iso3166Selected: (iso3166: ISO3166) => void;
  termSelected: (term: Term) => void;
  saveNewStats: () => void;
};
type State = {
};

const termRepository: TermRepository = TermRepository.getInstance();

class StatsOverviewModalImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      open,
      newStatsOverview,
      languages,
      regions,
      intl
    } = this.props;

    return (
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
              {languages.map<React.ReactNode>((language: Language) => {
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
              {regions.map<React.ReactNode>((region: Region) => {
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
    );
  }
}

export const StatsOverviewModal: React.ComponentClass<Props, State> = injectIntl(StatsOverviewModalImpl);
