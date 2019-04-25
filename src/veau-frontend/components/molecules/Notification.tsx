import { Icon, Snackbar, SnackbarContent } from '@material-ui/core';
import { amber, blue, green, red } from '@material-ui/core/colors';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Props } from '../../containers/molecules/Notification';

type State = {
};

const SUCCESS: number = 700;
const INFO: number = 800;
const WARN: number = 400;
const ERROR: number = 900;

class NotificationImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
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
        return green[SUCCESS];
      }
      default:
      case 'info': {
        return blue[INFO];
      }
      case 'warn': {
        return amber[WARN];
      }
      case 'error': {
        return red[ERROR];
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
          message={<span>
            {this.icon()}
            {intl.formatMessage({
                id: message
              },
              values
            )}
          </span>}
        />
      </Snackbar>
    );
  }
}

export const Notification: React.ComponentClass<Props, State> = injectIntl(NotificationImpl);
