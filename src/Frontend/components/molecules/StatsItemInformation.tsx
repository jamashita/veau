import { Button, Card, CardActions, CardContent, CardHeader, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { StatsItem } from '../../../Entity/StatsItem';
import { StatsItemName } from '../../../VO/StatsItemName';
import { TextField } from '../atoms/TextField';

type Props = Readonly<{
  selecting?: StatsItem;
  nameTyped: (name: StatsItemName) => void;
  removeItem: (statsItem: StatsItem) => void;
}>;
type State = Readonly<{
}>;

class StatsItemInformationImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      selecting
    } = this.props;

    if (selecting !== undefined) {
      if (nextProps.selecting !== undefined) {
        if (selecting.isSame(nextProps.selecting)) {
          return false;
        }

        return true;
      }

      return true;
    }
    if (nextProps.selecting !== undefined) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      selecting,
      intl,
      nameTyped,
      removeItem
    } = this.props;

    if (selecting === undefined) {
      return null;
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
            value={selecting.getName().get()}
            onKeyUp={(value: string) => {
              nameTyped(StatsItemName.of(value));
            }}
          />
          <CardActions>
            <Button
              color='primary'
              onClick={() => {
                removeItem(selecting);
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

export const StatsItemInformation: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(StatsItemInformationImpl);
