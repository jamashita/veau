import { HotTable } from '@handsontable/react';
import * as React from 'react';

type Props = {
  data: Array<Array<string>>;
  columnHeaders: Array<string>;
  rowHeaders: Array<string>;
  rowHeaderWidth: number;
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
      data,
      columnHeaders,
      rowHeaders,
      rowHeaderWidth
    } = this.props;

    if (columnHeaders !== nextProps.columnHeaders) {
      return true;
    }
    if (rowHeaders !== nextProps.rowHeaders) {
      return true;
    }
    if (rowHeaderWidth !== nextProps.rowHeaderWidth) {
      return true;
    }
    if (data.length !== nextProps.data.length) {
      return true;
    }
    for (let i: number = 0; i < data.length; i++) {
      if (data[i].length !== nextProps.data[i].length) {
        return true;
      }
      for (let j: number = 0; j < data[i].length; j++) {
        if (data[i][j] !== nextProps.data[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      data,
      columnHeaders,
      rowHeaders,
      rowHeaderWidth
    } = this.props;

    if (columnHeaders.length === 0) {
      if (rowHeaders.length === 0) {
        return (
          <div />
        );
      }
    }

    return (
      <HotTable
        data={data}
        colHeaders={columnHeaders}
        rowHeaders={rowHeaders}
        rowHeaderWidth={rowHeaderWidth}
        manualRowResize={true}
        manualColumnResize={true}
        manualRowMove={true}
        autoColumnSize={true}
        className='htRight'
        selectionMode='single'
        height={SPREADSHEET_HEIGHT}
        beforeChange={(changes: Array<Array<any>> | null): boolean => {
          if (!changes) {
            return false;
          }
          const length: number = changes.length;
          for (let i: number = 0; i < length; i++) {
            const str: string = changes[i][VALUE_INDEX];

            if (isNaN(Number(str))) {
              this.props.invalidValueInput();
              return false;
            }
          }

          return true;
        }}
        afterChange={(changes: Array<Array<any>> | null): void => {
          if (!changes) {
            return;
          }
          changes.forEach((change: Array<any>) => {
            const str: string = change[VALUE_INDEX];
            const row: number = change[ROW_INDEX];
            const column: number = change[COLUMN_INDEX];

            if (str === '') {
              this.props.dataDeleted(row, column);
              return;
            }

            const value: number = Number(str);
            this.props.dataFilled(row, column, value);
          });
        }}
        afterSelection={(row1: number, col1: number, row2: number, col2: number): void => {
          if (row1 === row2) {
            this.props.rowSelected(row1);
          }
        }}
        beforeRowMove={(columns: Array<number>, target: number): boolean => {
          columns.forEach((column: number) => {
            if (column === target) {
              return;
            }
            if (column < target) {
              this.props.rowMoved(column, target - 1);
              return;
            }

            this.props.rowMoved(column, target);
          });
          return true;
        }}
      />
    );
  }
}
