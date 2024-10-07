"use client"

import { Button, Checkbox, Divider, Input } from "@nextui-org/react"
import { useState } from "react"
import toast from "react-hot-toast"

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

export default function Customer({ data, invoices }) {
  const [formData, setFormData] = useState(data)
  function update(key, value) {
    // alert(value)
    let newFormData = { ...formData }
    newFormData[key] = value
    setFormData(newFormData)
  }

  function saveCustomer(){
    fetch(`/api/customers/${data.id}`, {
      headers: {"Content-Type": "application/json"},
      method: "PUT",
      body: JSON.stringify(formData)
    }).then(() => {
      toast.success('Customer Saved!')
    })

  }

  return <div>
    <h1 className="text-xl font-bold">{data.name}</h1>
    <Divider className="my-2" />


    <div className="space-y-1 space-x-2 w-[200px]">
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
    </div>




  </div>
}
