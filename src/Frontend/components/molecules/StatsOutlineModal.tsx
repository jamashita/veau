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
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Stats } from '../../../Entity/Stats';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { Locale } from '../../../VO/Locale';
import { Region } from '../../../VO/Region';
import { StatsName } from '../../../VO/StatsName';
import { StatsUnit } from '../../../VO/StatsUnit';
import { Term } from '../../../VO/Term';
import { Terms } from '../../../VO/Terms';
import { TextField } from '../atoms/TextField';

type Props = Readonly<{
  open: boolean;
  stats: Stats;
  locale: Locale;
  closeNewStatsModal: () => void;
  nameTyped: (name: StatsName) => void;
  unitTyped: (unit: StatsUnit) => void;
  iso639Selected: (iso639: ISO639) => void;
  iso3166Selected: (iso3166: ISO3166) => void;
  termSelected: (term: Term) => void;
  saveNewStats: () => void;
}>;
type State = Readonly<{
}>;

class StatsOutlineModalImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      open,
      stats,
      locale
    } = this.props;

    if (open !== nextProps.open) {
      return true;
    }
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
      open,
      stats,
      locale,
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
              }>) => {
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
              }>) => {
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
              onChange={(event: React.ChangeEvent<{
                name?: string;
                value: unknown;
              }>) => {
                const termID: number = Number(event.target.value as string);

                Term.of(termID).match<void>((term: Term) => {
                  termSelected(term);
                }, () => {
                  // NOOP
                });
              }}
            >
              {Terms.all().map<React.ReactNode>((term: Term): React.ReactNode => {
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

export const StatsOutlineModal: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(StatsOutlineModalImpl);
