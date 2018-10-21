import * as React from 'react';
import {IntlProvider} from 'react-intl';
import {Props} from '../containers/I18NProvider';
import {LanguageIdentifier} from '../../veau-general/LanguageIdentifier';

export default class I18NProvider extends React.Component<Props, {}> {

  public shouldComponentUpdate(nextProps: Props, nextState: {}): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      locale,
      children
    } = this.props;

    const messages = LanguageIdentifier.message(locale);

    return (
      <IntlProvider locale={locale} messages={messages} defaultLocale='en'>
        {children}
      </IntlProvider>
    );
  }
}
