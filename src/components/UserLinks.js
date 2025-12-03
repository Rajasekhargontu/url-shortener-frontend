// src/components/UserLinks.jsx
import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Center, useToast } from "@chakra-ui/react";
import LinksTable from "./LinkTable";
// import ShortLinkModal from "./ShortLinkModal";   // optional: reuse existing ShortLinkModal for display
import AnalyticsModal from "./AnalyticsModal";  // component you already have or use simple modal
import { useAuth } from "../AuthContext";
import { getLinks, deleteLink, getAnalytics } from "../services/api";

/**
 * UserLinks - container that fetches & manages user's links
 */
export default function UserLinks() {
  const { token } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const toast = useToast();

  async function loadLinks() {
    setLoading(true);
    try {
      //console.log("Fetching links with token:", token);
      const res = await getLinks(token);
      setLinks(res.links || []);
    } catch (err) {
      console.error("getLinks error", err);
      toast({ title: "Could not load links", status: "error", isClosable: true });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
    // eslint-disable-next-line
  },[]);

  async function handleDelete(code) {
    try {
      await deleteLink(code, token);
      toast({ title: "Deleted", status: "success", isClosable: true });
      await loadLinks();
    } catch (err) {
      console.error("deleteLink error", err);
      toast({ title: "Delete failed", description: err?.body?.message || "Try again", status: "error", isClosable: true });
    }
  }
  async function handleAnalytics(code) {
    try {
      const res = await getAnalytics(code, token);
      //console.log(res);
      setAnalytics(res);
      setAnalyticsOpen(true);
    } catch (err) {
      console.error("getAnalytics error", err);
      toast({ title: "Failed to load analytics", status: "error", isClosable: true });
    }
  }

  return (
    <Box w="70%" m={10}>
      <Heading size="md" m={2}>Your Links</Heading>

      {loading ? (
        <Center py={8}><Spinner /></Center>
      ) : (
        <LinksTable links={links} onDelete={handleDelete} onAnalytics={handleAnalytics} />
      )}

      {/* Analytics Modal (reuse your AnalyticsModal component) */}

      {analytics!==null && <AnalyticsModal
        isOpen={analyticsOpen}
        onClose={() => { setAnalyticsOpen(false); setAnalytics(null); }}
        analytics={analytics}
      />}
    </Box>
  );
}
