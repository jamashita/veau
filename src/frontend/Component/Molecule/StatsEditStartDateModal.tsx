import { Superposition } from '@jamashita/genitore-superposition';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { AsOf } from '../../../domain/vo/AsOf/AsOf';
import { AsOfError } from '../../../domain/vo/AsOf/Error/AsOfError';
import { TextField } from '../Atom/TextField';

type Props = Readonly<{
  open: boolean;
  close(): void;
  determineStartDate(superposition: Superposition<AsOf, AsOfError>): void;
}>;
type State = Readonly<{
  startDate: string;
}>;

class StatsEditStartDateModalImpl extends React.Component<Props & WrappedComponentProps, State> {
  public constructor(props: Props & WrappedComponentProps) {
    super(props);
    this.state = {
      startDate: AsOf.now().toString()
    };
  }

  public shouldComponentUpdate(
    nextProps: Props & WrappedComponentProps,
    nextState: State
  ): boolean {
    const {
      open
    } = this.props;
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
    const {
      open,
      intl,
      close,
      determineStartDate
    } = this.props;
    const {
      startDate
    } = this.state;

    return (
      <Dialog open={open} onClose={close} fullWidth={true} maxWidth="md">
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
            type="date"
            value={startDate}
            onKeyUp={(date: string) => {
              this.setState({
                startDate: date
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              determineStartDate(AsOf.ofString(startDate));
            }}
          >
            <Icon className="fas fa-check" />
            {intl.formatMessage({
              id: 'SUBMIT'
            })}
          </Button>
          <Button color="secondary" onClick={close}>
            <Icon className="fas fa-times" />
            {intl.formatMessage({
              id: 'CANCEL'
            })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const StatsEditStartDateModal: React.ComponentType<WithIntlProps<Props>> = injectIntl(
  StatsEditStartDateModalImpl
);
