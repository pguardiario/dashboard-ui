"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useSidebarContext } from "@/components/layout/layout-context";


import Board from '@/components/dnd/board/Board';
import { ChevronDownIcon } from "@/components/icons/sidebar/chevron-down-icon";
import { useEffect, useMemo, useState } from "react";
import CreateJobCard from "@/components/common/createJobCard";



export default function Diary({ initData }) {
  let { data } = initData
  let [notes, setNotes] = useState(initData?.notes || [])
  const { collapsed, setCollapsed } = useSidebarContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const [statuses, setStatuses] = useState(["new", "finished"]);

  const [jobs, setJobs] = useState([])
  useEffect(() => {
    fetch(`/api/jobs?week=1`).then(r => r.json()).then(setJobs)
  }, [])


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
    // jobs,
    // notes
  } = data

  let fromDate = new Date(from)
  let toDate = new Date(to)

  let keys = [0,1,2,3,4,5,6].map(n => new Date(new Date().getTime() - n * 24 * 60 * 60 * 1000).toDateString().slice(4, -5)).reduce((acc, key) => {
    let date = new Date(key + ' ' + new Date().getFullYear())
    acc[key] = notes.filter(n => {
      return n.endDate >= date && n.startDate <= date// new Date(n.endDate) < date
    }).map(n => {


      return {
        ...n,
        status: "new",
        time: n.startDate,
        description: "",
        name: n.note,
        createdBy: n.createdBy,
        type: "note"
      }
    })

    return acc
  }, {})

  let map = jobs.reduce((acc, b) => {
    let { time, id } = b
    let key = new Date(time).toDateString().slice(4, -5)
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push({ ...b, id: "G" + id })
    return acc
  }, keys)



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

  let itemCallback = (job, data) => {
    console.log({job, data})
    if(job.type === "note"){
      let newNotes = notes.map(note => {
        if(note.id === job.id){
          // alert(n.id)
          return {...note, ...data}
        } else {
          return {...note}
        }
      })
      setNotes(newNotes)
      console.log(newNotes.map(n => n.note))
    } else {
      // alert("x" + job.type)
    }
  }

  let kanbanBoard = useMemo(() => <Board key={new Date().getTime()} statuses={statuses} initial={filtered} itemCallback={itemCallback}/>, [jobs, notes])

  return <div className={`${collapsed ? "" : "ml-[250px]"} p-6 space-y-3`}>
    <h1>Diary</h1>
    <hr />
    {/* {JSON.stringify(notes[0])} */}
    {/* {JSON.stringify(Object.keys(filtered).map(k => filtered[k]).flat()[0])} */}

    <div className="flex itens-center space-x-3">
      <div className="flex-1">
        <p className="font-bold">{numJobs} jobs</p>
      </div>
      <CreateJobCard label="New Job" />
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

    {kanbanBoard}
    {/* <pre>{JSON.stringify(map, null, 2)}</pre> */}
    {/* <pre>{JSON.stringify(bookings[0], null, 2)}</pre> */}
    {/* <pre>{JSON.stringify(boardData.medium, null, 2)}</pre>
    <pre>{JSON.stringify(data, null, 2)}</pre> */}
  </div>
};
