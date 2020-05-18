import React from 'react';
import { IntlProvider } from 'react-intl';
import { LanguageIdentificationService } from '../../Service/LanguageIdentificationService';
import { SystemSupportLanguage } from '../../VO/SystemSupportLanguage';
import { Props } from '../Container/I18NProvider';
import { i18nMessages, Messages } from '../Messages';

type State = Readonly<{}>;

export class I18NProvider extends React.Component<Props, State> {
  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    // prettier-ignore
    const {
      identity,
      children
    } = this.props;

    const language: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(
      identity.getLanguage().getISO639().get()
    );
    const messages: Messages = i18nMessages[language];

    return (
      <IntlProvider locale={language} messages={messages} defaultLocale='en'>
        {children}
      </IntlProvider>
    );
  }
}
