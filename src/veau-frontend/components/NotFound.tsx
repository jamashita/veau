import * as React from 'react';

export default class NotFound extends React.Component<any, {}> {

  public shouldComponentUpdate(nextProps: any, nextState: {}): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <span>404 - Not Found</span>
    );
  }
}
