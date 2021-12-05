import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { ROLES } from "configs";
import { GlobalContext } from "context/GlobalContext";
import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import { FiSearch } from "react-icons/fi";
import Icon from "@chakra-ui/icon";
import { isAddress } from "@ethersproject/address";

const Home = () => {
  const history = useHistory();
  const { isAuthenticated, user } = useContext(GlobalContext);

  const [searchInput, setSearchInput] = useState();

  const handleSearch = () => {
    if (!searchInput || !isAddress(searchInput))
      return alert("Invalid address");

    history.push(`/users/${searchInput}`);
  };

  return (
    <VStack pos="fixed" top="50%" left="50%" transform="translate(-50%,-50%)">
      <Select
        size="lg"
        textTransform="uppercase"
        fontSize="2xl"
        fontWeight="bold"
        _focus={{
          borderColor: "white",
        }}
        onChange={(e) => {
          const roleKey = Object.keys(ROLES).find(
            (k) => ROLES[k].value === +e.target.value
          );
          if (!roleKey) return alert("Invalid Role");
          let path = `/${ROLES[roleKey].name}`;
          if (isAuthenticated) {
            if (ROLES[roleKey].value === ROLES.USER.value) {
              path = `${path}/${user.account}`;
            }
          } else {
            return alert("Connect to wallet");
          }
          history.push(path);
        }}
        defaultValue=""
      >
        <option
          value=""
          disabled
          hidden
          style={{
            color: "black",
            textTransform: "uppercase",
          }}
        >
          choose your role
        </option>
        {Array.isArray(user?.roles) &&
          Object.keys(ROLES)
            .filter(
              (r) =>
                ROLES[r].value === ROLES.USER.value ||
                user.roles.includes(ROLES[r].value)
            )
            .map((k, idx) => (
              <option
                style={{ color: "black", textTransform: "uppercase" }}
                value={ROLES[k].value}
                key={idx}
              >
                {ROLES[k].name}
              </option>
            ))}
      </Select>

      <Box>OR</Box>

      <InputGroup>
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search certificate by address"
          color="black"
        />
        <InputRightElement
          children={
            <Icon onClick={handleSearch} as={FiSearch} cursor="pointer" />
          }
        />
      </InputGroup>
    </VStack>
  );
};

export default Home;
