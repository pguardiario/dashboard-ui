import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

export default function KanbanCard({label}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return <Modal
    backdrop="opaque"
    defaultOpen={true}
    size="xs"
  >
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">{label}</ModalHeader>
          <ModalBody>
            kanban data goes in here (coming soon)
          </ModalBody>
          {/* <ModalFooter></ModalFooter> */}
        </>
      )}
    </ModalContent>
  </Modal>

}
