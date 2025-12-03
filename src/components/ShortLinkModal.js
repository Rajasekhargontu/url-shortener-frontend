// src/components/ShortLinkModal.jsx
import React from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Text, HStack, Input, IconButton, useToast, Box
} from "@chakra-ui/react";
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";

export default function ShortLinkModal({ isOpen, onClose, shortUrl }) {
  const toast = useToast();

  if (!shortUrl) return null;

  async function copy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shortUrl);
      } else {
        // fallback: create temporary input
        const el = document.createElement("textarea");
        el.value = shortUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      toast({ title: "Copied", description: "Short link copied to clipboard", status: "success", duration: 2000, isClosable: true });
    } catch (e) {
      toast({ title: "Copy failed", description: "Could not copy, please copy manually", status: "error", duration: 3000, isClosable: true });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Short link created</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={3}>
            <Text fontSize="sm" color="gray.600">Share this short link:</Text>
            <HStack mt={2}>
              <Input value={shortUrl} isReadOnly />
              <IconButton aria-label="Open" icon={<ExternalLinkIcon />} as="a" href={shortUrl} target="_blank" />
              <IconButton aria-label="Copy" icon={<CopyIcon />} onClick={copy} />
            </HStack>
          </Box>

          <Text fontSize="sm" color="gray.500">
            You can paste it into chat, email or any social app.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
