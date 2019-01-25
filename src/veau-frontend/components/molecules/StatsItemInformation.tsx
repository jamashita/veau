import { Card, CardContent, CardHeader } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { TextField } from '../atoms/TextField';

type Props = {
  selecting?: StatsItem;
  nameTyped: (name: string) => void;
  unitTyped: (unit: string) => void;
};
type State = {
};

class StatsItemInformationImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & ReactIntl.InjectedIntlProps>): boolean {
    const {
      selecting
    } = this.props;

    if (selecting !== nextProps.selecting) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      selecting,
      intl
    } = this.props;

    if (!selecting) {
      return (
        <div/>
      )
    }

    return (
      <Card
        className='stats-item-info'
      >
        <CardHeader
          title={intl.formatMessage({
            id: 'STATS_ITEM_INFO'
          })}
        />
        <CardContent>
          <TextField
            label={intl.formatMessage({
              id: 'NAME'
            })}
            type='text'
            value={selecting.getName()}
            onKeyUp={this.props.nameTyped}
          />
          <TextField
            label={intl.formatMessage({
              id: 'UNIT'
            })}
            type='text'
            value={selecting.getUnit()}
            onKeyUp={this.props.unitTyped}
          />
        </CardContent>
      </Card>
    );
  }
}

export const StatsItemInformation: React.ComponentClass<Props, State> = injectIntl(StatsItemInformationImpl);
