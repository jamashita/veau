import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Props } from '../containers/I18NProvider';
import { i18nMessages, Messages } from '../Messages';

type State = {
};

export class I18NProvider extends React.Component<Props, State> {

  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      identity,
      children
    } = this.props;

    const language: string = identity.getLanguage().get();
    const messages: Messages = i18nMessages[language];

    return (
      <IntlProvider
        locale={language}
        messages={messages}
        defaultLocale='en'
      >
        {children}
      </IntlProvider>
    );
  }
}
