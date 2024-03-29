import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

type Props = DispatchProps & OwnProps & StateProps;
type State = Readonly<{}>;

class ModalImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
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
          <Button color="primary" onClick={closeClicked}>
            <Icon className="fas fa-times" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export type StateProps = Readonly<{
  open: boolean;
  title: string;
  description: string;
  values?: { [key: string]: string; };
}>;
export type DispatchProps = Readonly<{
  closeClicked(): void;
}>;
export type OwnProps = Readonly<{}>;

export const Modal: React.ComponentType<WithIntlProps<Props>> = injectIntl(ModalImpl);
