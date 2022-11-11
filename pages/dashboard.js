import Sidebar from "../components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import MainDashboard from "../components/MainDashboard";
import { useState, useEffect } from "react";
import axios from "axios";

import { useRouter } from "next/router";
export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [groups, setGroups] = useState();
  const [token,setToken]=useState()
  
  useEffect(() => {
    try {
      const accToken = localStorage.getItem("token");
      setToken(accToken);
    } catch (e) {}
  }, [token]);

  const history = useRouter();
  useEffect(() => {
    getUserdata();
  },[token]);
  async function getUserdata() {
        if(typeof token !== undefined){
        const header = `Authorization: Bearer ${token}`;
        let userdata = await axios
          .get("https://split-bills-api.onrender.com/user/profile", { headers: { header } })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status == 401) {
                localStorage.clear();
                history.push("/login");
              }
            }
          });
        let Groups = await axios
          .get(`https://split-bills-api.onrender.com/group/`, { headers: { header } })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status == 401) {
                localStorage.clear();
                setUserData();
                setGroups();
                setToken();
                history.push("/login");
              }
            }
          });
        setGroups(Groups.data);
        setUserData(userdata.data);
        setLoading(true);
        }
  }

  return (
    <Box minH="100vh" w="100%">
      <Flex marginTop="3rem" direction={{ base: "column", lg: "row" }} w="100%">
        <Box w={{ base: "100%", lg: "30%" }}>
          <Sidebar userData={userData} groups={groups} loading={loading} />
        </Box>
        <Box w="100%">
          <MainDashboard userData={userData} loading={loading} />
        </Box>
      </Flex>
    </Box>
  );
}
