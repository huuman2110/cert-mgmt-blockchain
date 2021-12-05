import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { connectors } from "connectors";
import { useWallet } from "connectors/hooks";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "styles/Layout.css";
import Logo from "assets/images/logo.png";
import { Image } from "@chakra-ui/image";
import { GlobalContext } from "context/GlobalContext";
import { getOwnerRoles } from "utils/getCertContract";

export const Layout = ({ children }) => {
  const { account, isConnected, chainId, library } = useActiveWeb3React();
  const { connect } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setCurrentUser } = useContext(GlobalContext);

  useEffect(() => {
    if (account && chainId && library) {
      getOwnerRoles(library, account)
        .then((roles) => {
          setCurrentUser({
            account,
            chainId,
            roles,
          });
        })
        .catch((err) => {
          setCurrentUser({});
          console.error(err);
        });
    }
  }, [library, account, chainId]);

  return (
    <Box minH="100vh">
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <Modal size="sm" isOpen={isOpen && !isConnected} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap="12">
              {connectors.map((c, idx) => (
                <VStack
                  key={idx}
                  cursor="pointer"
                  p="4"
                  borderRadius="md"
                  _hover={{
                    bg: "gray.300",
                  }}
                  onClick={() => connect(c.connector)}
                >
                  <Box h="12">{c.icon}</Box>
                  <Text as="b" textAlign="center">
                    {c.name}
                  </Text>
                </VStack>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <HStack
        h="24"
        px="8"
        py="4"
        align="center"
        flex="1"
        justify="space-between"
        spacing="4"
      >
        <Link to="/">
          <Image h="20" src={Logo} />
        </Link>
        {isConnected ? (
          <Link to="/">
            <Button colorScheme="teal">
              {account.slice(0, 6)}...
              {account.slice(account.length - 6, account.length)}
            </Button>
          </Link>
        ) : (
          <Button colorScheme="teal" onClick={onOpen}>
            Connect wallet
          </Button>
        )}
      </HStack>
      <Box minH="calc(100vh - 10em)" px="8" py="4" pos="relative">
        {children}
      </Box>

      <Box textAlign="center" p="4">
        © {new Date().getFullYear()} Copyright
      </Box>
    </Box>
  );
};
