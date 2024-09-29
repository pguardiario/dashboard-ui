"use client"
import React, { useEffect, useState } from "react";
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
} from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/searchicon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { ChevronDownIcon } from "@/components/icons/sidebar/chevron-down-icon";
import toast from "react-hot-toast";

import { capitalize } from "@/helpers/utils";
import { allPeople } from "@/helpers/constants";
import CreateJobCard from "@/components/common/createJobCard";

const columns = [
  // {name: "ID", uid: "id", sortable: true},
  // {name: "NAME", uid: "name", sortable: true},
  // {name: "AGE", uid: "age", sortable: true},
  // {name: "ROLE", uid: "role", sortable: true},
  // {name: "TEAM", uid: "team"},
  // {name: "EMAIL", uid: "email"},
  // {name: "STATUS", uid: "status", sortable: true},
  // {name: "ACTIONS", uid: "actions"},

  { name: "Created By", uid: "createdBy", sortable: true },
  { name: "Assigned To", uid: "assignedTo", sortable: true },
  { name: "Job No#", uid: "id", sortable: true },
  { name: "Start", uid: "time", sortable: true },
  { name: "Finished", uid: "finishTime", sortable: false },
  { name: "Description", uid: "description", sortable: false },
  { name: "Vehicle", uid: "vehicle", sortable: false },
  { name: "Reg No.", uid: "registrationNumber", sortable: false },
  { name: "Fleet No.", uid: "fleetNumber", sortable: false },
  { name: "Customer", uid: "customer", sortable: false },
  { name: "Status", uid: "status", sortable: false },
  { name: "Actions", uid: "actions", sortable: false },
];

const statusOptions = [
  { name: "New", uid: "new" },
  { name: "Finished", uid: "finished" },
  { name: "On Hold", uid: "onHold" },
];

const statusColorMap = {
  new: "primary",
  onHold: "danger",
  finished: "success",
};


export default function JobsTable({ initData, isCompact }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const INITIAL_VISIBLE_COLUMNS = isCompact ?
  ["createdBy", "time", "description", "status", "actions"] :
  ["id", "createdBy", "assignedTo", "time", "finishTime", "description", "vehicle", "registrationNumber", "fleetNumber", "customer", "status","actions"];

  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "time",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [jobs, setJobs] = useState(initData)

  useEffect(() => {
    if(isCompact){
      fetch("/api/jobs").then(r => r.json()).then(setJobs)
    }
  }, [isCompact])

  async function deleteJob(id){
    fetch(`/api/jobs/${id}`, {
      method: "DELETE"
    }).then(r => r.json()).then(() => {
      toast.success("Job Deleted!")
      setJobs(jobs.filter(j => j.id !== id))
    })
  }

  const pages = Math.ceil(jobs.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredJobs = [...jobs];

    if (hasSearchFilter) {
      filteredJobs = filteredJobs.filter((job) =>
        job.description?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredJobs = filteredJobs.filter((job) =>
        Array.from(statusFilter).includes(job.status),
      );
    }

    return filteredJobs;
  }, [jobs, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((job, columnKey) => {
    const cellValue = job[columnKey];

    switch (columnKey) {
      case "createdBy":
      case "assignedTo":
        let person = allPeople.find(p => p.label === cellValue)
        return (
          person ? <User
            avatarProps={{ radius: "full", size: "sm", src: person.avatar }}
            classNames={{
              description: "text-default-500",
            }}
            description={person.email}
            name={cellValue}
          >
            {person.email}
          </User> : cellValue
        );
      case "time":
      case "finishTime":
        return cellValue ? new Date(cellValue).toLocaleDateString() : ""
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[job.status]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {/* <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip> */}
            <Tooltip content="Edit job">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <CreateJobCard isBooking={false} label={"Edit"} job={job} button={<EditIcon/>}/>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete job">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon onClick={() => deleteJob(job.id)} />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue;
    }
  }, []);

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
            placeholder="Search by description..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
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
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <CreateJobCard label="Add New" isBooking={false}/>

          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {jobs.length} jobs</span>
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
    jobs.length,
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

  return (
    <Table
      isCompact={isCompact}
      removeWrapper
      aria-label="Jobs Table"
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
      topContent={isCompact ? null : topContent}
      topContentPlacement="outside"

      // onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
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
  );
}
