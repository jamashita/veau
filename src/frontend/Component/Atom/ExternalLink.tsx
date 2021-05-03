import React, { PropsWithChildren, useMemo } from 'react';

type Props = Readonly<{
  href: string;
  style?: {
    [key: string]: string
  };
}>;

export const ExternalLink: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    style,
    href,
    children
  } = props;

  const memorize: string = useMemo<string>(() => {
    return href;
  }, [href]);

  return (
    <a style={style} href={memorize} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};
