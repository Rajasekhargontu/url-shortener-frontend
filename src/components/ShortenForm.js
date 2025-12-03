// src/components/ShortenForm.jsx
import React, { useState } from "react";
import {
  Box, Input, Button, HStack, useToast, VStack, FormControl, FormLabel
} from "@chakra-ui/react";
import { shorten } from "../services/api";
import { useAuth } from "../AuthContext";
import ShortLinkModal from "./ShortLinkModal.js";

export default function ShortenForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [custom, setCustom] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState(null); // store created short url
  const [isModalOpen, setModalOpen] = useState(false);
  const toast = useToast();
  const { token } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url) {
      toast({ title: "Enter a URL", status: "warning", duration: 2000 });
      return;
    }
    setLoading(true);
    try {
      const expires_in = expiryDays ? Number(expiryDays) * 24 * 60 * 60 : undefined;

      const res = await shorten(
        url,
        token || null,
        custom || undefined,
        expires_in
      );

      // res expected to contain either a full short URL (res.short) or { code }
      // normalize to a full URL for display
      let finalShort =`${process.env.REACT_APP_BASE_URL}/links/${res.url_code}`;

      setShortUrl(finalShort);
      setModalOpen(true);

      toast({
        title: "Short URL created",
        description: finalShort,
        status: "success",
        isClosable: true,
      });

      setUrl("");
      setCustom("");
      setExpiryDays("");

      if (onCreated) onCreated();
    } catch (err) {
      const msg = err?.body?.message || (err?.message ? String(err.message) : "Could not create short url");
      toast({ title: "Error", description: msg, status: "error", isClosable: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Box borderWidth={1} borderRadius="md" p={4} mb={4} w="70%" height="50%" m={20}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={3} align="stretch">
            <FormControl>
              <FormLabel>Long URL</FormLabel>
              <Input
                placeholder="https://example.com/very/long/path"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Custom code (optional)</FormLabel>
              <Input
                placeholder="my-brand"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Expiry (in days, optional)</FormLabel>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 7"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
              />
            </FormControl>

            <HStack>
              <Button colorScheme="blue" type="submit" isLoading={loading}>
                Shorten
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setUrl(""); setCustom(""); setExpiryDays(""); }}
              >
                Clear
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>

      <ShortLinkModal
        isOpen={isModalOpen}
        onClose={() => { setModalOpen(false); setShortUrl(null); }}
        shortUrl={shortUrl}
      />
    </>
  );
}
