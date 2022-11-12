import { useState, useEffect } from "react";
import Select from "react-select";
import {
  Button,
  Container,
  Input,
  Text,
  Modal,
  Flex,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Box,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { BiBell } from "react-icons/bi";
import { BsFillCircleFill } from "react-icons/bs";
import TopContainer from "./dashboard/Topcontainer";

export default function MainDashboard({ userData, loading }) {
  const [users, setUsers] = useState();
  const [notification, setNotification] = useState(false);
  const {
    isOpen: isAdduserOpen,
    onOpen: onAdduserOpen,
    onClose: onAdduserClose,
  } = useDisclosure();
  const {
    isOpen: isNotificationOpen,
    onOpen: onNotificationOpen,
    onClose: onNotificationClose,
  } = useDisclosure();
  function Capital(s) {
    let temp = s?.charAt(0).toUpperCase() + s?.slice(1);
    return temp;
  }
  useEffect(() => {
    async function fetchData() {
      let item = {
        search: "",
      };
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
      let Users = await axios
        .post(`https://split-bills-api.onrender.com/user/`, item)
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
      setUsers(Users.data);
    }
    fetchData();
    GetNotifications();
  }, []);
  async function GetNotifications() {
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
    const res = await axios.get(`https://split-bills-api.onrender.com/notification`);
    if (res.data[0]) {
      setNotification(true);
    }
  }
  function AddUserModal() {
    const [grpName, setGrpName] = useState();
    const [add, setAdd] = useState();
    let options;
    if (typeof users !== undefined) {
      options = users?.map((member) => {
        const temp = {
          value: member._id,
          label: member.email,
        };
        return temp;
      });
    }

    async function creategroup() {
      let data;
      if (typeof add !== undefined) {
        try {
          data = add.map((item) => {
            return item.value;
          });
        } catch {
          alert("please enter atleast one member");
        }
      }
      console.log(data);
      let item = {
        name: grpName,
      };


      try {
        let token = await JSON.parse(localStorage.getItem("token"));
        console.log(token);
        axios.interceptors.request.use(
          (config) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );
        let result = await axios.post(
          "https://split-bills-api.onrender.com/group/addgroup",
          item
        );
        let items = {
          groupId: result.data.createdGroup.Id,
          userId: data,
        };
        let result1 = await axios.post(
          "https://split-bills-api.onrender.com/group/adduser",
          items
        );

        if (result != null || !result.error) {
          setOpen(false);
        } else {
          return;
        }
      } catch (e) {
        console.log(e);
      }
      window.location.reload();
    }

    return (
      <>
        <Modal isOpen={isAdduserOpen} onClose={onAdduserClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Users</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" gap={4}>
                <Input
                  onChange={(e) => {
                    setGrpName(e.target.value);
                  }}
                  placeholder="Enter Group name"
                ></Input>
                <Select
                  options={options}
                  isMulti
                  onChange={(items) => {
                    setAdd(items);
                  }}
                />
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onAdduserClose}>
                Close
              </Button>
              <Button variant="ghost" onClick={creategroup}>
                Create Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  function Notifications() {
    const [notification, setNotification] = useState(false);
    const [data, setData] = useState(undefined);
    const [isChange, setIsChange] = useState(false);
    useEffect(() => {
      NotificationsData();
    }, [isChange]);
    async function NotificationsData() {
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
      const res = await axios.get(`https://split-bills-api.onrender.com/notification`);
      setData(res.data);
      if (res.data[0]) {
        setNotification(true);
        
      }
    }
    async function JoinGroup(id, _id) {
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
      const item = {
        groupId: id,
        notificationId: _id,
      };
      const res = await axios.post(`https://split-bills-api.onrender.com/group/join`, item);
      console.log(res.data);
      setIsChange(!isChange);
    }
    async function DeleteNotification(id) {
      try {
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
        const res = await axios.delete(
          `https://split-bills-api.onrender.com/notification/${id}`
        );
        setIsChange(!isChange);
      } catch (err) {
        console.log(err);
      }
    }
    return (
      <>
        <Modal isOpen={isNotificationOpen} onClose={()=>{window.location.reload()}}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Notifications</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {notification ? (
                <Box>
                  <Flex direction="column">
                    {data?.map((item) => {
                      return (
                        <Box key={item._id} boxShadow="lg" p="20px">
                          <Text fontWeight={500} fontSize="20px">
                            {Capital(item.data?.groupName)}
                          </Text>
                          <Text fontSize="18px">{`${Capital(
                            item.from.fullName
                          )} wants to add you to the "${Capital(
                            item.data?.groupName
                          )}" group`}</Text>
                          <Flex direction="row" w="100%" gap={3} mt="3px">
                            <Button
                              colorScheme="blue"
                              px="20px"
                              py="2px"
                              borderRadius="20px"
                              onClick={(e) => {
                                JoinGroup(item.data?._id, item?._id);
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              px="20px"
                              py="2px"
                              borderRadius="20px"
                              onClick={(e) => {
                                DeleteNotification(item?._id);
                              }}
                            >
                              Remove
                            </Button>
                          </Flex>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
              ) : (
                <Text>No Notifications found</Text>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                nClose={() => {
                  onNotificationClose, window.location.reload();
                }}
                mr={3}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  return (
    <Box
      backgroundColor="#f7f2f8"
      p="3rem"
      h="100%"
      minH="100vh"
      borderRadius={{ base: "60px 60px 0px 0px", lg: "60px 0px 0px 0px" }}
    >
      <Flex direction="row" gap={4} alignItems="center">
        <Input
          w="80%"
          placeholder="group name"
          backgroundColor="white"
          onChange={(e) => {
            setGrpName(e.target.value);
          }}
        ></Input>
        <Flex direction="row">
          <BiBell
            style={{ cursor: "pointer" }}
            onClick={onNotificationOpen}
            size={20}
          />
          <BsFillCircleFill
            fill="red"
            visibility={notification ? "" : "collapse"}
            size="10px"
          />
        </Flex>
        <Button onClick={onAdduserOpen}>add group</Button>
      </Flex>
      <Notifications />
      <AddUserModal />
      <TopContainer userData={userData} loading={loading} />
    </Box>
  );
}
