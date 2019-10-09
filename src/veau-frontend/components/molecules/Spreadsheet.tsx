import { HotTable } from '@handsontable/react';
import React from 'react';
import { Stats } from '../../../veau-entity/Stats';

type Props = {
  stats: Stats;
  invalidValueInput: () => void;
  dataDeleted: (row: number, column: number) => void;
  dataFilled: (row: number, column: number, value: number) => void;
  rowSelected: (row: number) => void;
  rowMoved: (from: number, to: number) => void;
};
type State = {
};

const ROW_INDEX: number = 0;
const COLUMN_INDEX: number = 1;
const VALUE_INDEX: number = 3;
const SPREADSHEET_HEIGHT: number = 500;

export class Spreadsheet extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    const {
      stats
    } = this.props;

    if (stats.isSame(nextProps.stats)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    const {
      stats,
      invalidValueInput,
      dataFilled,
      dataDeleted,
      rowSelected,
      rowMoved
    } = this.props;

    const data: Array<Array<string>> = stats.getData();
    const columnHeaders: Array<string> = stats.getColumns();
    const rowHeaders: Array<string> = stats.getRows();
    const width: number = stats.getRowHeaderSize();

    if (rowHeaders.length === 0) {
      return (
        <div />
      );
    }

    return (
      <HotTable
        data={data}
        colHeaders={columnHeaders}
        rowHeaders={rowHeaders}
        rowHeaderWidth={width}
        manualRowResize={true}
        manualColumnResize={true}
        manualRowMove={true}
        autoColumnSize={true}
        autoRowSize={true}
        className='htRight'
        selectionMode='range'
        height={SPREADSHEET_HEIGHT}
        enterMoves={{
          row: 0,
          col: 1
        }}
        beforeChange={(changes: Array<[number, string | number, unknown, unknown]> | null): boolean => {
          if (changes === null) {
            return false;
          }
          const length: number = changes.length;
          for (let i: number = 0; i < length; i++) {
            const str: string = changes[i][VALUE_INDEX] as string;

            if (isNaN(Number(str))) {
              invalidValueInput();
              return false;
            }
          }

          return true;
        }}
        afterChange={(changes: Array<[number, string | number, unknown, unknown]> | null): void => {
          if (changes === null) {
            return;
          }
          changes.forEach((change: [number, string | number, unknown, unknown]): void => {
            const row: number = change[ROW_INDEX] as number;
            const column: number = change[COLUMN_INDEX] as number;
            const str: string = change[VALUE_INDEX] as string;

            if (str === '') {
              dataDeleted(row, column);
              return;
            }

            const value: number = Number(str);
            dataFilled(row, column, value);
          });
        }}
        afterSelection={(row1: number, col1: number, row2: number): void => {
          if (row1 === row2) {
            rowSelected(row1);
          }
        }}
        beforeRowMove={(columns: Array<number>, target: number): boolean => {
          columns.forEach((column: number): void => {
            if (column === target) {
              return;
            }
            if (column < target) {
              rowMoved(column, target - 1);
              return;
            }

            rowMoved(column, target);
          });
          return true;
        }}
        licenseKey='non-commercial-and-evaluation'
      />
    );
  }
}
