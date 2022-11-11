import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Section from "../components/Section";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Container,
  Input,
  Center,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputRightElement,
  Checkbox,
  FormControl,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { FaCommentsDollar } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { TypeAnimation } from "react-type-animation";

export default function login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [emailIsError, setEmailIsError] = useState(false);
  const [passwordIsError, setPasswordIsError] = useState(false);
  const [inValidError, setinValidError] = useState(false);

  const [loading, setLoading] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const history = useRouter();
  if (typeof window !== "undefined") {
    if (localStorage.getItem("token")) {
      history.push("/dashboard");
    }
  }
  async function login() {
    if (email === "") {
      setEmailIsError(true);
    }
    if (password === "") {
      setPasswordIsError(true);
    } else {
      setLoading(true);
      let item = { email, password };
      let user;
      try {
        let result = await axios
          .post(`https://split-bills-api.onrender.com/user/login`, item)
          .catch(function (error) {
            if (error.response) {
              if (error.response.status == 401) {
                setinValidError(!inValidError);
              }
            }
          });
        let token = result.data.token;
        if (token) {
          localStorage.setItem("token", JSON.stringify(token));
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <>
      <Section delay={0.2}>
        <Flex direction="row" backgroundColor="#f7f2f8" h="100vh">
          <Box w="50%" display={{ base: "none", lg: "block" }}>
            <Flex
              direction="column"
              gap={6}
              w="100%"
              alignItems="center"
              ml="10%"
              mt="25%"
            >
              <Flex
                direction="row"
                gap={5}
                alignItems="center"
                ml="20%"
                minW="100vh"
              >
                <FaCommentsDollar size={100} fill="#674fa2" />
                <Text fontSize={80} fontWeight={400}>
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
                  () => {},
                ]}
                wrapper="div"
                cursor={true}
                repeat={Infinity}
                style={{
                  fontSize: "2.5em",
                  width: "100%",
                  fontWeight: "10",
                  marginLeft: "10rem",
                }}
              />
            </Flex>
          </Box>
          <Center w={{ base: "100%", lg: "50%" }}>
            <Container
              maxW={{ base: "container.sm", lg: "30rem" }}
              my={12}
              mx={{ sm: "0", md: "0", lg: 10 }}
              w="100%"
              p="10px"
              borderWidth={3}
              backgroundColor="white"
              borderRadius={16}
              boxShadow="md"
            >
              <Heading
                textAlign="center"
                fontWeight="600"
                fontSize="48px"
                my={4}
                letterSpacing="10px"
              >
                LOG IN
              </Heading>
              <Flex
                px={{ base: 2, lg: "50px" }}
                flexDirection="column"
                gap="9px"
              >
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  width="100%"
                >
                  <FormControl isInvalid={emailIsError | inValidError}>
                    <Text
                      fontFamily="'Poppins'"
                      fontWeight="500"
                      fontSize="18px"
                    >
                      Email
                    </Text>
                    <Input
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailIsError(false);
                        setinValidError(false);
                      }}
                      width="100%"
                      boxShadow="md"
                      borderRadius="6px"
                      backgroundColor="white"
                    />
                    {!emailIsError ? (
                      <></>
                    ) : (
                      <FormErrorMessage>Email is required.</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  width="100%"
                >
                  <FormControl isInvalid={passwordIsError | inValidError}>
                    <Text fontWeight="500" fontSize="18px">
                      Password
                    </Text>
                    <InputGroup>
                      <Input
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordIsError(false);
                          setinValidError(false);
                        }}
                        type={showPassword ? "text" : "password"}
                        width="100%"
                        boxShadow="md"
                        borderRadius="6px"
                        backgroundColor="white"
                      />
                      <InputRightElement width="4.5rem">
                        <IconButton
                          color="black"
                          variant="none"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          icon={
                            showPassword ? (
                              <AiFillEyeInvisible />
                            ) : (
                              <AiFillEye />
                            )
                          }
                        />
                      </InputRightElement>
                    </InputGroup>
                    {!passwordIsError ? (
                      <></>
                    ) : (
                      <FormErrorMessage>Password is required.</FormErrorMessage>
                    )}
                    {!inValidError ? (
                      <></>
                    ) : (
                      <FormErrorMessage>Incorrect Credentials</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>
                <Flex justifyContent="space-between">
                  <Checkbox colorScheme="blue" defaultChecked>
                    Remember Me
                  </Checkbox>
                  <Text cursor="pointer" color="#674fa2">
                    Forgot Password?
                  </Text>
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
                    onClick={login}
                  >
                    LOGIN
                  </Button>
                  <Flex gap="4px">
                    <Text fontWeight="500">Don&apos;t have an Account ?</Text>
                    <Text
                      cursor="pointer"
                      fontWeight="500"
                      color="#674fa2"
                      onClick={() => {
                        history.push("/signup");
                      }}
                    >
                      Sign Up
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
