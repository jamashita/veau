import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsOverview } from '../../../veau-entity/StatsOverview';
import { LocaleRepository } from '../../../veau-repository/LocaleRepository';
import { Language } from '../../../veau-vo/Language';
import { Region } from '../../../veau-vo/Region';
import { StatsID } from '../../../veau-vo/StatsID';

type Props = {
  statsOverviews: Array<StatsOverview>;
  localeRepository: LocaleRepository;
  toStatsEdit: (statsID: StatsID) => void;
};
type State = {
};

class StatsOverviewListTableImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      statsOverviews,
      localeRepository
    } = this.props;

    if (statsOverviews.length !== nextProps.statsOverviews.length) {
      return true;
    }
    for (let i: number = 0; i < statsOverviews.length; i++) {
      if (statsOverviews[i].getName() !== nextProps.statsOverviews[i].getName()) {
        return true;
      }
    }
    if (localeRepository !== nextProps.localeRepository) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      statsOverviews,
      localeRepository,
      intl
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
    );
  }
}

export const StatsOverviewListTable: React.ComponentClass<Props, State> = injectIntl(StatsOverviewListTableImpl);
