import { Card, CardBody } from "@nextui-org/react";
import React, { useState } from "react";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";

import { Tabs, Tab, Chip } from "@nextui-org/react";
import Suggest from "@/components/Suggest"
import { DotsIcon } from "../icons/accounts/dots-icon";

import { customersMap } from "@/helpers/constants"

export default function CreateJobCard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tab, setTab] = useState()
  const [vehicles, setVehicles] = useState([])
  const [showMoreOwner, setShowMoreOwner] = useState(false)
  const [showMoreVehicle, setShowMoreVehicle] = useState(false)
  let ownerLabels = showMoreOwner ? ["Name", "Mobile", "Phone", "Email", "Address", "Suburb", "State", "Postcode", "Street Address", "Street Address Suburb", "Street Address State", "Street Address Postcode", , "Fax", "Price Level", "Payment Term"] : ["Name", "Mobile", "Phone", "Email", "Address", "Suburb", "State", "Postcode"]



  let vehicleLabels = showMoreVehicle ? ["Registration Number", "Fleet Number", "Driver Name", "Driver Phone", "Driver Email", "Make", "Model", "Year", "VIN", "Color", "Body Type", "Service Interval", "Transmission Type", "Battery", "Odometer Unit", "Engine", "Engine Type", "Engine Oil Type", "Engine Oil Quantity", "Power Steering Oil Type", "Power Steering Oil Quantity", "Transmission Oil Type", "Transmission Oil Quantity", "Transfer Case Oil Type", "Transfer Case Oil Quantity", "Coolant Type", "Coolant Quantity", "Fuel Type", "Air Filter", "Oil Filter", "Fuel Filter", "Transmission Filter", "Hydraulic Filter", "Tyre Size"] : ["Registration Number", "Fleet Number", "Driver Name", "Driver Phone", "Driver Email", "Make", "Model", "Year", "VIN", "Color", "Body Type", "Service Interval"]





  const [formData, setFormData] = useState({ owner: {}, vehicle: {}, job: {} })

  async function fillOwner(data) {
    // console.log({data})
    // return
    if(!data) return

    let allowedKeys = Object.values(customersMap)
    let newFormData = {...formData}
    newFormData.owner = {}
    for(let key of Object.keys(data)){
      if(allowedKeys.includes(key)){
        newFormData.owner[key] = data[key]
        setFormData(newFormData)
      } else {
        console.log(`bad key: ${key}`)
      }
    }
    setFormData(newFormData)
    fetch(`/api/ownerVehicles/${data.id}`).then(r => r.json()).then(setVehicles)

  }

  function changeValue(e, key, map, label) {
    let newFormData = {...formData}
    newFormData[key][map[label]] = e
    setFormData(newFormData)
  }

  function valueFor(key, map, label) {
    return formData[key][map[label]] || ""
  }

  return (
    <>
      <Button onPress={onOpen} color="primary">Create Job Card</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="2xl"

      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Job Card</ModalHeader>
              <ModalBody>
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
                    <div className="flex items-center" >
                    <div className="flex-1">
                    <Suggest model="customers" onChange={fillOwner} />
                    </div>

                      <Button onClick={() => setFormData({...formData, owner: {}})} color="danger">Clear</Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-4">
                      {ownerLabels.map((label, i) => {
                        return <Input key={i} size="sm" type="text" onValueChange={(x) => changeValue(x, "owner", customersMap, label)} label={label} value={valueFor("owner", customersMap, label)} />
                      })}
                      <Input size="sm" type="number" label="Default Discount" min={0} />
                      <Checkbox size="sm" isSelected={formData.owner.isCompany === "Y"}>Is Company</Checkbox>

                    </div>
                    <Button variant="ghost" color="primary" onClick={() => setShowMoreOwner(!showMoreOwner)}>{showMoreOwner ? "Show Less" : "Show More"}</Button>

                  </div>

                  <div className={tab === "vehicle" ? "" : "hidden"}>
                    {/* <Suggest model="customers" onChange={fillOwner} /> */}
                    {JSON.stringify(vehicles)}
                    <div className="grid grid-cols-3 gap-2 my-4">
                      {vehicleLabels.map((label, i) => {
                        return <Input key={i} size="sm" type="text" onValueChange={(x) => changeValue(x, "vehicle", customersMap, label)} label={label} value={valueFor("vehicle", customersMap, label)} />
                      })}

                      {/* <Input size="sm" type="number" label="Default Discount" min={0} />
                      <Checkbox size="sm" isSelected={formData.owner.isCompany === "Y"}>Is Company</Checkbox> */}

                    </div>
                    <Button variant="ghost" color="primary" onClick={() => setShowMoreVehicle(!showMoreVehicle)}>{showMoreVehicle ? "Show Less" : "Show More"}</Button>

                  </div>

                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  Sign in
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

