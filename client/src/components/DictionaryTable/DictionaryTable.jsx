/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTable, useBlockLayout, useResizeColumns } from 'react-table';
import './DictionaryTable.css';

function DictionaryTable(props) {
  const { columns, data } = props;

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 80,
      maxWidth: 500,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout, // required for resizing to work
    useResizeColumns,
  );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((hg) => (
          <tr {...hg.getHeaderGroupProps()}>
            {hg.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
                <div
                  {...column.getResizerProps()}
                  className={`resizer ${
                    column.isResizing ? 'isResizing' : ''
                  }`}
                />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DictionaryTable;
