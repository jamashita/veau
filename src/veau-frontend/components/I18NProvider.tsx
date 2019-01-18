import * as React from 'react';
import {IntlProvider} from 'react-intl';
import {Props} from '../containers/I18NProvider';
import {i18nMessages} from '../Messages';

export class I18NProvider extends React.Component<Props, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      language,
      children
    } = this.props;

    const messages = i18nMessages[language];

    return (
      <IntlProvider locale={language} messages={messages} defaultLocale='en'>
        {children}
      </IntlProvider>
    );
  }
}
