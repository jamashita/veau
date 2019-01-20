import * as React from 'react';

type Props = {
};
type State = {
};

export class NotFound extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <span>404 - Not Found</span>
    );
  }
}
