import { Button, Checkbox, DateRangePicker, Textarea } from "@nextui-org/react";
import toast from "react-hot-toast";
import { parseDate } from "@internationalized/date";
import { useState } from "react";


// TODO: Move this into the CreateNote Modal

export default function NoteContent({ note, onClose, callback }) {
  let [dates, setDates] = useState([note.startDate, note.endDate])

  function submitForm() {
    let form = document.querySelector('#note')
    let [startDate, endDate] = dates
    let data = { ...Object.fromEntries(new FormData(form)), startDate, endDate }
    // data.id = note.id
    if (!startDate || !endDate || !data.note) {
      return toast.error("Please fill out all required fields")
    }
    fetch(note.id ? `/api/notes/${note.id}`: "/api/notes", {
      headers: { "Content-Type": "application/json" },
      method: note.id ? "PUT": "POST",
      body: JSON.stringify(data)
    }).then(r => r.json()).then(note => {
      toast.success(note.id ? "Note Changed!" : "New Note Added!")
      onClose()
      callback({...note, type: "note"}, data)
    })
    // alert(JSON.stringify(data))
  }

  let defaultDates = {
    start: parseDate(note?.startDate?.toISOString().replace(/T.*/, '')),
    end: parseDate(note?.endDate?.toISOString().replace(/T.*/, '')),
  }

  return <form id="note" className="space-y-3">
    <div className="flex items-center">
      <div className="flex-1">
        {/* {JSON.stringify(dates)} */}
        <DateRangePicker
          label="Date Range"
          isRequired
          defaultValue={defaultDates}
          onChange={({ start, end }) => setDates([start.toDate(), end.toDate()])}
          className="max-w-xs"
          name="dateRange"
        />
      </div>
      <Checkbox name="officeOnly">Office Only</Checkbox>
    </div>

    <Textarea label="Note" name="note" defaultValue={note.note}/>
    <Button onClick={submitForm} color="primary">Submit</Button>
  </form>
}

