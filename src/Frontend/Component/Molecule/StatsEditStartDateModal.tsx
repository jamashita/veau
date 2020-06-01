import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { Alive, Superposition } from '@jamashita/publikum-monad';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';

import { AsOf } from '../../../VO/AsOf/AsOf';
import { AsOfError } from '../../../VO/AsOf/Error/AsOfError';
import { TextField } from '../Atom/TextField';

type Props = Readonly<{
  open: boolean;
  close(): void;
  determineStartDate(superposition: Superposition<AsOf, AsOfError>): void;
}>;
type State = Readonly<{
  startDate: Superposition<AsOf, AsOfError>;
}>;

class StatsEditStartDateModalImpl extends React.Component<Props & WrappedComponentProps, State> {
  public constructor(props: Props & WrappedComponentProps) {
    super(props);
    this.state = {
      startDate: Alive.of<AsOf, AsOfError>(AsOf.now())
    };
  }

  public shouldComponentUpdate(
    nextProps: Readonly<Props & WrappedComponentProps>,
    nextState: Readonly<State>
  ): boolean {
    // prettier-ignore
    const {
      open
    } = this.props;
    // prettier-ignore
    const {
      startDate
    } = this.state;

    if (open !== nextProps.open) {
      return true;
    }
    if (startDate !== nextState.startDate) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    // prettier-ignore
    const {
      open,
      intl,
      close,
      determineStartDate
    } = this.props;
    // prettier-ignore
    const {
      startDate
    } = this.state;

    return (
      <Dialog
        open={open}
        onClose={close}
        fullWidth={true}
        maxWidth='md'
      >
        <DialogTitle>
          {intl.formatMessage({
            id: 'DETERMINE_START_DATE'
          })}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={intl.formatMessage({
              id: 'START_DATE'
            })}
            type='date'
            value={startDate.match<string>(
              (asOf: AsOf) => {
                return asOf.toString();
              },
              () => {
                return '';
              }
            )}
            onKeyUp={(date: string) => {
              this.setState({
                startDate: AsOf.ofString(date)
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            onClick={() => {
              determineStartDate(startDate);
            }}
          >
            <Icon
              className='fas fa-check'
            />
            {intl.formatMessage({
              id: 'SUBMIT'
            })}
          </Button>
          <Button
            color='secondary'
            onClick={close}
          >
            <Icon
              className='fas fa-times'
            />
            {intl.formatMessage({
              id: 'CANCEL'
            })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsEditStartDateModal: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(
  StatsEditStartDateModalImpl
);
