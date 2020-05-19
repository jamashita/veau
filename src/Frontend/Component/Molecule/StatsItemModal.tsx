import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';

import { StatsItem } from '../../../Entity/StatsItem/StatsItem';
import { StatsItemName } from '../../../VO/StatsItem/StatsItemName';
import { TextField } from '../Atom/TextField';

type Props = Readonly<{
  open: boolean;
  statsItem: StatsItem;
  close: () => void;
  itemNameTyped: (name: StatsItemName) => void;
  saveNewItem: () => void;
}>;
type State = Readonly<{}>;

class StatsItemModalImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    // prettier-ignore
    const {
      open,
      statsItem
    } = this.props;

    if (open !== nextProps.open) {
      return true;
    }
    if (!statsItem.isSame(nextProps.statsItem)) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    // prettier-ignore
    const {
      open,
      statsItem,
      intl,
      close,
      itemNameTyped,
      saveNewItem
    } = this.props;

    return (
      <Dialog open={open} onClose={close} fullWidth={true} maxWidth='md'>
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
            type='text'
            value={statsItem.getName().get()}
            onKeyUp={(value: string) => {
              itemNameTyped(StatsItemName.of(value));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={saveNewItem} disabled={!statsItem.isFilled()}>
            <Icon className='fas fa-check' />
            {intl.formatMessage({
              id: 'SUBMIT'
            })}
          </Button>
          <Button color='secondary' onClick={close}>
            <Icon className='fas fa-times' />
            {intl.formatMessage({
              id: 'CANCEL'
            })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsItemModal: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(
  StatsItemModalImpl
);
