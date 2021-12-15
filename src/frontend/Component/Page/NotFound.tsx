import React from 'react';

type Props = Readonly<{}>;
type State = Readonly<{}>;

export class NotFound extends React.Component<Props, State> {
  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <div>
        <span>404 - Not Found</span>
      </div>
    );
  }
}
