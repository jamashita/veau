import * as React from 'react';

type Props = {
}

export class CaptionList extends React.Component<Props, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
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
