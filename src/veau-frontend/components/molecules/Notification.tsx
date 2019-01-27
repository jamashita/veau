import { Icon, Snackbar, SnackbarContent } from '@material-ui/core';
import { amber, blue, green, red } from '@material-ui/core/colors';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { NotificationKind } from '../../../veau-enum/NotificationKind';
import { Props } from '../../containers/molecules/Notification';

type State = {
};

const SUCCESS: number = 700;
const INFO: number = 800;
const WARN: number = 400;
const ERROR: number = 900;

class NotificationImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    return true;
  }

  private icon(): React.ReactNode {
    const {
      kind
    } = this.props;

    switch (kind) {
      case NotificationKind.SUCCESS: {
        return (
          <Icon
            className='fas fa-check-circle notification-icon'
          />
        );
      }
      case NotificationKind.INFO:
      default: {
        return (
          <Icon
            className='fas fa-info-circle notification-icon'
          />
        )
      }
      case NotificationKind.WARN: {
        return (
          <Icon
            className='fas fa-exclamation-circle notification-icon'
          />
        );
      }
      case NotificationKind.ERROR: {
        return (
          <Icon
            className='fas fa-exclamation-triangle notification-icon'
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
      case NotificationKind.SUCCESS: {
        return green[SUCCESS];
      }
      default:
      case NotificationKind.INFO: {
        return blue[INFO];
      }
      case NotificationKind.WARN: {
        return amber[WARN];
      }
      case NotificationKind.ERROR: {
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
      values,
      duration,
      intl
    } = this.props;

    return (
      <Snackbar
        open={open}
        onClose={this.props.onClose}
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
          message={<div>
            {this.icon()}
            <span>
              {intl.formatMessage({
                id: message
              },
              values)}
            </span>
          </div>}
        />
      </Snackbar>
    );
  }
}

export const Notification: React.ComponentClass<Props, State> = injectIntl(NotificationImpl);
