import React, { useState } from "react";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Textarea } from "@nextui-org/react";

import { Tabs, Tab, Chip } from "@nextui-org/react";
import Suggest from "@/components/Suggest"
// import { DotsIcon } from "@/components/icons/accounts/dots-icon";

import { customersMap, jobTypes, mechanics, vehiclesMap } from "@/helpers/constants"

import { Select, SelectItem } from "@nextui-org/react";
import toast from "react-hot-toast";

import { DatePicker } from "@nextui-org/react";
import { now, getLocalTimeZone, parseAbsolute } from "@internationalized/date";

function Picker({ label, onChange, defaultValue }) {
  return (

    <DatePicker
      label={label}
      size="sm"
      variant="bordered"
      hideTimeZone
      showMonthAndYearPickers
      defaultValue={defaultValue ? parseAbsolute(defaultValue) : null}
      onChange={x => onChange(x.toDate())}
    />

  );
}

function MultipleSelect({ values, label, onChange, defaultValue }) {
  return (
    <Select
      label={label + "s"}
      placeholder={`Select a ${label}`}
      selectionMode="multiple"
      className="max-w-xs"
      // defaultValue={}
      defaultSelectedKeys={defaultValue}

      onSelectionChange={(o) => {
        onChange([...o].join(', '))
      }}
    >
      {values.map((value) => (
        <SelectItem key={value.key}>
          {value.label}
        </SelectItem>
      ))}
    </Select>

  );

}

function VehiclesSelect({ vehicles, onChange }) {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        label="Select a vehicle"
        className="max-w-xs"
        onSelectionChange={(o) => {
          let id = Number(o.anchorKey)
          let vehicle = vehicles.find(v => v.id === id)
          onChange(vehicle)
        }}
      >
        {vehicles.map((v) => (
          <SelectItem key={v.id}>
            {v.year} {v.make} {v.model} {v.color} ({v.vin || v.registrationNumber})
          </SelectItem>
        ))}
      </Select>

    </div>
  );
}

function jobData(job) {
  let { description, notes, time, finishTime, pickupTime, jobType, assignedTo, estimatedWorkHours, orderNumber, odometer, hubodometer, engineHours, invoiceToThirdParty, courtesyVehicle } = job || {}
  return { description, notes, time, finishTime, pickupTime, jobType, assignedTo, estimatedWorkHours, orderNumber, odometer, hubodometer, engineHours, invoiceToThirdParty, courtesyVehicle }
}

export default function JobContent({ label, isBooking, button, job, callback, onClose }) {
  const [tab, setTab] = useState()
  const [vehicles, setVehicles] = useState([])
  const [showMoreOwner, setShowMoreOwner] = useState(false)
  const [showMoreVehicle, setShowMoreVehicle] = useState(false)

  const [formData, setFormData] = useState({ owner: job.customer || {}, vehicle: job.vehicle || {}, job: jobData(job) })

  let ownerLabels = showMoreOwner ? ["Name", "Mobile", "Phone", "Email", "Address", "Suburb", "State", "Postcode", "Street Address", "Street Address Suburb", "Street Address State", "Street Address Postcode", , "Fax", "Price Level", "Payment Term"] : ["Name", "Mobile", "Phone", "Email", "Address", "Suburb", "State", "Postcode"]

  let vehicleLabels = showMoreVehicle ? ["Registration Number", "Fleet Number", "Driver Name", "Driver Phone", "Driver Email", "Make", "Model", "Year", "VIN", "Color", "Body Type", "Service Interval", "Transmission Type", "Battery", "Odometer Unit", "Engine", "Engine Type", "Engine Oil Type", "Engine Oil Quantity", "Power Steering Oil Type", "Power Steering Oil Quantity", "Transmission Oil Type", "Transmission Oil Quantity", "Transfer Case Oil Type", "Transfer Case Oil Quantity", "Coolant Type", "Coolant Quantity", "Fuel Type", "Air Filter", "Oil Filter", "Fuel Filter", "Transmission Filter", "Hydraulic Filter", "Tyre Size"] : ["Registration Number", "Fleet Number", "Driver Name", "Driver Phone", "Driver Email", "Make", "Model", "Year", "VIN", "Color", "Body Type", "Service Interval"]

  if (formData.vehicle.noVehicleRequired) {
    vehicleLabels = []
  }

  function missingField() {
    if (!formData.owner.name) {
      setTab('owner')
      return "Owner Name"
    }
    if (!formData.vehicle.noVehicleRequired && !formData.vehicle.make) {
      setTab('vehicle')
      return "Vehicle Make"
    }
    if (!formData.job.jobType) {
      setTab('job')
      return "Job Types"
    }
  }

  async function fillOwner(data) {
    // console.log({data})
    // return
    if (!data) return

    let allowedKeys = Object.values(customersMap)
    let newFormData = { ...formData }
    newFormData.owner = {}
    for (let key of Object.keys(data)) {
      if (allowedKeys.includes(key)) {
        newFormData.owner[key] = data[key]
      } else {
        console.log(`bad key: ${key}`)
      }
    }
    setFormData(newFormData)
    fetch(`/api/ownerVehicles/${data.id}`).then(r => r.json()).then(setVehicles)

  }

  async function fillVehicle(data) {
    if (!data) return

    let allowedKeys = Object.values(vehiclesMap)
    let newFormData = { ...formData }
    newFormData.vehicle = {}
    for (let key of Object.keys(data)) {
      if (allowedKeys.includes(key)) {
        newFormData.vehicle[key] = data[key]
        console.log(`good key: ${key}`)
      } else {
        console.log(`bad key: ${key}`)
      }
    }
    setFormData(newFormData)
    // fetch(`/api/ownerVehicles/${data.id}`).then(r => r.json()).then(setVehicles)

  }


  function changeValue(e, key, map, label) {
    let newFormData = { ...formData }
    newFormData[key][map[label]] = e
    setFormData(newFormData)
  }

  function valueFor(key, map, label) {
    return formData[key][map[label]] || ""
  }


  function submitForm() {
    let url = job.id ? `/api/jobs/${job.id}` : `/api/jobs`
    fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: job.id ? "PUT" : "POST",
      body: JSON.stringify({ ...formData, isBooking })
    }).then(r => r.json()).then(job => {
      toast.success(job.id ? "Job Saved" : "Job Added!")
      onClose()
      callback({...job, id: Number(job.id)}, {customer: formData.owner, vehicle: formData.vehicle, ...jobData(formData.job)})
    })
    // alert(JSON.stringify(data))
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]"
        }}
        onSelectionChange={setTab}
        selectedKey={tab}

      >
        <Tab
          key="owner"
          title={
            <div className="flex items-center space-x-2">
              <span>Owner</span>
            </div>
          }
        />
        <Tab
          key="vehicle"
          title={
            <div className="flex items-center space-x-2">
              <span>Vehicle</span>
            </div>
          }
        />
        <Tab
          key="job"
          title={
            <div className="flex items-center space-x-2">
              <span>Job</span>
            </div>
          }
        />
      </Tabs>


      <form id="create-job">
        <div className={tab === "owner" ? "" : "hidden"}>
          {/* {JSON.stringify(formData.owner)} */}

          <div className="flex items-center" >
            <div className="flex-1">
              <Suggest model="customers" onChange={fillOwner} />
            </div>
            <Button onClick={() => setFormData({ ...formData, owner: {} })} color="danger">Clear</Button>
          </div>

          <div className="grid grid-cols-3 gap-2 my-4">
            {ownerLabels.map((label, i) => {
              return <Input key={i} size="sm" type="text" onValueChange={(x) => changeValue(x, "owner", customersMap, label)} label={label} value={valueFor("owner", customersMap, label)} />
            })}
            <Input size="sm" type="number" label="Default Discount" min={0} />
            <Checkbox size="sm" isSelected={formData.owner.isCompany} onChange={e => setFormData({ ...formData, vehicle: { ...formData.owner, isCompany: e.target.checked } })}>Is Company</Checkbox>

          </div>
          <Button variant="ghost" color="primary" onClick={() => setShowMoreOwner(!showMoreOwner)}>{showMoreOwner ? "Show Less" : "Show More"}</Button>

        </div>

        <div className={tab === "vehicle" ? "" : "hidden"}>
          {/* {JSON.stringify(formData.vehicle)} */}
          {/* <Suggest model="customers" onChange={fillOwner} /> */}
          {/* {JSON.stringify(vehicles)} */}

          <div className="flex items-center space-x-3" >
            <div className="flex-1">
              {vehicles.length > 0 && <VehiclesSelect vehicles={vehicles} onChange={fillVehicle} />}
            </div>
            <Checkbox size="sm" isSelected={formData.vehicle.noVehicleRequired} onChange={e => setFormData({ ...formData, vehicle: { ...formData.vehicle, noVehicleRequired: e.target.checked } })}>No Vehicle Required</Checkbox>
            <Button onClick={() => setFormData({ ...formData, vehicle: {} })} color="danger">Clear</Button>
          </div>


          <div className="grid grid-cols-3 gap-2 my-4">
            {vehicleLabels.map((label, i) => {
              return <Input key={i} size="sm" type="text" onValueChange={(x) => changeValue(x, "vehicle", vehiclesMap, label)} label={label} value={valueFor("vehicle", vehiclesMap, label)} />
            })}

            {/* <Input size="sm" type="number" label="Default Discount" min={0} />
                      <Checkbox size="sm" isSelected={formData.owner.isCompany === "Y"}>Is Company</Checkbox> */}

          </div>
          <Button variant="ghost" color="primary" onClick={() => setShowMoreVehicle(!showMoreVehicle)}>{showMoreVehicle ? "Show Less" : "Show More"}</Button>

        </div>


        <div className={tab === "job" ? "" : "hidden"}>
          {/* <Suggest model="customers" onChange={fillOwner} /> */}
          {/* {JSON.stringify(formData.job)} */}
          {/*
                    { description, notes, time, finishTime, pickupTime, jobType, assignedTo, estimatedWorkHours, orderNumber, odometer, hubodometer, engineHours, invoiceToThirdParty, courtesyVehicle }
                    */}
      {/* {formData.job.jobType} */}

          <div className="flex items-center" >
            <div className="flex-1"></div>
            <Button onClick={() => setFormData({ ...formData, job: {} })} color="danger">Clear</Button>
          </div>


          <div className="flex space-x-2 mt-4">
            <div className="w-1/2 space-y-2">
              <Input size="sm" type="text" defaultValue={job.description} onValueChange={(x) => setFormData({ ...formData, job: { ...formData.job, description: x } })} label={"Short Description"} value={formData.job.description} />

              <Textarea label="Note/More Details" defaultValue={job.notes} onValueChange={x => setFormData({ ...formData, job: { ...formData.job, notes: x } })} />
              <Picker label="Start Time" defaultValue={job.time} onChange={x => setFormData({ ...formData, job: { ...formData.job, time: x } })} />
              <Picker label="Estimated Finished Time" defaultValue={job.finishTime} onChange={x => setFormData({ ...formData, job: { ...formData.job, finishTime: x } })} />
              <Picker label="Pickup time" defaultValue={job.pickupTime} onChange={x => setFormData({ ...formData, job: { ...formData.job, pickupTime: x } })} />
              <div>
                <Checkbox size="sm" defaultChecked={job.courtesyVehicle} isSelected={formData.job.courtesyVehicle} onChange={e => setFormData({ ...formData, job: { ...formData.job, courtesyVehicle: e.target.checked } })}>Courtesy Vehicle</Checkbox>
              </div>
              <div>
                <Checkbox size="sm" defaultChecked={job.invoiceToThirdParty} isSelected={formData.job.invoiceToThirdParty} onChange={e => setFormData({ ...formData, job: { ...formData.job, invoiceToThirdParty: e.target.checked } })}>Invoice To 3rd Party</Checkbox>
              </div>

            </div>

            <div className="w-1/2 space-y-2">
              <MultipleSelect defaultValue={job.jobType?.split(', ')} values={jobTypes} label="Job Type" onChange={(x) => setFormData({ ...formData, job: { ...formData.job, jobType: x } })} />
              <MultipleSelect defaultValue={job.assignedTo?.split(', ')} values={mechanics} label="Mechanic" onChange={(x) => setFormData({ ...formData, job: { ...formData.job, assignedTo: x } })} />
              {[{ key: "estimatedWorkHours", label: "Estimated work hours" },
              { key: "orderNumber", label: "Order Number" },
              { key: "odometer", label: "Odometer" },
              { key: "hubodometer", label: "Hubodometer" },
              { key: "engineHours", label: "Engine Hours" }].map(({ key, label }) => <Input key={key} defaultValue={job[key]} size="sm" type="number" step="any" onValueChange={(x) => {
                let newFormData = { ...formData }
                newFormData.job[key] = x
                setFormData(newFormData)
              }} label={label} value={formData.job[key]} />)}

            </div>

            {/* <Checkbox size="sm" isSelected={formData.job.courtesyVehicle}>Courtesy Vehicle</Checkbox> */}

          </div>


        </div>
      </form>
      <div className="flex py-3">
        <div className="flex-1"></div>
        <div className="space-x-3">
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={() => {
            let mf = missingField()
            if (mf) {
              toast.error(`Please fill out ${mf}`)
            } else {
              submitForm()
            }

          }}>
            {job.id ? "Save Job" : "Create Job"}
          </Button>
        </div>
      </div>
    </div>
  );
}

