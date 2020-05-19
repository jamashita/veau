import { Quantum } from 'publikum';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Icon from '@material-ui/core/Icon';

import { StatsItem } from '../../../Entity/StatsItem';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { TextField } from '../Atom/TextField';

type Props = Readonly<{
  selecting: Quantum<StatsItem>;
  nameTyped: (name: StatsItemName) => void;
  removeItem: (statsItem: StatsItem) => void;
}>;
type State = Readonly<{}>;

class StatsItemInformationImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    // prettier-ignore
    const {
      selecting
    } = this.props;

    if (selecting === nextProps.selecting) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    // prettier-ignore
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
      <Card className='stats-item-info'>
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
            value={selecting.get().getName().get()}
            onKeyUp={(value: string) => {
              nameTyped(StatsItemName.of(value));
            }}
          />
          <CardActions>
            <Button
              color='primary'
              onClick={() => {
                removeItem(selecting.get());
              }}
              fullWidth={true}
            >
              <Icon className='fas fa-trash' />
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

export const StatsItemInformation: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(
  StatsItemInformationImpl
);
