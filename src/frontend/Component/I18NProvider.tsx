import React from 'react';
import { IntlProvider } from 'react-intl';
import { Identity } from '../../domain/vo/Identity/Identity';
import { SystemSupportLanguage } from '../../domain/vo/System/SystemSupportLanguage';

import { LanguageIdentificationService } from '../../Service/LanguageIdentificationService';
import { i18nMessages, Messages } from '../Messages';

export type StateProps = Readonly<{
  identity: Identity;
}>;
export type DispatchProps = Readonly<{}>;
export type OwnProps = Readonly<{}>;
type Props = DispatchProps & OwnProps & StateProps;
type State = Readonly<{}>;

export class I18NProvider extends React.Component<Props, State> {
  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      identity,
      children
    } = this.props;

    const language: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(
      identity.getLanguage().getISO639().get()
    );
    const messages: Messages = i18nMessages[language];

    return (
      <IntlProvider locale={language} messages={messages} defaultLocale="en">
        {children}
      </IntlProvider>
    );
  }
}
