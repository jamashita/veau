import { Typography } from '@material-ui/core';
import * as React from 'react';

type Props = {
  href: string;
  style?: {[key: string]: string};
};
type State = {
};

export class ExternalLink extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      href,
      style
    } = this.props;

    if (href !== nextProps.href) {
      return true;
    }
    if (style !== nextProps.style) {
      return true;
    }

    return false;
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
      <Typography>
        <a
          style={style}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
        >
          {this.text()}
        </a>
      </Typography>
    );
  }
}
