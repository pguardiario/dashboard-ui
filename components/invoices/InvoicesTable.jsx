"use client"
import BaseTable from "@/components/common/BaseTable";
import { useCallback, useEffect, useState } from "react";

const columns = [
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "invoiceID", label: "Invoice ID" },
  { key: "lineItems", label: "Line Items" },
  { key: "amountDue", label: "Amount Due" },
  { key: "amountPaid", label: "Amount Paid" },
  { key: "amountCredited", label: "Amount Credited" },
  { key: "total", label: "Total" },
  { key: "updatedDateUTC", label: "Updated On" },
];

let aud = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

const ariaLabel = "Invoices"

export default function InvoicesTable({ initRows, isCompact }) {
  const [rows, setRows] = useState(initRows)

  useEffect(() => {
    if(isCompact){
      fetch("/api/invoices").then(r => r.json()).then(setRows)
    }
  }, [isCompact])



  const renderCell = useCallback((row, columnKey) => {
    const cellValue = row[columnKey];
    switch (columnKey) {
      case "customer":
        return row.contact.Name
      case "date":
        return new Date(row.date).toLocaleDateString()
      case "invoiceID":
        return row.invoiceID
      case "lineItems":
        return row.lineItems.map(l => `${l.Quantity}x ${l.Description}`).join(', ')
      case "amountDue":
      case "amountPaid":
      case "amountCredited":
      case "total":
        return aud.format(cellValue)
      case "updatedDateUTC":
        return new Date(row.updatedDateUTC).toLocaleDateString()
      default:
        return cellValue;
    }
  }, []);

  let statuses = rows ? [...new Set(rows.map(r => r.category))].filter(Boolean) : []
  const statusOptions = statuses.map(s => {
    return {name: s, key: capitalize(s)}
  })

  const initialVisibleColumns = ["customer", "date", "amountDue", "amountPaid", "amountCredited", "total", "updatedDateUTC"] //, "invoiceID", "lineItems"

  const searchBy = "customer"

  const searcher = (rows, filterValue) => {
    return rows.filter((row) => row.contact.Name.toLowerCase().includes(filterValue.toLowerCase()))
  }

  return rows ? <BaseTable {...{rows, isCompact, initialVisibleColumns, statusOptions, ariaLabel, renderCell, columns, searchBy, searcher}}/> : <div/>
}
