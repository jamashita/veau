import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Stats } from '../../../veau-entity/Stats';
import { StatsID } from '../../../veau-vo/StatsID';

type Props = {
  statsOverviews: Array<Stats>;
  toStatsEdit: (statsID: StatsID) => void;
};
type State = {
};

class StatsOverviewListTableImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      statsOverviews
    } = this.props;

    if (statsOverviews.length !== nextProps.statsOverviews.length) {
      return true;
    }
    for (let i: number = 0; i < statsOverviews.length; i++) {
      if (statsOverviews[i].getName() !== nextProps.statsOverviews[i].getName()) {
        return true;
      }
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      statsOverviews,
      intl,
      toStatsEdit
    } = this.props;

    return (
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
                id: 'UNIT'
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
          {statsOverviews.map<React.ReactNode>((stats: Stats) => {
            return (
              <TableRow
                key={stats.getStatsID().get().get()}
                hover={true}
                onClick={(): void => {
                  toStatsEdit(stats.getStatsID());
                }}
              >
                <TableCell>{stats.getName()}</TableCell>
                <TableCell>{stats.getUnit()}</TableCell>
                <TableCell>{stats.getLanguage().getName()}</TableCell>
                <TableCell>{stats.getRegion().getName()}</TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: stats.getTerm().getKey()
                  })}
                </TableCell>
                <TableCell>{stats.getUpdatedAtAsString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export const StatsOverviewListTable: React.ComponentClass<Props, State> = injectIntl(StatsOverviewListTableImpl);
