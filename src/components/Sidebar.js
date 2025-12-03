import { VStack, Box, Heading, Button, Icon, Text } from "@chakra-ui/react";
import { AddIcon, LinkIcon, UnlockIcon} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
export default function Sidebar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout=()=>{
    auth.setToken();
    // navigate("/auth");
  }
  return (
    <Box as="aside" w="20%" borderRightWidth="1px" p={4}>
      <Heading size="xl" ml={6} mb={4} height={100}>Shortify</Heading>

      <VStack align="stretch" spacing={2}>
        <Button
          leftIcon={<Icon as={AddIcon} />}
          justifyContent="flex-start"
          variant="ghost"
          onClick={() => navigate("/shorten")}
        >
          Create new link
        </Button>

        <Button
          leftIcon={<Icon as={LinkIcon} />}
          justifyContent="flex-start"
          variant="ghost"
          onClick={() =>navigate("/mylinks")}
        >
          My links
        </Button>
        <Button
          leftIcon={<Icon as={UnlockIcon} />}
          justifyContent="flex-start"
          variant="ghost"
          onClick={handleLogout}
          _hover={{
        bg: "red.600", // Darken the background color on hover
        shadow: "lg",  // Add a large shadow
        transform: "scale(1.05)",
        textColor:"white",// Slightly scale up
      }}
        >
          Logout
        </Button>
        <Box mt={6} px={2}>
          <Text fontSize="xs" color="gray.500">Tip: select an option to begin</Text>
        </Box>
      </VStack>
    </Box>
  );
}
