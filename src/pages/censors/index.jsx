import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Spinner } from "@chakra-ui/spinner";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { GENDER } from "configs";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React, { useEffect, useState } from "react";
import { approveCert, getCertsPending } from "utils/getCertContract";

const certTypes = {
  pending: "pending",
  reviewed: "reviewed",
};

const Censors = () => {
  const { account, library } = useActiveWeb3React();

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [selectedCertType, setSelectedCertType] = useState(certTypes.pending);
  const [certsPending, setCertsPending] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (library) {
        try {
          const certs = await getCertsPending(library);
          setCertsPending(certs);
          setLoading(false);
        } catch (error) {
          !!certsPending?.length && setCertsPending([]);
          setLoading(false);
          console.error(error);
        }
      }
    })();
  }, [library, refresh]);

  const handleAcceptCert = async (certIdx) => {
    if (!library || !account || submitting) return;

    try {
      setSubmitting(true);
      await approveCert(library, account, [certIdx]);
      setRefresh((pre) => !pre);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  return (
    <Box>
      <HStack>
        <Box>Certificate type</Box>
        <Box>
          <Select
            textTransform="uppercase"
            value={selectedCertType}
            onChange={(e) => setSelectedCertType(e.target.value)}
          >
            {Object.keys(certTypes).map((k, idx) => (
              <option
                key={idx}
                value={certTypes[k]}
                style={{
                  color: "black",
                  textTransform: "uppercase",
                }}
              >
                {certTypes[k]}
              </option>
            ))}
          </Select>
        </Box>
      </HStack>

      <Table variant="simple" size="lg">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Owner's address</Th>
            <Th>Owner's info</Th>
            <Th>Certificate's info</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan="5">
                <Spinner />
              </Td>
            </Tr>
          ) : (
            certsPending.map((censor, idx) => (
              <Tr key={idx}>
                <Td>{idx + 1}</Td>
                <Td>{censor.to}</Td>
                <Td>
                  <Box>Name: {censor.name}</Box>
                  <Box>
                    Gender:{" "}
                    {Object.keys(GENDER).find(
                      (g) => GENDER[g] === censor.gender
                    )}
                  </Box>
                  <Box>Date of birth: {censor.dateOfBirth}</Box>
                  <Box>Graduate grade: {censor.graduateGrade}</Box>
                  <Box>Minted where: {censor.mintWhere}</Box>
                </Td>
                <Td>
                  <Box>
                    Specialized training:{" "}
                    {censor.cert?.specializedTraining?.name} -{" "}
                    {censor.cert?.specializedTraining?.vnName}
                  </Box>
                  <Box>Year: {censor.cert?.year}</Box>
                  <Box>Study mode: {censor.cert?.modeStudy}</Box>
                </Td>
                <Td isNumeric>
                  <Button
                    colorScheme="teal"
                    mr="2"
                    onClick={() => handleAcceptCert(idx)}
                    isLoading={submitting}
                  >
                    Approve
                  </Button>
                  <Button colorScheme="red">Reject</Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Censors;
