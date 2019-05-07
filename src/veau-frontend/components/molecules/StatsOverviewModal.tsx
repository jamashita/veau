import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Language } from '@/veau-entity/Language';
import { Region } from '@/veau-entity/Region';
import { Stats } from '@/veau-entity/Stats';
import { Term } from '@/veau-enum/Term';
import { ISO3166 } from '@/veau-vo/ISO3166';
import { ISO639 } from '@/veau-vo/ISO639';
import { TextField } from '../atoms/TextField';

type Props = {
  open: boolean;
  stats: Stats;
  languages: Array<Language>;
  regions: Array<Region>;
  closeNewStatsModal: () => void;
  nameTyped: (name: string) => void;
  unitTyped: (unit: string) => void;
  iso639Selected: (iso639: ISO639) => void;
  iso3166Selected: (iso3166: ISO3166) => void;
  termSelected: (term: Term) => void;
  saveNewStats: () => void;
};
type State = {
};

class StatsOverviewModalImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      open,
      stats,
      languages,
      regions
    } = this.props;

    if (open !== nextProps.open) {
      return true;
    }
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
    if (stats.getTerm() !== nextProps.stats.getTerm()) {
      return true;
    }
    if (languages.length !== nextProps.languages.length) {
      return true;
    }
    if (regions.length !== nextProps.regions.length) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      open,
      stats,
      languages,
      regions,
      intl,
      closeNewStatsModal,
      nameTyped,
      unitTyped,
      iso639Selected,
      iso3166Selected,
      termSelected,
      saveNewStats
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={closeNewStatsModal}
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
                iso639Selected(ISO639.of(iso639));
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
              value={stats.getRegion().getISO3166().get()}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                const iso3166: string = event.target.value;
                iso3166Selected(ISO3166.of(iso3166));
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
              value={stats.getTerm().getID()}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                const termID: number = Number(event.target.value);
                termSelected(Term.of(termID));
              }}
            >
              {Term.all().map<React.ReactNode>((term: Term) => {
                const termID: number = term.getID();

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
            onClick={saveNewStats}
            disabled={!stats.isFilled()}
          >
            <Icon
              className='fas fa-check'
            />
            {intl.formatMessage({
              id: 'SUBMIT'
            })}
          </Button>
          <Button
            color='secondary'
            onClick={closeNewStatsModal}
          >
            <Icon
              className='fas fa-times'
            />
            {intl.formatMessage({
              id: 'CANCEL'
            })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsOverviewModal: React.ComponentClass<Props, State> = injectIntl(StatsOverviewModalImpl);
