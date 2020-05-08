import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { StatsID } from '../../../VO/StatsID';
import { StatsListItem } from '../../../VO/StatsListItem';
import { StatsListItems } from '../../../VO/StatsListItems';

type Props = Readonly<{
  statsListItems: StatsListItems;
  toStatsEdit: (statsID: StatsID) => void;
}>;
type State = Readonly<{}>;

class StatsOutlineListTableImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      statsListItems
    } = this.props;

    if (statsListItems.equals(nextProps.statsListItems)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
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

export const StatsOutlineListTable: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(StatsOutlineListTableImpl);
