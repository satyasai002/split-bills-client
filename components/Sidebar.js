import Section from "../components/Section";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BiUser, BiGroup } from "react-icons/bi";
import { FaCommentsDollar } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";


export default function Sidebar({ userData, loading, groups }) {
  const history = useRouter();

  function Capital(s) {
    let temp = s.charAt(0).toUpperCase() + s.slice(1);
    return temp;
  }

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    localStorage.clear();
    history.push("/");
  }
  return (
    <Section>
      <Box
        w={{base:"90%",lg:"100%"}}
        m="0"
        p={{ base: "4px", lg: "1rem" }}
        mx={{ base: "2rem", lg: "0px" }}
      >
        <Flex
          direction={{ base: "row", lg: "column" }}
          gap={{ base: 0, md: 5, lg: 10 }}
        >
          <Flex direction="row" alignItems="center" gap={2}>
            <FaCommentsDollar fill="#674fa2" fontSize={40} />
            <Text fontSize={{ base: 30, md: 30, lg: 40 }} fontWeight={{base:"200"}}>Bill Split</Text>
          </Flex>
          <Spacer />
          {loading && (
            <Flex
              direction="row"
              backgroundColor="#674fa2"
              borderRadius="20px"
              color="white"
              p={{ base: "5px", lg: "20px" }}
              alignItems="center"
              gap={3}
            >
              <BiUser size={30} />
              <Flex direction="column" display={{ base: "none", lg: "flex" }}>
                <Text fontSize={15}>{Capital(userData.name)}</Text>
                <Text fontSize={10}>{Capital(userData.email)}</Text>
              </Flex>
            </Flex>
          )}

          <Box display={{ base: "none", lg: "block" }}>
            <Text fontSize={20} mb="10px">
              Groups
            </Text>
            <Flex direction="column" gap={3}>
              {loading &&
                groups?.map((post,index) => {
                  return (
                    <Flex
                    key={index}
                      direction="row"
                      backgroundColor="#ecddfe"
                      p="10px"
                      borderRadius="20px"
                      alignItems="center"
                      gap={3}
                    >
                      <BiGroup size={23} />
                      <Text fontWeight={500}>{Capital(post.groupName)}</Text>
                    </Flex>
                  );
                })}
            </Flex>
          </Box>
          <Button ml={{base:"1rem",lg:"0px"}} onClick={logout} p={{base:"2px",md:" "}}><IoExitOutline size={30}/></Button>
        </Flex>
      </Box>
    </Section>
  );
}
