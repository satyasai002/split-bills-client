import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, React } from "react";
import Select from "react-select";
import {
  Button,
  Container,
  Input,
  Text,
  Modal,
  Flex,
  Badge,
  Box,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Center,
  Spacer,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import {} from "@chakra-ui/hooks";
import { FaBalanceScale } from "react-icons/fa";
import {
  BiAddToQueue,
  BiChevronsRight,
  BiTrash,
} from "react-icons/bi";

export default function Organizations({
  name,
  id,
  group,
  userData,
  loading,
}) {
  const [expenses, setExpenses] = useState();

  const history = useRouter();
  const [split, setSplit] = useState(false);
  const [finalSplit, setFinalSplit] = useState([]);

  const {
    isOpen: isExpenseOpen,
    onOpen: onExpenseOpen,
    onClose: onExpenseClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  function isAdmin() {
    if (loading) {
      return userData.Id == group.admin._id;
    }
  }
  function isExpenseAdmin(a) {
    if (loading) {
      return userData.Id == a;
    }
  }

  useEffect(() => {
    async function fetchData() {
      let token = JSON.parse(localStorage.getItem("token"));
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      let grpId = {
        expGrp: id,
      };
      let Expenses = await axios.post(`https://split-bills-api.onrender.com/expense/`, grpId);
      setExpenses(Expenses.data);
    }
    fetchData();
  }, []);
  function Capital(s) {
    let temp = s.charAt(0).toUpperCase() + s.slice(1);
    return temp;
  }
  async function DeleteExpense(expense){
       let token = await JSON.parse(localStorage.getItem("token"));
       axios.interceptors.request.use(
         (config) => {
           config.headers.Authorization = `Bearer ${token}`;
           return config;
         },
         (error) => {
           return Promise.reject(error);
         }
       );
       const res = await axios
         .delete(`https://split-bills-api.onrender.com/expense/${expense}`)
         .catch(function (error) {
           if (error.response) {
             if (error.response.status == 401) {
               localStorage.clear();
               setUserData();
               setGroups();
               setToken();
               history.push("/");
             }
           }
         });
       
       if (res.status == 200) {
         window.location.reload();
       }
  }
  async function FinalSplit() {
    if (split) {
      setSplit(false);
    } else {
      try {
        let token = JSON.parse(localStorage.getItem("token"));
        axios.interceptors.request.use(
          (config) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );
        let paidby = await axios.post(`https://split-bills-api.onrender.com/group/split`, {
          expGrp: id,
        });
        if (paidby != null) {
          setFinalSplit(paidby.data);
          setSplit(true);
        } else {
          return;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  function DeleteGrp() {
    async function Delete() {
      let token = await JSON.parse(localStorage.getItem("token"));
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      const res = await axios.delete(`https://split-bills-api.onrender.com/group/${id}`);
      if (res.status == 200) {
        window.location.reload();
      }
    }
    return (
      <>
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{Capital(name)}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure do you want to delete this group ?
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
                Close
              </Button>
              <Button colorScheme="red" onClick={Delete}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  function AddExpenseModal() {
    const [splitBtw, setSplitBtw] = useState([]);
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const options = group.members.map((member) => {
      const temp = {
        value: member._id,
        label: Capital(member.fullName),
      };
      return temp;
    });
    const [data, setData] = useState([]);
    useEffect(() => {
      const temp = splitBtw.map((member) => {
        const x = {
          Id: member.value,
          amount: "",
        };
        setData([...data, x]);
      });
    }, [splitBtw]);
    const ChangeHandler = (i, e) => {
      let temp = data;
      temp[i].amount = e.target.value;
      setData(temp);
    };
    const CreateExpense = async () => {
      let item = {
        expName: name,
        expAmt: amount,
        userSplitBtw: data,
        expGrp: id,
      };
      let token = await JSON.parse(localStorage.getItem("token"));
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      const res = await axios.post(
        "https://split-bills-api.onrender.com/expense/addexpense",
        item
      );
      if (res.status == 201) {
        window.location.reload();
      }
    };
    return (
      <>
        <Modal
          isOpen={isExpenseOpen}
          onClose={onExpenseClose}
          maxW="container.lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Expense</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" gap={4}>
                <Input
                  placeholder="Name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                ></Input>
                <Input
                  placeholder="Amount"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                ></Input>
                <Select
                  options={options}
                  isMulti
                  onChange={(items) => {
                    setSplitBtw(items);
                  }}
                />
                {splitBtw?.map((member, index) => {
                  return (
                    <Box key={index}>
                      <Flex direction="row" w="100%" gap={4}>
                        <Text w="100px">{member.label}</Text>
                        <Input
                          w="50%"
                          id={member.value}
                          placeholder="Enter Amount"
                          onChange={(e) => {
                            ChangeHandler(index, e);
                          }}
                        ></Input>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={CreateExpense}>
                Create Expense
              </Button>
              <Button mr={3}>Split Equally & Create</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Container
      maxW={{ base: "container.xl" }}
      my={2}
      w="100%"
      minH={{ base: "10vh", md: "20vh", lg: "40vh" }}
      borderWidth={3}
      borderRadius={16}
      boxShadow="lg"
      p="20px"
      backgroundColor="#eee8f4"
    >
      <Flex direction="row" mb="30px" alignItems="center">
        <Flex direction="row" w="40%" alignItems="center" gap={2}>
          <Text fontSize="20px" fontWeight={500}>
            {Capital(name)}
          </Text>
          {isAdmin() && (
            <Badge mt="2px" fontSize="10px" colorScheme="green">
              Admin
            </Badge>
          )}
        </Flex>
        <Spacer />
        <Box float="right">
          <Flex direction="row" gap="30" pr="20px">
            <div style={{ cursor: "pointer" }} onClick={FinalSplit}>
              <FaBalanceScale size={20} />
            </div>
            <div onClick={onExpenseOpen} style={{ cursor: "pointer" }}>
              <BiAddToQueue size={20} />
            </div>

            {isAdmin() && (
              <div onClick={onDeleteOpen} style={{ cursor: "pointer" }}>
                <BiTrash color="red" size={20} />
              </div>
            )}
          </Flex>
        </Box>
        <DeleteGrp />
      </Flex>
      {split ? (
        <Flex direction="column" gap={4}>
          {finalSplit.map((item,index) => {
            return (
              <Flex
              key={index}
                direction="row"
                gap={2}
                backgroundColor="white"
                p="15px"
                borderRadius="8px"
                alignItems="center"
              >
                <Text>{Capital(item[0])}</Text>
                <BiChevronsRight size={20} />
                <Text>{Capital(item[1])}</Text>
                <Text
                  backgroundColor="#f4d9e4"
                  p="2px"
                  borderRadius="10px"
                  fontWeight={500}
                >
                  ₹{item[2]}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      ) : (
        <Accordion allowToggle>
          {expenses?.map((post,index) => {
            return (
              <Flex direction="row" key={index} w="100%" gap={2} alignItems="center">
                <AccordionItem
                  backgroundColor="white"
                  borderRadius="20px"
                  minH="80px"
                  mb="4px"
                  w="100%"
                >
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Flex direction="column">
                          <Flex direction="row" alignItems="center">
                            <Text w="90%" fontSize={18}>
                              {Capital(post.expName)}
                            </Text>
                          </Flex>
                          <Flex direction="row" gap={8}>
                            <Text
                              backgroundColor="#f4d9e4"
                              p="4px"
                              borderRadius="10px"
                              fontWeight={500}
                            >
                              ₹{post.expAmt}
                            </Text>
                            <Text fontSize={16}>
                              {loading
                                ? post.expPaidBy._id == userData.Id
                                  ? "You"
                                  : Capital(post.expPaidBy.fullName)
                                : "Loading..."}
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Flex direction="column" gap={4}>
                      {post.userSplitBtw?.map((item,index) => {
                        return (
                          <Flex key={index} direction="row" gap={8}>
                            <Text w="75%" fontSize={20} fontWeight={400}>
                              {loading
                                ? item.Id._id == userData.Id
                                  ? "You"
                                  : Capital(item.Id.fullName)
                                : "Loading..."}
                            </Text>
                            <Text
                              backgroundColor="#f4d9e4"
                              p="4px"
                              px="8px"
                              borderRadius="10px"
                              fontWeight={500}
                            >
                              ₹{item.amount}
                            </Text>
                          </Flex>
                        );
                      })}
                    </Flex>
                    <Center>
                      {isExpenseAdmin(post.expPaidBy._id) && (
                        <Text
                          fontWeight={500}
                          color="red"
                          style={{ cursor: "pointer" }}
                          onClick={(event) => DeleteExpense(post._id)}
                        >
                          Settle Expense
                        </Text>
                      )}
                    </Center>
                  </AccordionPanel>
                </AccordionItem>
              </Flex>
            );
          })}
        </Accordion>
      )}
      {expenses?.length == 0 && (
        <Center>
          <Text>No Expenses Yet</Text>
        </Center>
      )}

      <AddExpenseModal />
    </Container>
  );
}
