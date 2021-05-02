import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { StatsItemDisplay } from '../../../VO/Display/StatsItemDisplay';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { TextField } from '../Atom/TextField';

type Props = Readonly<{
  open: boolean;
  item: StatsItemDisplay;
  close(): void;
  itemNameTyped(name: StatsItemName): void;
  saveNewItem(): void;
}>;
type State = Readonly<{}>;

class StatsItemModalImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      open,
      item
    } = this.props;

    if (open !== nextProps.open) {
      return true;
    }
    if (!item.equals(nextProps.item)) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      open,
      item,
      intl,
      close,
      itemNameTyped,
      saveNewItem
    } = this.props;

    return (
      <Dialog open={open} onClose={close} fullWidth={true} maxWidth="md">
        <DialogTitle>
          {intl.formatMessage({
            id: 'CREATE_NEW_ITEM'
          })}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={intl.formatMessage({
              id: 'NAME'
            })}
            type="text"
            value={item.getName().get()}
            onKeyUp={(value: string) => {
              itemNameTyped(StatsItemName.of(value));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={saveNewItem} disabled={!item.isFilled()}>
            <Icon className="fas fa-check" />
            {intl.formatMessage({
              id: 'SUBMIT'
            })}
          </Button>
          <Button color="secondary" onClick={close}>
            <Icon className="fas fa-times" />
            {intl.formatMessage({
              id: 'CANCEL'
            })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsItemModal: React.ComponentType<WithIntlProps<Props>> = injectIntl(
  StatsItemModalImpl
);
