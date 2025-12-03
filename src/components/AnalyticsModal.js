import React, { useMemo } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Box, Text, HStack, VStack, Divider,
  Table, Thead, Tbody, Tr, Th, Td, useClipboard
} from "@chakra-ui/react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
function formatDateShort(d) {
  try { return new Date(d).toLocaleString(); } catch { return d; }
}
export default function AnalyticsModal({ isOpen, onClose, analytics }) {
  //console.log("AnalyticsModal analytics:", analytics);
  const { onCopy } = useClipboard(JSON.stringify(analytics.recentClicks, null, 2));
  const chartData = useMemo(() => {
    return analytics.dailyClicks.map(item => ({ date: `${item._id.day}-${item._id.month}-${item._id.year}`, count: Number(item.count || 0) }));
  }, [analytics]);
  const recent = analytics.recentClicks || [];
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Analytics </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <HStack justify="space-between" align="baseline">
                <Box>
                  <Text fontSize="sm" color="gray.500">URL</Text>
                  <Text fontWeight="semibold" wordBreak="break-all">{analytics.url}</Text>
                </Box>

                <Box textAlign="right">
                  <Text fontSize="sm" color="gray.500">Total clicks</Text>
                  <Text fontWeight="semibold" fontSize="lg">{analytics.totalClicks}</Text>
                </Box>
              </HStack>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>Daily clicks (last 30 days)</Text>
              <Box height="220px">
                {chartData.length === 0 ? (
                  <Text color="gray.500">No data</Text>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 6, right: 8, left: 0, bottom: 6 }} >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" interval={6} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" name="Clicks" fill="#3182CE" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Box>

            <Divider />

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>Recent clicks (latest {recent.length})</Text>

              {recent.length === 0 ? (
                <Text color="gray.500">No recent clicks</Text>
              ) : (
                <Box borderWidth="1px" borderRadius="md" overflowX="auto">
                  <Table size="sm" variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>When</Th>
                        <Th>UA</Th>
                        <Th>Referrer</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {recent.map((c, i) => (
                        <Tr key={i}>
                          <Td whiteSpace="nowrap">{formatDateShort(c.ts)}</Td>
                          <Td maxW="300px" isTruncated>{c.ua ?? "-"}</Td>
                          <Td maxW="240px" isTruncated>{c.referrer ?? "-"}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button onClick={() => { onCopy(); }} size="sm">Copy recent (JSON)</Button>
            <Button onClick={() => {
              if (!recent || recent.length === 0) return;
              const cols = ["ts", "ipHash", "ua", "referrer"];
              const rows = recent.map(r => cols.map(k => {
                const v = r[k] ?? "";
                return `"${String(v).replace(/"/g, '""')}"`;
              }).join(","));
              const csv = [cols.join(","), ...rows].join("\r\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${analytics?.code || "analytics"}-recent.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }} size="sm">Download CSV</Button>

            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
