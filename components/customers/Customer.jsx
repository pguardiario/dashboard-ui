"use client"

import { Button, Checkbox, Divider, Input, ScrollShadow, Tab, Tabs } from "@nextui-org/react"
import { useState } from "react"
import toast from "react-hot-toast"
import InvoicesTable from "../invoices/InvoicesTable"

import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio } from "@nextui-org/react";
import CreateJobCard from "../common/createJobCard"

const colors = ["default", "primary", "secondary", "success", "warning", "danger"];

function VehiclesTable({ vehicles, setVehicle }) {

  return (
    <div className="flex flex-col gap-3">
      <Table
        // color={selectedColor}
        selectionMode="single"
        defaultSelectedKeys={[0]}
        onRowAction={setVehicle}
        aria-label="Vehicles table"
      >
        <TableHeader>
          <TableColumn>Vehicle</TableColumn>
          <TableColumn>Reg. No#</TableColumn>
          <TableColumn>Fleet. No#</TableColumn>
          <TableColumn>Last Job Date</TableColumn>
          <TableColumn>Next Service</TableColumn>
        </TableHeader>

        <TableBody>
          {vehicles.map((v, i) => <TableRow key={i}>
            <TableCell>{[v.year, v.color, v.make, v.model].filter(Boolean).join(' ')}</TableCell>
            <TableCell>{v.registrationNumber}</TableCell>
            <TableCell>{v.fleetNumber}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          )}

        </TableBody>
      </Table>

    </div>
  );
}


const fields = {
  name: {
    label: "Name"
  },
  isCompany: {
    label: "Is Company",
    type: "checkbox"
  },
  isThirdParty: {
    label: "Is Third Party",
    type: "checkbox"
  },
  abn: {
    label: "ABN"
  },
  taxRegistrationNumber: {
    label: "Tax Registration Number"
  },
  email: {
    label: "Email"
  },
  mobile: {
    label: "Mobile"
  },
  phone: {
    label: "Phone"
  },
  fax: {
    label: "Fax"
  },
  address: {
    label: "Address"
  },
  streetAddress: {
    label: "Street Address"
  },
  contactName: {
    label: "Contact Name"
  },
  priceLevel: {
    label: "Price Level"
  },
  discountPercentage: {
    label: "Discount Percentage"
  },
  source: {
    label: "Source"
  },
}

// paymentTerm
// businessSourceId
// insurerId
// thirdPartyAccountNumber
// loyaltyAutoClub
// loyaltyAccountNumber
// creditLimit
// specialAccountNumber
// driverLicense
// paymentInstruction
// requireOrderNumber
// noRounding
// disableBookingReminder
// disableServiceReminder
// unsubscribed
// sendCommunicationsToDriver
function Vehicle({ vehicle, customer }) {
  let { odometer, registrationNumber, year, color, make, model } = vehicle || {}
  let description = [year, color, make, model].filter(Boolean).join(' ')
  return <div className="p-4">
    {/* {JSON.stringify(vehicle)} */}

    <h2 className="font-bold text-xl">{description}</h2>{ }

    <div className="flex space-x-2 py-3">
      <CreateJobCard label="New Job" initOwner={customer} initVehicle={vehicle}/>
      <Button onPress={() => alert("coming soon")}>New Invoice</Button>
      <Button onPress={() => alert("coming soon")}>Print History</Button>
    </div>
    {/* New Job :: New Invoice :: Print History */}
    <dl className="text-sm">
      <dt>Reg. No#</dt>
      <dd>{registrationNumber}</dd>

      <dt>Make</dt>
      <dd>{make}</dd>
      <dt>Model</dt>
      <dd>{model}</dd>
      <dt>Year</dt>
      <dd>{year}</dd>
      <dt>Color</dt>
      <dd>{color}</dd>
      <dt>Odometer Unit</dt>
      <dd>{odometer}</dd>
    </dl>


  </div>
}


export default function Customer({ data, invoices, vehicles }) {
  const [formData, setFormData] = useState(data)
  const [topTab, setTopTab] = useState("customer")
  const [bottomTab, setBottomTab] = useState("invoices")
  const [vehicle, setVehicle] = useState(vehicles[0])

  function update(key, value) {
    // alert(value)
    let newFormData = { ...formData }
    newFormData[key] = value
    setFormData(newFormData)
  }

  function saveCustomer() {
    fetch(`/api/customers/${data.id}`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify(formData)
    }).then(() => {
      toast.success('Customer Saved!')
    })

  }

  return <div>
    <h1 className="text-xl font-bold">{data.name}</h1>
    <Divider className="my-2" />

    <div className="flex">


      <div className="w-1/2">
        <Tabs onSelectionChange={setTopTab} selectedKey={topTab} className="py-3">
          <Tab key="customer" title="Customer Details" />
          <Tab key="contacts" title="Contacts" />
          <Tab key="vehicles" title="Vehicles" />
        </Tabs>


        {topTab === "customer" && <div className="space-y-1 space-x-2">
          {Object.keys(fields).map(key => {
            let field = fields[key]
            switch (field.type) {
              case "checkbox": return <Checkbox key={key} onChange={e => update(key, e.target.checked)} size="sm" defaultSelected={formData[key] === "Y"}>{field.label}</Checkbox>
              default: return <Input key={key} onChange={e => update(key, e.target.value)} size="sm" value={formData[key]} label={field.label} />
            }
          })}
          <div className="flex py-2">
            <div className="flex-1"></div>
            <Button onPress={saveCustomer} color="primary">Save</Button>
          </div>

        </div>}
        {topTab === "contacts" && <div>Coming soon</div>}
        {topTab === "vehicles" && <VehiclesTable setVehicle={n => setVehicle(vehicles[n])} vehicles={vehicles} />}

        <Tabs onSelectionChange={setBottomTab} selectedKey={bottomTab} className="py-3">
          <Tab key="invoices" title="Invoices" />
          <Tab key="payments" title="Payments" />
          <Tab key="quotes" title="Quotes" />
        </Tabs>
        {bottomTab === "invoices" && <ScrollShadow orientation="horizontal">
          <InvoicesTable initRows={invoices} />
        </ScrollShadow>}
        {bottomTab === "payments" && <div>Coming soon</div>}
        {bottomTab === "quotes" && <div>Coming soon</div>}
      </div>
      <div className="w-1/2"><Vehicle vehicle={vehicle} customer={data}/></div>
    </div>

  </div>
}
