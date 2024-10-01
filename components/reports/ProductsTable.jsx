"use client"

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, DateRangePicker } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { useSidebarContext } from "@/components/layout/layout-context";

import { parseDate } from "@internationalized/date";

const columns = [
  { key: "name", label: "Name" },
  { key: "count", label: "Amount Sold" },
  { key: "unitAmount", label: "Unit Amount" },
  // { key: "description", label: "Description"},

  { key: "cost", label: "Unit Cost" },
  { key: "totalValue", label: "Total Value" },
  { key: "totalCost", label: "Total Cost" },

  { key: "supplier", label: "Supplier" },
  { key: "brand", label: "Brand" },
  { key: "stock", label: "Stock" },


];

let aud = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});


// The formated version of 14340 is

export default function ProductsTable() {
  const { collapsed, setCollapsed } = useSidebarContext();
  const [rows, setRows] = useState([])
  const [dates, setDates] = useState({ from: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), to: new Date() })

  useEffect(() => {
    let { to, from } = dates
    fetch(`/api/reports/products?from=${from.toISOString()}&to=${to.toISOString()}`).then(r => r.json()).then(setRows)
  }, [dates])

  const renderCell = useCallback((row, columnKey) => {
    const cellValue = row[columnKey];

    switch (columnKey) {

      case "unitAmount":
        return cellValue ? aud.format(cellValue) : 0
      case "cost":
        return aud.format(row.tire.net)
      case "totalValue":
        return aud.format(row.unitAmount * row.count)
      case "totalCost":
        return aud.format(row.tire.net * row.count)
      case "stock":
        return row.tire.stock
      case "supplier":
        return row.tire.supplier
      case "brand":
        return row.tire.brand

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


  return <div className={`${collapsed ? "" : "ml-[250px]"} p-6 space-y-3`}>
    <div className="flex items-center">
      <h1 className="text-xl font-bold flex-1">Tyre Report</h1>
      <DateRangePicker
        label="Select a Date Range"
        defaultValue={{
          start: parseDate(dates.from.toISOString().replace(/T.*/, '')),
          end: parseDate(dates.to.toISOString().replace(/T.*/, '')),
        }}
        onChange={({ start, end }) => setDates({ from: start.toDate(), to: end.toDate() })}
        className="max-w-xs"
      />
    </div>

    <hr />
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
