import { Button, Card, CardActions, CardContent, CardHeader, Icon } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { TextField } from '../atoms/TextField';

type Props = {
  selecting?: StatsItem;
  nameTyped: (name: string) => void;
  unitTyped: (unit: string) => void;
  removeItem: (statsItem: StatsItem) => void;
};
type State = {
};

class StatsItemInformationImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & ReactIntl.InjectedIntlProps>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      selecting,
      intl
    } = this.props;

    if (!selecting) {
      return (
        <div/>
      );
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
          <CardActions>
            <Button
              color='primary'
              onClick={(): void => {
                this.props.removeItem(selecting);
              }}
              fullWidth={true}
            >
              <Icon
                className='fas fa-trash'
              />
              {intl.formatMessage({
                id: 'REMOVE_ITEM'
              })}
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    );
  }
}

export const StatsItemInformation: React.ComponentClass<Props, State> = injectIntl(StatsItemInformationImpl);
