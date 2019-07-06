import { HotTable } from '@handsontable/react';
import * as React from 'react';
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

    const columnLength: number = stats.getColumns().length;
    if (columnLength !== nextProps.stats.getColumns().length) {
      return true;
    }
    for (let i: number = 0; i < columnLength; i++) {
      if (stats.getColumns()[i] !== nextProps.stats.getColumns()[i]) {
        return true;
      }
    }
    const rowLength: number = stats.getRows().length;
    if (rowLength !== nextProps.stats.getRows().length) {
      return true;
    }
    for (let i: number = 0; i < rowLength; i++) {
      if (stats.getRows()[i] !== nextProps.stats.getRows()[i]) {
        return true;
      }
    }
    if (stats.getRowHeaderSize() !== nextProps.stats.getRowHeaderSize()) {
      return true;
    }

    const data: Array<Array<string>> = stats.getData();
    const nextData: Array<Array<string>> = nextProps.stats.getData();

    if (data.length !== nextData.length) {
      return true;
    }
    for (let i: number = 0; i < data.length; i++) {
      if (data[i].length !== nextData[i].length) {
        return true;
      }
      for (let j: number = 0; j < data[i].length; j++) {
        if (data[i][j] !== nextData[i][j]) {
          return true;
        }
      }
    }

    return false;
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
        beforeChange={(changes: Array<Array<any>> | null): boolean => {
          if (!changes) {
            return false;
          }
          const length: number = changes.length;
          for (let i: number = 0; i < length; i++) {
            const str: string = changes[i][VALUE_INDEX];

            if (isNaN(Number(str))) {
              invalidValueInput();
              return false;
            }
          }

          return true;
        }}
        afterChange={(changes: Array<Array<any>> | null): void => {
          if (!changes) {
            return;
          }
          changes.forEach((change: Array<any>): void => {
            const str: string = change[VALUE_INDEX];
            const row: number = change[ROW_INDEX];
            const column: number = change[COLUMN_INDEX];

            if (str === '') {
              dataDeleted(row, column);
              return;
            }

            const value: number = Number(str);
            dataFilled(row, column, value);
          });
        }}
        afterSelection={(row1: number, col1: number, row2: number, col2: number): void => {
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
