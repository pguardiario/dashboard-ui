"use client"

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Tooltip,
  DateRangePicker,
} from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/searchicon";
import { ChevronDownIcon } from "@/components/icons/sidebar/chevron-down-icon";
import toast from "react-hot-toast";
import { capitalize } from "@/helpers/utils";

import React, { useCallback, useEffect, useState } from "react";
import { useSidebarContext } from "@/components/layout/layout-context";

import { parseDate } from "@internationalized/date";
import Link from "next/link";

const columns = [
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "invoiceID", label: "Invoice ID" },
  // { key: "description", label: "Description"},

  { key: "quantity", label: "Quantity" },
  { key: "lineAmount", label: "Line Amount" },
  // { key: "totalValue", label: "Total Value" },
  // { key: "totalCost", label: "Total Cost" },
  { key: "category", label: "Category", sortable: true },

  { key: "supplier", label: "Supplier" },
  { key: "brand", label: "Brand" },
  { key: "available", label: "Available" },


];



let aud = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});


// The formated version of 14340 is

export default function ProductsHistoryTable({rows}) {
  const { collapsed, setCollapsed } = useSidebarContext();

  const [dates, setDates] = useState({ from: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), to: new Date() })
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const INITIAL_VISIBLE_COLUMNS = ["customer", "date", "invoiceID", "quantity", "lineAmount"]
  // , "unitAmount", "cost", "totalValue", "totalCost", "category", "supplier", "brand", "available"



  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "time",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  let name = rows.length ? rows[0].name : ""

  let statuses = [...new Set(rows.map(r => r.category))].filter(Boolean)
  const statusOptions = statuses.map(s => {
    return {name: s, key: capitalize(s)}
  })

  const renderCell = useCallback((row, columnKey) => {
    const cellValue = row[columnKey];

    switch (columnKey) {
      case "customer":
        return row.invoice.contact.Name
      case "date":
        return new Date(row.date).toLocaleDateString()
      case "invoiceID":
        return row.invoiceID
      case "quantity":
        return row.quantity

      case "lineAmount":
      case "unitAmount":
        return cellValue ? aud.format(cellValue) : 0
      case "cost":
        return aud.format(row.tire.net)
      case "totalValue":
        return aud.format(row.unitAmount * row.count)
      case "totalCost":
        return aud.format(row.tire.net * row.count)
      case "available":
        return row.available
      case "supplier":
        return <a href={row.website} target="_blank" className="text-blue-600 underline">{row.tire.supplier}</a>
      case "brand":
        return row.tire.brand

      case "supplier":
        return (
          <a href={row.website} target="_blank">
            {row.supplier}
          </a>
        );
        case "name":
          return (
            <Link href={`/reports/products/${row.tire.id}`} className="text-blue-600 underline">
              {row.name}
            </Link>
          );
      default:
        return cellValue;
    }
  }, []);

  const pages = Math.ceil(rows.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredRows = [...rows];

    if (hasSearchFilter) {
      filteredRows = filteredRows.filter((row) =>
        row.invoice.contact.Name?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredRows = filteredRows.filter((row) =>
        Array.from(statusFilter).includes(row.category),
      );
    }

    return filteredRows;
  }, [rows, filterValue, statusFilter]);


  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);


  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by customer..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Category
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.key} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.key} className="capitalize">
                    {capitalize(column.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {rows.length} rows</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    rows.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return <div className={`${collapsed ? "" : "ml-[250px]"} p-6 space-y-3`}>
    <div className="flex items-center">
      <h1 className="text-xl font-bold flex-1">History for {name}</h1>

    </div>

    <hr />
    {/* {suppliers.map((supplier, i) => <div key={i}>
      <Link target="_blank" href={supplier.website} className="hover:bg-blue-200 px-4">{supplier.supplier}</Link>
    </div>)} */}
{/* {JSON.stringify(rows[0])} */}
<Table
      isCompact
      removeWrapper
      aria-label="Tyres Report"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      // checkboxesProps={{
      //   classNames: {
      //     wrapper: "after:bg-foreground after:text-background text-background",
      //   },
      // }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      // selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"

      // onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No jobs found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
};
