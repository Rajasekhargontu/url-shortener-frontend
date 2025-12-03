// import react from "react";
import {Flex} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import UserLinks from "../components/UserLinks";
export default function ShortenPage(){
    return(
        <Flex width="100%" height="100vh">
            <Sidebar></Sidebar>
            <UserLinks></UserLinks>
        </Flex>
    )
}