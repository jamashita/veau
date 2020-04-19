import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../containers/molecules/Modal';

type State = Readonly<{}>;

class ModalImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
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
      intl,
      closeClicked
    } = this.props;

    return (
      <Dialog
        open={open}
        disableEscapeKeyDown={true}
        onClose={closeClicked}
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
            onClick={closeClicked}
          >
            <Icon
              className='fas fa-times'
            />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const Modal: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(ModalImpl);
