import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { StatsListItem } from '../../../VO/StatsListItem/StatsListItem';
import { StatsListItems } from '../../../VO/StatsListItem/StatsListItems';
import { StatsID } from '../../../VO/StatsOutline/StatsID';

type Props = Readonly<{
  statsListItems: StatsListItems;
  toStatsEdit(statsID: StatsID): void;
}>;
type State = Readonly<{}>;

class StatsOutlineListTableImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    // prettier-ignore
    const {
      statsListItems
    } = this.props;

    if (statsListItems.equals(nextProps.statsListItems)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    // prettier-ignore
    const {
      statsListItems,
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
          {statsListItems.map<React.ReactNode>((items: StatsListItem) => {
            return (
              <TableRow
                key={items.getOutline().getStatsID().get().get()}
                hover={true}
                onClick={() => {
                  toStatsEdit(items.getOutline().getStatsID());
                }}
              >
                <TableCell>{items.getOutline().getName().get()}</TableCell>
                <TableCell>{items.getOutline().getUnit().get()}</TableCell>
                <TableCell>{items.getLanguage().getName().get()}</TableCell>
                <TableCell>{items.getRegion().getName().get()}</TableCell>
                <TableCell>
                  {intl.formatMessage({
                    id: items.getTerm().getTermID().get().get()
                  })}
                </TableCell>
                <TableCell>{items.getOutline().getUpdatedAt().toString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export const StatsOutlineListTable: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(
  StatsOutlineListTableImpl
);
