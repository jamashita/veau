import * as React from 'react';

type Props = {
  href: string;
  style?: object;
};
type State = {
};

export class ExternalLink extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
  }

  private text(): React.ReactNode {
    const {
      href,
      children
    } = this.props;

    if (children === undefined) {
      return href;
    }
    return children;
  }

  public render(): React.ReactNode {
    const {
      href,
      style
    } = this.props;

    return (
      <span>
        <a
          style={style}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
        >
          {this.text()}
        </a>
      </span>
    );
  }
}
