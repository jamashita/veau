import { HotTable } from '@handsontable/react';
import * as React from 'react';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';

type State = {
};

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
            data: stats.getDataMatrix(),
            colHeaders: stats.getColumn(),
            rowHeaders: stats.getRow(),
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
