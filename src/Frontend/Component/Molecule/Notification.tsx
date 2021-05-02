import { Icon, Snackbar, SnackbarContent } from '@material-ui/core';
import { amber, blue, green, red } from '@material-ui/core/colors';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { NotificationHPosition, NotificationKind, NotificationVPosition } from '../../Action';

type Props = DispatchProps & OwnProps & StateProps;
type State = Readonly<{}>;

class NotificationImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      kind,
      open,
      horizontal,
      vertical,
      message,
      duration,
      values
    } = this.props;

    if (kind !== nextProps.kind) {
      return true;
    }
    if (open !== nextProps.open) {
      return true;
    }
    if (horizontal !== nextProps.horizontal) {
      return true;
    }
    if (vertical !== nextProps.vertical) {
      return true;
    }
    if (message !== nextProps.message) {
      return true;
    }
    if (duration !== nextProps.duration) {
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
      horizontal,
      vertical,
      message,
      duration,
      values,
      intl,
      closeClicked
    } = this.props;

    return (
      <Snackbar
        open={open}
        onClose={closeClicked}
        anchorOrigin={{
          horizontal,
          vertical
        }}
        autoHideDuration={duration}
      >
        <SnackbarContent
          style={{
            backgroundColor: this.backgroundColor()
          }}
          message={(
            <span>
              {this.icon()}
              {intl.formatMessage(
                {
                  id: message
                },
                values
              )}
            </span>
          )}
        />
      </Snackbar>
    );
  }

  private icon(): React.ReactNode {
    const {
      kind
    } = this.props;

    switch (kind) {
      case 'success': {
        return <Icon className="fas fa-check-circle icon-spacing" />;
      }
      case 'warn': {
        return <Icon className="fas fa-exclamation-circle icon-spacing" />;
      }
      case 'error': {
        return <Icon className="fas fa-exclamation-triangle icon-spacing" />;
      }
      case 'info':
      default: {
        return <Icon className="fas fa-info-circle icon-spacing" />;
      }
    }
  }

  private backgroundColor(): string {
    const {
      kind
    } = this.props;

    switch (kind) {
      case 'success': {
        return green['700'];
      }
      case 'warn': {
        return amber['400'];
      }
      case 'error': {
        return red['900'];
      }
      case 'info':
      default: {
        return blue['800'];
      }
    }
  }
}

export type StateProps = Readonly<{
  kind: NotificationKind;
  open: boolean;
  horizontal: NotificationHPosition;
  vertical: NotificationVPosition;
  message: string;
  duration: number;
  values?: { [key: string]: string; };
}>;
export type DispatchProps = Readonly<{
  closeClicked(): void;
}>;
export type OwnProps = Readonly<{}>;

export const Notification: React.ComponentType<WithIntlProps<Props>> = injectIntl(
  NotificationImpl
);
