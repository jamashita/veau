import * as React from 'react';

type Props = {
}

export default class NotFound extends React.Component<Props, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <span>404 - Not Found</span>
    );
  }
}
