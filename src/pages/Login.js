import { Box, Button, Input, VStack, Heading } from "@chakra-ui/react";
import { login } from "../services/api";
import { useAuth } from "../AuthContext";
import { useToast } from "@chakra-ui/react";
// import { setToken } from "../services/auth";
import { useState } from "react";
export default function Login({ switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const { setToken } = useAuth();
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if(res.status==="success"){
      setToken(res.token);
      toast({
        title: res.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });} else {
        toast({
        title: res.message,
        status: "error",
        duration: 2000,
      });}
    } catch (err) {
      toast({
        title: "Unexpected error",
        status: "error",
        duration: 2000,
      });
    }
  }
  return (
    <Box>
      <Heading size="lg" mb={4}>Login</Heading>
      <VStack as="form" onSubmit={handleLogin} spacing={3}>
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}  type="email"/>
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} />
        <Button type="submit" colorScheme="blue" w="full">Login</Button>
        <Button variant="link" onClick={switchToRegister}>Create an account</Button>
      </VStack>
    </Box>
  );
}
