import { Button, Card, CardActions, CardContent, CardHeader, Icon } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { AccountName } from '../../../VO/Account/AccountName';
import { EntranceInformation } from '../../../VO/EntranceInformation/EntranceInformation';
import { Password } from '../../../VO/EntranceInformation/Password';
import { TextField } from '../Atom/TextField';

export type StateProps = Readonly<{
  entranceInformation: EntranceInformation;
}>;
export type DispatchProps = Readonly<{
  accountTyped(name: AccountName): void;
  passwordTyped(password: Password): void;
  loginClicked(): void;
}>;
export type OwnProps = Readonly<{}>;
type Props = DispatchProps & OwnProps & StateProps;
type State = Readonly<{}>;

class EntranceImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      entranceInformation,
      intl
    } = this.props;

    if (intl.locale !== nextProps.intl.locale) {
      return true;
    }
    if (entranceInformation.equals(nextProps.entranceInformation)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    const {
      entranceInformation,
      intl,
      accountTyped,
      passwordTyped,
      loginClicked
    } = this.props;

    return (
      <Card className='login-form' raised={true}>
        <CardHeader
          title={intl.formatMessage({
            id: 'VEAU'
          })}
          subheader={intl.formatMessage({
            id: 'VEAU_DESCRIPTION'
          })}
        />
        <CardContent>
          <TextField
            label={intl.formatMessage({
              id: 'ACCOUNT_NAME'
            })}
            value={entranceInformation.getAccount().get()}
            type='text'
            onKeyUp={(value: string) => {
              accountTyped(AccountName.of(value));
            }}
            onEnterUp={loginClicked}
          />
          <TextField
            label={intl.formatMessage({
              id: 'PASSWORD'
            })}
            value={entranceInformation.getPassword().get()}
            type='password'
            onKeyUp={(value: string) => {
              passwordTyped(Password.of(value));
            }}
            onEnterUp={loginClicked}
          />
        </CardContent>
        <CardActions>
          <Button
            variant='contained'
            color='primary'
            fullWidth={true}
            disabled={!entranceInformation.isAcceptable()}
            onClick={loginClicked}
          >
            <Icon className='fas fa-sign-in-alt icon-spacing' />
            {intl.formatMessage({
              id: 'LOGIN'
            })}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export const Entrance: React.ComponentType<WithIntlProps<Props>> = injectIntl(EntranceImpl);
