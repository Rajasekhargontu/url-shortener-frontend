import { Box, Button, Input, VStack, Heading } from "@chakra-ui/react";
import { register } from "../services/api";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
export default function Register({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const data=await register(email, password);
      const res=await data.json();
      //console.log(res);
      if(res.status==="success"){
      toast({
        title: res.messsage,
        description:"Successfully registered! Please login.",
        status: "success",
        duration: 2000,
      });
      switchToLogin(null);
    }
    else{
      toast({
        title: res.messsage,
        description:"Email may already be registered",  
        status: "error",
        duration: 2000,
      });
    }
    } catch (err) {
      toast({
        title: "Registration failed",
        status: "error",
        duration: 2000,
      });
    }
  }
  return (
    <Box>
      <Heading size="lg" mb={4}>Register</Heading>
      <VStack as="form" onSubmit={handleRegister} spacing={3}>
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} />
        <Button type="submit" background="green.300" w="full" _hover={{background:"green.400"}}>Register</Button>
        <Button variant="link" onClick={switchToLogin}>Already have an account? Login</Button>
      </VStack>
    </Box>
  );
}
