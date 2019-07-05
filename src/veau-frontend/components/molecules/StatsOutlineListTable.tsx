import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsOutline } from '../../../veau-entity/StatsOutline';
import { StatsID } from '../../../veau-vo/StatsID';

type Props = {
  statsOutlines: Array<StatsOutline>;
  toStatsEdit: (statsID: StatsID) => void;
};
type State = {
};

class StatsOutlineListTableImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      statsOutlines
    } = this.props;

    const length: number = statsOutlines.length;
    if (length !== nextProps.statsOutlines.length) {
      return true;
    }
    for (let i: number = 0; i < length; i++) {
      if (statsOutlines[i].getName() !== nextProps.statsOutlines[i].getName()) {
        return true;
      }
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      statsOutlines,
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
          {statsOutlines.map<React.ReactNode>((statsOutline: StatsOutline) => {
            return (
              <TableRow
                key={statsOutline.getStatsID().get()}
                hover={true}
                onClick={(): void => {
                  toStatsEdit(statsOutline.getStatsID());
                }}
              >
                <TableCell>{statsOutline.getName()}</TableCell>
                <TableCell>{statsOutline.getUnit()}</TableCell>
                <TableCell>{statsOutline.getLanguage().getName()}</TableCell>
                <TableCell>{statsOutline.getRegion().getName()}</TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: statsOutline.getTerm().getKey()
                  })}
                </TableCell>
                <TableCell>{statsOutline.getUpdatedAtAsString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export const StatsOutlineListTable: React.ComponentClass<Props, State> = injectIntl(StatsOutlineListTableImpl);
