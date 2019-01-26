import { Snackbar, SnackbarContent } from '@material-ui/core';
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
          message={intl.formatMessage({
              id: message
            },
            values
          )}
        />
      </Snackbar>
    );
  }
}

export const Notification: React.ComponentClass<Props, State> = injectIntl(NotificationImpl);
