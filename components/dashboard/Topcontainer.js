import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import Section from "../Section";
import { Button, ChakraProvider, Input, Text,Flex,Grid } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import Organization from "./Organization";

export default function TopContainer({ userData ,loading }) {
  const [group, setGroup] = useState([]);
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
      let Groups = await axios
        .get(`https://split-bills-api.onrender.com/group/`)
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
      setGroup(Groups.data);
    }
    fetchData();
  }, []);

  return (
      <Flex direction="column" justifyContent="center" maxW={{ xl: "1200px" }} mt={8}>
        <Grid
          w="full"
          gridGap="5"
          gridTemplateColumns="repeat( auto-fit, minmax(300px, 1fr) )"
        >
          {group?.map((post, index) => {
            return (
              <>
                <Organization
                  key={index}
                  name={post.groupName}
                  group={post}
                  id={post._id}
                  userData={userData}
                  loading={loading}
                />
              </>
            );
          })}
        </Grid>
      </Flex>
  );
}
