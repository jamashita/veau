import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
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
      localeRepository,
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
                    <TableCell>{statsOverview.getUpdatedAtAsString()}</TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </Authenticated>
    );
  }
}

export const StatsList: React.ComponentClass<Props, State> = injectIntl(StatsListImpl);
