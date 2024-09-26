import { Card, CardBody } from "@nextui-org/react";
import React, { useState } from "react";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";

import { Tabs, Tab, Chip } from "@nextui-org/react";
import Suggest from "@/components/Suggest"

export default function CreateJobCard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tab, setTab] = useState()

  return (
    <>
      <Button onPress={onOpen} color="primary">Create Job Card</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="5xl"

      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Job Card</ModalHeader>
              <ModalBody>
                <p>Big form coming soon</p>
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
                    key="main"
                    title={
                      <div className="flex items-center space-x-2">

                        <span>Main</span>

                      </div>
                    }
                  />
                  <Tab
                    key="music"
                    title={
                      <div className="flex items-center space-x-2">

                        <span>Music</span>

                      </div>
                    }
                  />
                  <Tab
                    key="videos"
                    title={
                      <div className="flex items-center space-x-2">

                        <span>Videos</span>

                      </div>
                    }
                  />
                </Tabs>
                {tab}
                <Suggest model="customers" onChange={x => alert(JSON.stringify(x))}/>
                <form id="create-job">
                  <div className={tab === "main" ? "" : "hidden"}>
{/*
                  "time": "2024-09-28T15:45:44.218+10:00",
  "number": "56623",
  "job_number": "56623",
  "job_type_ids": [
    13651799,
    9235927,
    14679648,
    15547762
  ],
  "name": "Hills tankers",
  "description": "replaced left steer tyre and rim ",
  "full_description": "replaced left steer tyre and rim , Callout, New Tyres, rim, Strip \u0026 Fit Tyres",
  "total_hours": null,
  "phone": "",
  "mobile": "0459951068",
  "make": "western star ",
  "model": "48x",
  "color": "white ",
  "year": "2023",
  "registration_number": "XB58GH",
  "start": "2024-09-28T15:45:44.218+10:00",
  "end": null,
  "finished_time": null,
  "vehicle_id": 13917245,
  "job_id": 16643524,
  "status": "new",
  "on_hold": true,
  "on_hold_reason": "Waiting on order number",
  "pickup_time": "2024-09-13T07:00:00.000+10:00",
  "type": "job",
  "job_types_title": "Callout, New Tyres, rim, Strip \u0026 Fit Tyres",
  "vehicle_title": "western star  48x 2023\nReg#: XB58GH\nFleet#: ",
  "customer_title": "Hills tankers\u003Cbr\u003E0459951068",
  "replacement_provided": false,
  "key_tag": null, */}
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

