import * as React from 'react';

type Props = {
};
type State = {
};

export class CaptionList extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {

    return (
      <div>
        Happy Halloween!
      </div>
    );
  }
}
