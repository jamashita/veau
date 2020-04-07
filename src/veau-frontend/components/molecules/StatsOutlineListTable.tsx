import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { StatsID } from '../../../veau-vo/StatsID';
import { StatsOutline } from '../../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../../veau-vo/StatsOutlines';

type Props = Readonly<{
  statsOutlines: StatsOutlines;
  toStatsEdit: (statsID: StatsID) => void;
}>;
type State = Readonly<{
}>;

class StatsOutlineListTableImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      statsOutlines
    } = this.props;

    if (statsOutlines.equals(nextProps.statsOutlines)) {
      return false;
    }

    return true;
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
          {statsOutlines.map<React.ReactNode>((statsOutline: StatsOutline): React.ReactNode => {
            return (
              <TableRow
                key={statsOutline.getStatsID().get().get()}
                hover={true}
                onClick={() => {
                  toStatsEdit(statsOutline.getStatsID());
                }}
              >
                <TableCell>{statsOutline.getName().get()}</TableCell>
                <TableCell>{statsOutline.getUnit().get()}</TableCell>
                <TableCell>{statsOutline.getLanguage().getName().get()}</TableCell>
                <TableCell>{statsOutline.getRegion().getName().get()}</TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: statsOutline.getTerm().getKey()
                  })}
                </TableCell>
                <TableCell>{statsOutline.getUpdatedAt().toString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export const StatsOutlineListTable: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(StatsOutlineListTableImpl);
