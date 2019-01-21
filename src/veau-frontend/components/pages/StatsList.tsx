import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { ISO3166 } from '../../../veau-vo/ISO3166';
import { ISO639 } from '../../../veau-vo/ISO639';
import { Props } from '../../containers/pages/StatsList';
import { Authenticated } from '../../containers/templates/Authenticated';

type State = {
};

class StatsListImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      statsOverviews,
      // languages,
      // regions,
      intl
    } = this.props;

    return (
      <Authenticated>
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
                  id: 'UPDATED_AT'
                })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statsOverviews.map<React.ReactNode>((statsOverview: StatsOverview) => {
              const iso639: ISO639 = statsOverview.getISO639();
              const iso3166: ISO3166 = statsOverview.getISO3166();
              return (
                <TableRow
                  key={statsOverview.getStatsID().get().get()}
                  hover={true}
                  onClick={(): void => {
                    this.props.toEditStats(statsOverview.getStatsID());
                  }}
                >
                  <TableCell>{statsOverview.getName()}</TableCell>
                  <TableCell>{iso639.get()}</TableCell>
                  <TableCell>{iso3166.get()}</TableCell>
                  <TableCell>{statsOverview.getUpdatedAtAsString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Authenticated>
    );
  }
}

export const StatsList: React.ComponentClass<Props, State> = injectIntl(StatsListImpl);
