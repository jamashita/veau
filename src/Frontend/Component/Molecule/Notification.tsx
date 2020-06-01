import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { Icon, Snackbar, SnackbarContent } from '@material-ui/core';
import { amber, blue, green, red } from '@material-ui/core/colors';

import { Props } from '../../Container/Molecule/Notification';

type State = Readonly<{}>;

class NotificationImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    // prettier-ignore
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
    // prettier-ignore
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
      case 'info':
      default: {
        return (
          <Icon
            className='fas fa-info-circle icon-spacing'
          />
);
      }
    }
  }

  private backgroundColor(): string {
    // prettier-ignore
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

  public render(): React.ReactNode {
    // prettier-ignore
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
          // prettier-ignore
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
}

export const Notification: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(
  NotificationImpl
);
