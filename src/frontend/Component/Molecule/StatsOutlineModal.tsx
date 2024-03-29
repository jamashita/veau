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

import { StatsDisplay } from '../../../domain/vo/Display/StatsDisplay';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Language } from '../../../domain/vo/Language/Language';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { Region } from '../../../domain/vo/Region/Region';
import { StatsName } from '../../../domain/vo/StatsOutline/StatsName';
import { StatsUnit } from '../../../domain/vo/StatsOutline/StatsUnit';
import { Term } from '../../../domain/vo/Term/Term';
import { Terms } from '../../../domain/vo/Term/Terms';
import { TextField } from '../Atom/TextField';

type Props = Readonly<{
  open: boolean;
  stats: StatsDisplay;
  locale: Locale;
  closeNewStatsModal(): void;
  nameTyped(name: StatsName): void;
  unitTyped(unit: StatsUnit): void;
  iso639Selected(iso639: ISO639): void;
  iso3166Selected(iso3166: ISO3166): void;
  termSelected(term: Term): void;
  saveNewStats(): void;
}>;
type State = Readonly<{}>;

class StatsOutlineModalImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      open,
      stats,
      locale
    } = this.props;

    if (open !== nextProps.open) {
      return true;
    }
    if (!stats.equals(nextProps.stats)) {
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
      <Dialog open={open} onClose={closeNewStatsModal} fullWidth={true} maxWidth="md">
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
            type="text"
            value={stats.getName().get()}
            onKeyUp={(value: string) => {
              nameTyped(StatsName.of(value));
            }}
          />
          <TextField
            label={intl.formatMessage({
              id: 'UNIT'
            })}
            type="text"
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
                const iso639: string = event.target.value as string;

                iso639Selected(ISO639.of(iso639));
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
                const iso3166: string = event.target.value as string;

                iso3166Selected(ISO3166.of(iso3166));
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
          <FormControl fullWidth={true}>
            <InputLabel>
              {intl.formatMessage({
                id: 'TERM'
              })}
            </InputLabel>
            <Select
              value={stats.getTerm().getTermID()}
              onChange={(
                event: React.ChangeEvent<{
                  name?: string;
                  value: unknown;
                }>
              ) => {
                const termID: string = event.target.value as string;

                Term.ofString(termID).map<void, Error>((term: Term) => {
                  termSelected(term);
                });
              }}
            >
              {Terms.all().map<React.ReactNode>(
                (term: Term): React.ReactNode => {
                  const termID: string = term.getTermID().get().get();

                  return (
                    <MenuItem key={termID} value={termID}>
                      {intl.formatMessage({
                        id: term.getKey().get()
                      })}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={saveNewStats} disabled={!stats.isFilled()}>
            <Icon className="fas fa-check" />
            {intl.formatMessage({
              id: 'SUBMIT'
            })}
          </Button>
          <Button color="secondary" onClick={closeNewStatsModal}>
            <Icon className="fas fa-times" />
            {intl.formatMessage({
              id: 'CANCEL'
            })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsOutlineModal: React.ComponentType<WithIntlProps<Props>> = injectIntl(
  StatsOutlineModalImpl
);
