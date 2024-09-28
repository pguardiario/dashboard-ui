import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import CreateJobCard from "@/components/common/createJobCard";
import CreateNote from "@/components/common/CreateNote";

export default function ColumnMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return <Modal
    backdrop="opaque"
    // isOpen={isOpen}
    defaultOpen={true}
    // onOpenChange={onClose}
    // onOpenChange={onOpenChange}
    size="xs"
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Actions</ModalHeader>
          <ModalBody>
            <CreateJobCard label="New Job" isBooking={false} />
            <CreateJobCard label="New Booking" isBooking={true} />
            <CreateNote label="New Note"/>
            <Button color="success">Mark as fully booked</Button>
            <Button color="secondary">Adjust Workload</Button>
            <Button color="primary">Zoom in</Button>
            <Button color="danger" variant="light" onPress={onClose}>Close</Button>

          </ModalBody>
          {/* <ModalFooter></ModalFooter> */}
        </>
      )}
    </ModalContent>
  </Modal>

}
