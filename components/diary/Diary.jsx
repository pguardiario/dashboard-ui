"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useSidebarContext } from "@/components/layout/layout-context";


import Board from '@/components/dnd/board/Board';
import { ChevronDownIcon } from "@/components/icons/sidebar/chevron-down-icon";
import { useState } from "react";
import CreateJobCard from "@/components/common/createJobCard";



export default function Diary({ initData }) {
  let {notes, data} = initData
  const { collapsed, setCollapsed } = useSidebarContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const [statuses, setStatuses] = useState(["new", "finished"]);



  let {
    from,
    to,
    monday_workload,
    monday_opening_hour,
    monday_closing_hour,
    tuesday_workload,
    tuesday_opening_hour,
    tuesday_closing_hour,
    wednesday_workload,
    wednesday_opening_hour,
    wednesday_closing_hour,
    thursday_workload,
    thursday_opening_hour,
    thursday_closing_hour,
    friday_workload,
    friday_opening_hour,
    friday_closing_hour,
    saturday_workload,
    saturday_opening_hour,
    saturday_closing_hour,
    sunday_workload,
    sunday_opening_hour,
    sunday_closing_hour,
    exclude_job_on_hold_from_daily_workload,
    all_days,
    bookings,
    jobs,
    // notes
  } = data

  let fromDate = new Date(from)
  let toDate = new Date(to)

  let map = jobs.reduce((acc, b) => {
    let { time, id } = b
    let key = new Date(time).toDateString()
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push({ ...b, id: "G" + id })
    return acc
  }, {})



  const capitalize = s => {
    return s ? s[0].toUpperCase() + s.slice(1) : ""
  }

  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };



  const statusOptions = [
    {
      name: "finished",
    }, {
      name: "new",
    }
  ]

  let filtered = Object.keys(map).reduce((acc, key) => {
    acc[key] = map[key].filter(r => statuses.includes(r.status))
    return acc
  }, {})


  let numJobs = Object.keys(filtered).map(k => filtered[k]).flat().length

  return <div className={`${collapsed ? "" : "ml-[250px]"} p-6 space-y-3`}>
    <h1>Diary</h1>
    <hr />
    {JSON.stringify(notes)}

    <div className="flex itens-center space-x-3">
      <div className="flex-1">
        <p className="font-bold">{numJobs} jobs</p>
      </div>
      <CreateJobCard label="New Job"/>
      <div className="">
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
              Status
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            // disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={statusFilter}
            selectionMode="multiple"
            onSelectionChange={setStatusFilter}
          >
            {statusOptions.map((status, i) => (
              <DropdownItem onClick={() => {
                if (statuses.includes(status.name)) {
                  setStatuses(statuses.filter(s => s !== status.name))
                } else {
                  setStatuses([...statuses, status.name])
                }
              }} key={i} className="capitalize">
                {capitalize(status.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    {/* {JSON.stringify(statuses)} */}

    {/* {suppliers.map((supplier, i) => <div key={i}>
      <Link target="_blank" href={supplier.website} className="hover:bg-blue-200 px-4">{supplier.supplier}</Link>
    </div>)} */}

    <Board key={numJobs} statuses={statuses} initial={filtered} />
    {/* <pre>{JSON.stringify(map, null, 2)}</pre> */}
    {/* <pre>{JSON.stringify(bookings[0], null, 2)}</pre> */}
    {/* <pre>{JSON.stringify(boardData.medium, null, 2)}</pre>
    <pre>{JSON.stringify(data, null, 2)}</pre> */}
  </div>
};
