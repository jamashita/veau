import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { Props } from '../../containers/pages/StatsList';
import { Authenticated } from '../../containers/templates/Authenticated';
import { I18NLabel } from '../atoms/I18NLabel';
import { TextField } from '../atoms/TextField';

type State = {
};

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
    if (newStatsOverview !== nextProps.newStatsOverview) {
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
          <Icon className='fa fa-plus-circle' />
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
        >
          <DialogTitle>
            {intl.formatMessage({
              id: 'CREATE_NEW_STATS'
            })}
          </DialogTitle>
          <DialogContent>
            <TextField
              label={intl.formatMessage({
                id: 'STATS_NAME'
              })}
              type='text'
              value={newStatsOverview.getName()}
              onKeyUp={this.props.nameTyped}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color='secondary'
              onClick={this.props.closeNewStatsModal}
            >
              <Icon className='fa fa-times' />
              <I18NLabel
                id='CLOSE'
              />
            </Button>
          </DialogActions>
        </Dialog>
      </Authenticated>
    );
  }
}

export const StatsList: React.ComponentClass<Props, State> = injectIntl(StatsListImpl);
