import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import * as React from 'react';
import {
  InjectedIntlProps,
  injectIntl
} from 'react-intl';
import { Props } from '../../containers/molecules/Modal';

type State = {
};

class ModalImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      open,
      title,
      description,
      values
    } = this.props;

    if (open !== nextProps.open) {
      return true;
    }
    if (title !== nextProps.title) {
      return true;
    }
    if (description !== nextProps.description) {
      return true;
    }
    if (values !== nextProps.values) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      open,
      title,
      description,
      values,
      intl
    } = this.props;

    return (
      <Dialog
        open={open}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
      >
        <DialogTitle>
          {intl.formatMessage(
            {
              id: title
            },
            values
          )}
        </DialogTitle>
        <DialogContent>
          {intl.formatMessage(
            {
              id: description
            },
            values
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            onClick={this.props.closeClicked}
          >
            <Icon className='fas fa-times' />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const Modal: React.ComponentClass<Props, State> = injectIntl(ModalImpl);
