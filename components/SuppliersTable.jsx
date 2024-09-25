"use client"

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import { useCallback } from "react";
import { useSidebarContext } from "./layout/layout-context";


const columns = [
  {
    key: "supplier",
    label: "Supplier",
  },
  {
    key: "username",
    label: "Username",
  },
  {
    key: "password",
    label: "Password",
  },
];

export default function SuppliersTable({ rows }) {

  const { collapsed, setCollapsed } = useSidebarContext();

  const renderCell = useCallback((row, columnKey) => {
    const cellValue = row[columnKey];

    switch (columnKey) {
      case "supplier":
        return (
          <a href={row.website} target="_blank">
            {row.supplier}
          </a>
        );
      default:
        return cellValue;
    }
  }, []);


  return <div className={`${collapsed ? "" : "ml-[250px]" } p-6 space-y-3`}>
    <h1>Suppliers</h1>
    <hr/>
    {/* {suppliers.map((supplier, i) => <div key={i}>
      <Link target="_blank" href={supplier.website} className="hover:bg-blue-200 px-4">{supplier.supplier}</Link>
    </div>)} */}

    <Table aria-label="Example table with dynamic content">
      <TableHeader>
        {columns.map((column) =>
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {rows.map((row) =>
          <TableRow key={row.key}>
            {(columnKey) => <TableCell>{renderCell(row, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
};
