import { HotTable } from '@handsontable/react';
import * as React from 'react';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';

type State = {
};

const data: Array<Array<any>> = [
  ['', '2000-01-01', '2000-01-02'],
  ['A', 1, 2],
  ['B', 3, 4]
];

export class StatsEdit extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      stats
    } = this.props;

    console.log(stats);

    return (
      <Authenticated>
        <HotTable
          settings={{
            data,
            colHeaders: false,
            rowHeaders: false,
            width: 600,
            height: 600,
            afterChange: (e: any): void => {
              console.log(e);
            }
          }}
        />
      </Authenticated>
    );
  }
}
