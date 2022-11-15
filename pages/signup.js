
import { useState, useEffect } from "react";
import Section from "../components/Section";
import {
  Heading,
  Text,
  Button,
  Flex,
  Container,
  Input,
  Box,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

import { FaCommentsDollar } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

export default function Signup(){
   const [email, setEmail] = useState();
   const [password, setPassword] = useState();
   const [fullName, setFullName] = useState();
   const [mobile, setMobile] = useState();
   const [showPassword, setShow] = useState(false); 
   const history = useRouter();
   if (typeof window !== "undefined") {
     if (localStorage.getItem("token")) {
       history.push("/dashboard");
     }
   }
   useEffect(() => {
     if (localStorage.getItem("token")) {
       history.push("/dashboard");
     }
   }, []);
   async function signup() {
     let item = {
       fullName: fullName,
       mobile: mobile,
       email: email,
       password: password,
     };
     try {
       let result = await axios.post("https://split-bills-api.onrender.com/user/signup",item);
       console.log(result.status);
       if (result != null) {
        history.push("/");
       }
     } catch (e) {
       console.log(e);
     }
   }
  return (
    <>
      <Section delay={0.2}>
         <Flex direction="row" backgroundColor="#f7f2f8" h="100vh" >
          <Box w="50%" display={{ base: "none", lg: "flex" }}>
              <Flex direction="column" gap={6} w="100%" alignItems="center" ml="10%" mt="25%">
                  <Flex direction="row" gap={4} alignItems="center" ml="20%" minW="100vh" >
                    <FaCommentsDollar size={100} fill="#674fa2" />
                    <Text fontSize={60} fontWeight={500}>
                      Bill Split
                    </Text>
                  </Flex>
                  <TypeAnimation 
                    sequence={[
                      "Sharing Bills Is Made Simple !!",
                      1000,
                      "Free Of Charge !!",
                      2000,
                      "No Registration Required !!",
                      () => {
                      },
                    ]}
                    wrapper="div"
                    cursor={true}
                    repeat={Infinity}
                    style={{ fontSize: "2.5em",width:"100%",fontWeight:"10",marginLeft:"10rem" }}
                  />
              </Flex>
          </Box>
        <Center backgroundColor="#f7f2f8" h="100vh" w={{base:"100%",lg:"50%"}}>
          <Container
            maxW={{ base: "container.sm",lg:"30rem" }}
            my={12}
            w="100%"
            p="20px"
            borderWidth={3}
            borderRadius={16}
            backgroundColor="#eee8f4"
            boxShadow="lg"
          >
            <Flex direction="column" gap={3}>
              <Heading
                textAlign="center"
                fontWeight="600"
                fontSize="48px"
                mt={4}
                letterSpacing="10px"
              >
                SIGN UP
              </Heading>
            </Flex>
            <Flex px={{ base: 2, lg: "50px" }} flexDirection="column" gap="9px">
              <Flex flexDirection="column" justifyContent="center" width="100%">
                <Text  fontWeight="500" fontSize="18px">
                  Name
                </Text>
                <Input
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                  width="100%"
                  boxShadow="md"
                  borderRadius="6px"
                  backgroundColor="white"
                />
              </Flex>
              <Flex flexDirection="column" justifyContent="center" width="100%">
                <Text fontWeight="500" fontSize="18px">
                  Mobile Number
                </Text>
                <Input
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                  width="100%"
                  boxShadow="md"
                  borderRadius="6px"
                  backgroundColor="white"
                />
              </Flex>
              <Flex flexDirection="column" justifyContent="center" width="100%">
                <Text fontWeight="500" fontSize="18px">
                  Email
                </Text>
                <Input
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="email"
                  width="100%"
                  boxShadow="md"
                  borderRadius="6px"
                  backgroundColor="white"
                />
              </Flex>
              <Flex flexDirection="column" justifyContent="center" width="100%">
                <Text fontWeight="500" fontSize="18px">
                  Password
                </Text>
                <Input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  width="100%"
                  boxShadow="md"
                  borderRadius="6px"
                  backgroundColor="white"
                />
              </Flex>

              <Flex gap="2px" justifyContent="center" flexDirection="column">
                <Button
                  width="100%"
                  px="3"
                  my="20px"
                  borderRadius="10px"
                  color="white"
                  backgroundColor="#674fa2"
                  boxShadow="lg"
                  onClick={signup}
                >
                  Sign Up
                </Button>
                <Flex gap="4px">
                  <Text fontWeight="500">Already have an Account ?</Text>
                  <Text
                    cursor="pointer"
                    fontWeight="500"
                    color="#674fa2"
                    onClick={() => {
                      history.push("/");
                    }}
                  >
                    Log In
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Container>
        </Center>
        </Flex>
      </Section>
    </>
  );
}
