import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

export default function MultiClTable() {
  const [sorting, setSorting] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(10);

   const columns = [
  {
    header: 'User Info',
    columns: [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
  },
  {
    header: 'Meta',
    columns: [
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
    ],
  },
];

const data = [
  { id: 1, name: 'Alice', age: 24, role: 'Developer' },
  { id: 2, name: 'Bob', age: 30, role: 'Designer' },
  { id: 3, name: 'Charlie', age: 29, role: 'Manager' },
  { id: 4, name: 'David', age: 22, role: 'Intern' },
  { id: 5, name: 'Eva', age: 27, role: 'HR' },
  { id: 6, name: 'Frank', age: 32, role: 'Lead' },
  { id: 7, name: 'Grace', age: 26, role: 'Support' },
  { id: 8, name: 'Hannah', age: 25, role: 'Marketing' },
  { id: 9, name: 'Ivan', age: 35, role: 'Admin' },
  { id: 10, name: 'Jane', age: 28, role: 'Engineer' },
  { id: 11, name: 'Karan', age: 31, role: 'Architect' },
  { id: 12, name: 'Lina', age: 29, role: 'Tester' },
];



  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  return (
    <div>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>

        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
