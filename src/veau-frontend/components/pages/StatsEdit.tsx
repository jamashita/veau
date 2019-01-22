import { HotTable } from '@handsontable/react';
import * as React from 'react';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';

type State = {
};

const data: Array<Array<number>> = [
  [1, 2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7, 8],
  [6, 7, 8, 9, 10, 11]
];

export class StatsEdit extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      stats
    } = this.props;

    return (
      <Authenticated>
        <HotTable
          settings={{
            data,
            colHeaders: stats.getColumnHeader(),
            rowHeaders: stats.getRowHeader(),
            manualRowResize: true,
            manualColumnResize: true,
            afterChange: (e: any): void => {
              console.log(`here => :${e}`);
            }
          }}
        />
      </Authenticated>
    );
  }
}
