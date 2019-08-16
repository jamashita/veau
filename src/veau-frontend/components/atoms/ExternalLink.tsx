import * as React from 'react';
import { PropsWithChildren } from 'react';

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
    }: PropsWithChildren<Props> = this.props;

    if (href !== nextProps.href) {
      return true;
    }
    if (style !== nextProps.style) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      href,
      style,
      children
    }: PropsWithChildren<Props> = this.props;

    return (
      <a
        style={style}
        href={href}
        target='_blank'
        rel='noopener noreferrer'
      >
        {children}
      </a>
    );
  }
}
