import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { StatsItem } from '../../../veau-entity/StatsItem';
import { I18NLabel } from '../atoms/I18NLabel';
import { TextField } from '../atoms/TextField';

type Props = {
  open: boolean;
  statsItem: StatsItem;
  close: () => void;
  itemNameTyped: (name: string) => void;
  itemUnitTyped: (unit: string) => void;
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
    if (statsItem.getName() !== nextProps.statsItem.getName()) {
      return true;
    }
    if (statsItem.getUnit() !== nextProps.statsItem.getUnit()) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      open,
      statsItem,
      intl
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.props.close}
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
            value={statsItem.getName()}
            onKeyUp={this.props.itemNameTyped}
          />
          <TextField
            label={intl.formatMessage({
              id: 'UNIT'
            })}
            type='text'
            value={statsItem.getUnit()}
            onKeyUp={this.props.itemUnitTyped}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            onClick={this.props.saveNewItem}
            disabled={!statsItem.isFilled()}
          >
            <Icon className='fas fa-check' />
            <I18NLabel
              id='SUBMIT'
            />
          </Button>
          <Button
            color='secondary'
            onClick={this.props.close}
          >
            <Icon className='fas fa-times' />
            <I18NLabel
              id='CANCEL'
            />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsItemModal: React.ComponentClass<Props, State> = injectIntl(StatsItemModalImpl);
