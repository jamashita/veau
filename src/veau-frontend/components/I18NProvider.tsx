import * as React from 'react';
import {IntlProvider} from 'react-intl';
import {LanguageIdentifier} from '../../veau-general/LanguageIdentifier';
import {Props} from '../containers/I18NProvider';

export class I18NProvider extends React.Component<Props, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      language,
      children
    } = this.props;

    // TODO illegal invoke of general module
    // const messages = LanguageIdentifier.message(language);

    return (
      <IntlProvider locale={language} messages={messages} defaultLocale='en'>
        {children}
      </IntlProvider>
    );
  }
}
