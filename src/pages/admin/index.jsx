import { Box, HStack } from "@chakra-ui/layout";
import React, { useState } from "react";
import Censor from "./Censor";
import Cert from "./Cert";

const menu = {
  censor: {
    value: "censor",
    component: <Censor />,
  },
  cert: {
    value: "cert",
    component: <Cert />,
  },
};

const Admin = () => {
  const [selectedItem, setSelectedItem] = useState(menu.censor);

  return (
    <Box>
      <HStack spacing="8">
        {Object.keys(menu).map((k, idx) => (
          <Box
            key={idx}
            fontSize="xl"
            fontWeight="bold"
            textTransform="uppercase"
            borderColor="#000"
            borderBottom={
              selectedItem.value == menu[k].value ? "4px solid" : ""
            }
            cursor="pointer"
            onClick={() => setSelectedItem(menu[k])}
          >
            {menu[k].value}
          </Box>
        ))}
      </HStack>

      <Box py="4">{selectedItem?.component}</Box>
    </Box>
  );
};

export default Admin;
