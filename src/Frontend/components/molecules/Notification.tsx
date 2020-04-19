import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Icon from '@material-ui/core/Icon';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../containers/molecules/Notification';

type State = Readonly<{}>;

class NotificationImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
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

  private icon(): React.ReactNode {
    const {
      kind
    } = this.props;

    switch (kind) {
      case 'success': {
        return (
          <Icon
            className='fas fa-check-circle icon-spacing'
          />
        );
      }
      case 'info':
      default: {
        return (
          <Icon
            className='fas fa-info-circle icon-spacing'
          />
        );
      }
      case 'warn': {
        return (
          <Icon
            className='fas fa-exclamation-circle icon-spacing'
          />
        );
      }
      case 'error': {
        return (
          <Icon
            className='fas fa-exclamation-triangle icon-spacing'
          />
        );
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
      default:
      case 'info': {
        return blue['800'];
      }
      case 'warn': {
        return amber['400'];
      }
      case 'error': {
        return red['900'];
      }
    }
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
              {intl.formatMessage({
                id: message
              }, values)}
            </span>
          )}
        />
      </Snackbar>
    );
  }
}

export const Notification: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(NotificationImpl);
