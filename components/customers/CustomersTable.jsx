"use client"
import BaseTable from "@/components/common/BaseTable";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const columns = [
  { key: "id", label: "Cust. No#" },
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "status", label: "Status" },
  { key: "balance", label: "Balance" },
];



let aud = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

const ariaLabel = "Customers"

export default function InvoicesTable({ initRows, isCompact }) {
  const [rows, setRows] = useState(initRows)

  useEffect(() => {
    if(isCompact){
      fetch("/api/customers").then(r => r.json()).then(setRows)
    }
  }, [isCompact])



  const renderCell = useCallback((row, columnKey) => {
    const cellValue = row[columnKey];
    switch (columnKey) {
      case "date":
        return new Date(row.date).toLocaleDateString()
      case "balance":
        return aud.format(cellValue || 0)
      default:
        return <Link href={`/customers/${row.id}`}>{cellValue}</Link>
    }
  }, []);


  // let statuses = rows ? ["Has Balance", "Is Company", "Individuals Only"] : []
  const statusOptions = [
    { label: "Has Balance", key: "hasBalance" },
    { label: "Is Company", key: "isCompany" },
    { label: "Individuals Only", key: "individualsOnly" },
  ]

  const initialVisibleColumns = ["id", "name", "phone", "email", "address", "balance"] //, "invoiceID", "lineItems"

  const searchBy = "name"

  const searcher = (rows, filterValue) => {
    return rows.filter((row) => row.name.toLowerCase().includes(filterValue.toLowerCase()))
  }

  return rows ? <BaseTable {...{rows, isCompact, initialVisibleColumns, statusOptions, ariaLabel, renderCell, columns, searchBy, searcher}}/> : <div/>
}
