import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <Box maxW="md" mx="auto" mt={20} p={6} borderWidth={1} borderRadius="md">
      {mode === "login" ? 
        <Login switchToRegister={() => setMode("register")} /> :
        <Register switchToLogin={() => setMode("login")} />
      }
    </Box>
  );
}
