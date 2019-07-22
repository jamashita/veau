import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { TextField } from '../atoms/TextField';

type Props = {
  open: boolean;
  statsItem: StatsItem;
  close: () => void;
  itemNameTyped: (name: string) => void;
  saveNewItem: () => void;
};
type State = {
};

class StatsItemModalImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
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
    const {
      open,
      statsItem,
      intl,
      close,
      itemNameTyped,
      saveNewItem
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={close}
        fullWidth={true}
        maxWidth='md'
      >
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
            onKeyUp={itemNameTyped}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            onClick={saveNewItem}
            disabled={!statsItem.isFilled()}
          >
            <Icon className='fas fa-check' />
            {intl.formatMessage({
              id: 'SUBMIT'
            })}
          </Button>
          <Button
            color='secondary'
            onClick={close}
          >
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

export const StatsItemModal: React.ComponentClass<Props, State> = injectIntl(StatsItemModalImpl);
