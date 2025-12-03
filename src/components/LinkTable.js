// src/components/LinksTable.jsx
import React, { useRef, useState } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, IconButton, Link as ChakraLink,
  useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, Button, HStack, Text, Box
} from "@chakra-ui/react";
import { ExternalLinkIcon, InfoIcon, DeleteIcon, CopyIcon } from "@chakra-ui/icons";
/**
 * LinksTable - presentational table
 * props:
 *  - links: Array of link objects
 *  - onDelete(code) : async function called when delete confirmed
 *  - onAnalytics(code) : function called when analytics requested
 */
export default function LinksTable({ links = [], onDelete, onAnalytics,renderer }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selected, setSelected] = useState(null);

  function confirmDelete(link) {
    setSelected(link);
    onOpen();
  }

  async function handleConfirmDelete() {
    if (!selected) return onClose();
    try {
      await onDelete(selected.code);
    } finally {
      onClose();
      setSelected(null);
    }
  }
  const handleRender=()=>{
    if (renderer) {
      renderer();
    }
  }

  return (
    <Box borderWidth={1} borderRadius="md" overflowX="auto" w="100%">
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>Code</Th>
            <Th>Destination</Th>
            <Th>Clicks</Th>
            <Th>Created</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {links.length === 0 ? (
            <Tr>
              <Td colSpan={5}>
                <Text p={4} color="gray.600">No links found.</Text>
              </Td>
            </Tr>
          ) : (
            links.map((link) => (
              <Tr key={link._id}>
                <Td>{link.code}</Td>
                <Td maxW="60" isTruncated>
                  <ChakraLink href={link.destination} isExternal color="blue.600">
                    {link.destination}
                  </ChakraLink>
                </Td>
                <Td>{link.clicks ?? (link.analytics?.clickCount ?? 0)}</Td>
                <Td>{link.createdAt ? new Date(link.createdAt).toLocaleString() : "-"}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      size="sm"
                      aria-label="Open"
                      icon={<CopyIcon />}
                      onClick={async (e) => {
                        e.preventDefault();
                            await navigator.clipboard.writeText(`${process.env.REACT_APP_BASE_URL}/links/${link.code}`);
                        }
                      }
                    />
                    <IconButton
                    id="linkUrl"
                      size="sm"
                      aria-label="Open"
                      icon={<ExternalLinkIcon />}
                      as="a"
                      href={`${process.env.REACT_APP_BASE_URL}/links/${link.code}`}
                      target="_blank"
                      onClick={handleRender}
                    />
                    <IconButton
                      size="sm"
                      aria-label="Analytics"
                      icon={<InfoIcon />}
                      onClick={() => onAnalytics(link.code)}
                    />
                    <IconButton
                      size="sm"
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => confirmDelete(link)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Delete confirmation */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => { setSelected(null); onClose(); }}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete link</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete <strong>{selected?.code}</strong>? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => { setSelected(null); onClose(); }}>Cancel</Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
