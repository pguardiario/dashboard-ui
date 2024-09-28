import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Textarea } from "@nextui-org/react";
import toast from "react-hot-toast";
import { DateRangePicker } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { useState } from "react";


// import md5 from "crypto-js/md5";

// function gravatar(email) {
//   let hash = md5(email.trim().toLowerCase());
//   return `https://www.gravatar.com/avatar/${hash}`;
// }






export default function CreateNote({ label }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  let [dates, setDates] = useState([])

  function submitForm(callback){
    let form = document.querySelector('#note')
    let [startDate, endDate] = dates
    let data = {...Object.fromEntries(new FormData(form)), startDate, endDate}
    if(!startDate || !endDate || !data.note){
      return toast.error("Please fill out all required fields")
    }
    fetch("/api/notes", {
      headers: {"Content-Type": "application/json"},
      method: "POST",
      body: JSON.stringify(data)
    }).then(r => r.json()).then(note => {
      toast.success("New Note Added!")
      callback()
    })
    // alert(JSON.stringify(data))
  }

  return (
    <>
      <Button onPress={onOpen} color="primary">{label}</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{label}</ModalHeader>
              <ModalBody>

                <form id="note" className="space-y-3">
                  <div className="flex items-center">
                    <div className="flex-1">
                      {/* {JSON.stringify(dates)} */}
                      <DateRangePicker
                        label="Date Range"
                        isRequired
                        // defaultValue={{
                        //   start: parseDate(new Date().toISOString().replace(/T.*/, '')),
                        //   end: parseDate(new Date().toISOString().replace(/T.*/, '')),
                        // }}
                        onChange={({start, end}) => setDates([start.toDate(), end.toDate()])}
                        className="max-w-xs"
                        name="dateRange"
                      />

                    </div>
                    <Checkbox name="officeOnly">Office Only</Checkbox>
                  </div>

                  <Textarea label="Note" name="note" />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => {
                  submitForm(onClose)
                }}>
                  Create {label}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

