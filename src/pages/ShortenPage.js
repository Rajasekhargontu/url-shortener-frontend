// import react from "react";
import {Flex} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ShortenForm from "../components/ShortenForm";
export default function ShortenPage(){
    return(
        <Flex width="100%" height="100vh">
            <Sidebar></Sidebar>
            <ShortenForm></ShortenForm>
        </Flex>
    )
}