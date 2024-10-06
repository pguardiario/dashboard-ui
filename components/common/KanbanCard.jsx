import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import NoteContent from "@/components/common/modal/NoteContent"
import { capitalize } from "@/helpers/utils";

export default function KanbanCard({job, callback}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return <Modal
    backdrop="opaque"
    defaultOpen={true}
    placement="top-center"
    size="xl"
    onClick={e => e.stopPropagation()}
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Edit {capitalize(job.type)}</ModalHeader>
          <ModalBody>
            {job.type === "note" && <NoteContent note={job} onClose={onClose} callback={callback}/>}
            {job.type !== "note" && "Coming Soon"}

          </ModalBody>
          {/* <ModalFooter></ModalFooter> */}
        </>
      )}
    </ModalContent>
  </Modal>

}
