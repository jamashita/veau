import { Heisenberg } from '@jamashita/genitore-superposition';
import { Button, Card, CardActions, CardContent, CardHeader, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { StatsItem } from '../../../domain/entity/StatsItem/StatsItem';
import { StatsItemName } from '../../../domain/vo/StatsItem/StatsItemName';
import { TextField } from '../Atom/TextField';

type Props = Readonly<{
  selecting: Heisenberg<StatsItem>;
  nameTyped(name: StatsItemName): void;
  removeItem(statsItem: StatsItem): void;
}>;
type State = Readonly<{}>;

class StatsItemInformationImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      selecting
    } = this.props;

    if (selecting === nextProps.selecting) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    const {
      selecting,
      intl,
      nameTyped,
      removeItem
    } = this.props;

    if (!selecting.isPresent()) {
      return null;
    }

    return (
      <Card className="stats-item-info">
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
            type="text"
            value={selecting.get().getName().get()}
            onKeyUp={(value: string) => {
              nameTyped(StatsItemName.of(value));
            }}
          />
          <CardActions>
            <Button
              color="primary"
              onClick={() => {
                removeItem(selecting.get());
              }}
              fullWidth={true}
            >
              <Icon className="fas fa-trash" />
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

export const StatsItemInformation: React.ComponentType<WithIntlProps<Props>> = injectIntl(
  StatsItemInformationImpl
);
