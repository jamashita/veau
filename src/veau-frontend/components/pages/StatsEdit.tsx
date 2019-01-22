import { HotTable } from '@handsontable/react';
import * as React from 'react';
import { Props } from '../../containers/pages/StatsEdit';
import { Authenticated } from '../../containers/templates/Authenticated';

type State = {
};

const ROW_INDEX: number = 0;
const COLUMN_INDEX: number = 1;
const VALUE_INDEX: number = 3;

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
            beforeChange: (changes: Array<Array<any>> | null): boolean => {
              if (changes) {
                const length: number = changes.length;
                for (let i: number = 0; i < length; i++) {
                  const str: string = changes[i][VALUE_INDEX];
                  if (str === '') {
                    return false;
                  }

                  const value: number = Number(str);
                  if (isNaN(value)) {
                    return false;
                  }

                  this.props.dataFilled(changes[i][ROW_INDEX], changes[i][COLUMN_INDEX], value);
                }
              }
              return true;
            }
          }}
        />
      </Authenticated>
    );
  }
}
