import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../containers/molecules/Modal';

type State = {
};

class ModalImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      open,
      title,
      description,
      values
    }: PropsWithChildren<Props & WrappedComponentProps> = this.props;

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
    }: PropsWithChildren<Props & WrappedComponentProps> = this.props;

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
