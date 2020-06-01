import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';

export type StateProps = Readonly<{
  open: boolean;
  title: string;
  description: string;
  values?: Record<string, string>;
}>;
export type DispatchProps = Readonly<{
  closeClicked(): void;
}>;
export type OwnProps = Readonly<{}>;
type Props = StateProps & DispatchProps & OwnProps;
type State = Readonly<{}>;

class ModalImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    // prettier-ignore
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
    // prettier-ignore
    const {
      open,
      title,
      description,
      values,
      intl,
      closeClicked
    } = this.props;

    return (
      <Dialog open={open} disableEscapeKeyDown={true} onClose={closeClicked}>
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
          <Button color='primary' onClick={closeClicked}>
            <Icon className='fas fa-times' />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const Modal: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(ModalImpl);
