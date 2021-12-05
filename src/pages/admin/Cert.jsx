import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import { Select } from "@chakra-ui/select";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { isAddress } from "@ethersproject/address";
import { GENDER, GRADUATE_GRADE, STUDY_MODES } from "configs";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React, { useEffect, useState } from "react";
import { uploadIPFS } from "services/upload-ipfs";
import {
  addCert,
  addCertForm,
  addSpecializedTraining,
  deleteCertForm,
  deleteSpecializedTraining,
  getCertForms,
  getSpecializedTrainings,
} from "utils/getCertContract";

const certMenu = {
  certificateType: "SPECIALIZED TRAINING",
  certificates: "CERTIFICATES",
};

const Cert = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenMint,
    onOpen: onOpenMint,
    onClose: onCloseMint,
  } = useDisclosure();
  const { account, library } = useActiveWeb3React();

  const [selectedItem, setSelectedItem] = useState(certMenu.certificates);
  const [refresh, setRefresh] = useState(true);
  const [refreshCert, setRefreshCert] = useState(true);

  const [specializedTrainings, setSpecializedTrainings] = useState([]);
  const [certs, setCerts] = useState([]);
  const [specializedTrainingName, setSpecializedTrainingName] = useState("");
  const [specializedTrainingVnName, setSpecializedTrainingVnName] =
    useState("");

  const [selectedSpecializedTraining, setSelectedSpecializedTraining] =
    useState();
  const [certData, setCertData] = useState({
    specializedTraining: null,
    modeStudy: STUDY_MODES.fullTime,
    total: 1,
    year: new Date().getFullYear(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedCertForm, setSelectedCertForm] = useState();
  const [certMintData, setCertMintData] = useState({
    addr: "",
    name: "",
    gender: GENDER.MALE,
    dateOfBirth: "",
    graduateGrade: GRADUATE_GRADE.A,
    mintWhere: "",
  });

  useEffect(() => {
    if (library)
      getSpecializedTrainings(library)
        .then(setSpecializedTrainings)
        .catch(console.error);
  }, [library, refresh]);

  useEffect(() => {
    if (library) getCertForms(library).then(setCerts).catch(console.error);
  }, [library, refreshCert]);

  const handleAddSpecializedTraining = async () => {
    try {
      if (!account || !library) return;
      if (!specializedTrainingName) return alert("Fill all required fields");

      setSubmitting(true);
      await addSpecializedTraining(library, account, [
        specializedTrainingName,
        specializedTrainingVnName,
      ]);
      setRefresh((pre) => !pre);
      setSpecializedTrainingName("");
      setSpecializedTrainingVnName("");

      setSubmitting(false);
      onClose();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  const handleDeleteSpecializedTraining = async (idx) => {
    try {
      if (!account || !library || typeof idx !== "number") return;

      setDeleting(true);
      await deleteSpecializedTraining(library, account, [idx]);
      setRefresh((pre) => !pre);
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      console.error(error);
    }
  };

  const handleAddCertForm = async () => {
    try {
      if (!account || !library) return;
      if (!certData.specializedTraining)
        return alert("Choose specialized training");

      const { total, ..._certData } = certData;
      setSubmitting(true);
      console.log(_certData);
      const url = await uploadIPFS(_certData);
      await addCertForm(library, account, [url, total]);
      setRefreshCert((pre) => !pre);
      setCertData({
        specializedTraining: null,
        modeStudy: STUDY_MODES.fullTime,
        total: 1,
        year: new Date().getFullYear(),
      });
      setSubmitting(false);
      onClose();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  const handleDeleteCertForm = async (idx) => {
    try {
      if (!account || !library || typeof idx !== "number") return;

      setDeleting(true);
      await deleteCertForm(library, account, [idx]);
      setRefreshCert((pre) => !pre);
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      console.error(error);
    }
  };

  const handleSubmit = () => {
    switch (selectedItem) {
      case certMenu.certificateType:
        return handleAddSpecializedTraining();

      case certMenu.certificates:
        return handleAddCertForm();
    }
  };

  const handleMintCert = async () => {
    try {
      if (!account || !library) return;
      if (!selectedCertForm) return alert("Choose specialized training");
      if (
        !certMintData.name ||
        !certMintData.addr ||
        !certMintData.mintWhere ||
        !certMintData.dateOfBirth
      )
        return alert("Fill all required fields");

      const { addr, ..._certMintData } = certMintData;
      if (!isAddress(addr)) return alert("Enter valid address");

      setSubmitting(true);
      const url = await uploadIPFS({
        ..._certMintData,
        cert: selectedCertForm,
        date: Math.floor(Date.now() / 1000),
      });
      await addCert(library, account, [addr, selectedCertForm.idx, url]);
      setRefreshCert((pre) => !pre);
      setCertMintData({
        addr: "",
        name: "",
        gender: GENDER.MALE,
        dateOfBirth: "",
        graduateGrade: GRADUATE_GRADE.A,
        mintWhere: "",
      });
      setSubmitting(false);
      onCloseMint();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  const renderBody = () => {
    switch (selectedItem) {
      case certMenu.certificateType:
        return (
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>STT</Th>
                <Th>Name</Th>
                <Th>Vietnamese Name</Th>
                <Th isNumeric>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {specializedTrainings.map((censor, idx) => (
                <Tr key={idx}>
                  <Td>{idx + 1}</Td>
                  <Td>{censor.name}</Td>
                  <Td>{censor.vnName}</Td>
                  <Td isNumeric>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteSpecializedTraining(idx)}
                      isLoading={deleting}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        );

      case certMenu.certificates:
        return (
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>STT</Th>
                <Th>Specialized Training</Th>
                <Th>Year</Th>
                <Th>Total</Th>
                <Th>Minted</Th>
                <Th isNumeric>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {certs.map((cert, idx) => (
                <Tr key={idx}>
                  <Td>{idx + 1}</Td>
                  <Td>
                    <Box>{cert.specializedTraining?.name}</Box>
                    <Box>{cert.specializedTraining?.vnName}</Box>
                  </Td>
                  <Td>{cert.year}</Td>
                  <Td>{cert.total?.toString()}</Td>
                  <Td>{cert.minted?.toString()}</Td>
                  <Td isNumeric>
                    {/* <Button colorScheme="telegram">View</Button> */}
                    <Button
                      colorScheme="teal"
                      mx="2"
                      onClick={() => {
                        setSelectedCertForm({ ...cert, idx });
                        onOpenMint();
                      }}
                    >
                      Mint
                    </Button>
                    <Button
                      colorScheme="red"
                      isLoading={deleting}
                      onClick={() => handleDeleteCertForm(idx)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        );

      default:
        return null;
    }
  };

  const renderModalBody = () => {
    switch (selectedItem) {
      case certMenu.certificateType:
        return (
          <>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={specializedTrainingName}
                onChange={(e) => setSpecializedTrainingName(e.target.value)}
                name="name"
                placeholder="Name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Vietnamese name</FormLabel>
              <Input
                value={specializedTrainingVnName}
                onChange={(e) => setSpecializedTrainingVnName(e.target.value)}
                name="vnName"
                placeholder="Vietnamese name"
              />
            </FormControl>
          </>
        );

      case certMenu.certificates:
        return (
          <>
            <FormControl isRequired>
              <FormLabel>Specialized Training</FormLabel>
              <Select
                value={selectedSpecializedTraining}
                onChange={(e) => {
                  const { value } = e.target;
                  setSelectedSpecializedTraining(value);
                  const specializedTraining = specializedTrainings.find(
                    (s) => s.id.toString() === value
                  );
                  if (specializedTraining) {
                    setCertData((pre) => ({
                      ...pre,
                      specializedTraining: {
                        name: specializedTraining.name,
                        vnName: specializedTraining.vnName,
                      },
                    }));
                  }
                }}
              >
                <option value="" style={{ display: "none" }}>
                  Select specialized Training
                </option>
                {specializedTrainings.map((v, idx) => (
                  <option key={idx} value={v.id}>
                    {v.name} - {v.vnName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Year</FormLabel>
              <NumberInput
                min={new Date().getFullYear()}
                value={certData.year}
                onChange={(v) => setCertData((pre) => ({ ...pre, year: +v }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mode of study</FormLabel>
              <Select
                value={certData.modeStudy}
                onChange={(e) =>
                  setCertData((pre) => ({ ...pre, modeStudy: e.target.value }))
                }
              >
                {Object.values(STUDY_MODES).map((v, idx) => (
                  <option key={idx} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Total certificate can minted</FormLabel>
              <NumberInput
                min={1}
                value={certData.total}
                onChange={(v) => setCertData((pre) => ({ ...pre, total: +v }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {certMenu.certificates === selectedItem
              ? "Add a new certificate"
              : "Add a new specialized training"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4">{renderModalBody()}</VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              isLoading={submitting}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal mint cert */}
      <Modal isOpen={isOpenMint} onClose={onCloseMint}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint Certificate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCertForm && (
              <VStack spacing="4" align="stretch">
                <Box>
                  Mint certificate specialized training{" "}
                  <Box d="inline" fontSize="xl" fontWeight="bold">
                    {selectedCertForm.specializedTraining?.name} -{" "}
                    {selectedCertForm.specializedTraining?.vnName}
                  </Box>{" "}
                  year{" "}
                  <Box d="inline" fontSize="xl" fontWeight="bold">
                    {selectedCertForm.year}
                  </Box>{" "}
                  for
                </Box>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={certMintData.name}
                    onChange={(e) =>
                      setCertMintData((pre) => ({
                        ...pre,
                        name: e.target.value,
                      }))
                    }
                    name="name"
                    placeholder="Name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={certMintData.addr}
                    onChange={(e) =>
                      setCertMintData((pre) => ({
                        ...pre,
                        addr: e.target.value,
                      }))
                    }
                    name="name"
                    placeholder="Name"
                  />
                </FormControl>

                <HStack>
                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>

                    <Select
                      value={certMintData.gender}
                      onChange={(e) =>
                        setCertMintData((pre) => ({
                          ...pre,
                          gender: e.target.value,
                        }))
                      }
                    >
                      {Object.keys(GENDER).map((k, idx) => (
                        <option key={idx} value={GENDER[k]}>
                          {k}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Date of birth</FormLabel>
                    <input
                      value={certMintData.dateOfBirth}
                      onChange={(e) =>
                        setCertMintData((pre) => ({
                          ...pre,
                          dateOfBirth: e.target.value,
                        }))
                      }
                      type="date"
                      style={{
                        border: "1px solid",
                        borderColor: "rgba(0,0,0,0.1)",
                        padding: "4px",
                        borderRadius: "5px",
                      }}
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Graduate grade</FormLabel>
                  <Select
                    value={certMintData.graduateGrade}
                    onChange={(e) =>
                      setCertMintData((pre) => ({
                        ...pre,
                        graduateGrade: e.target.value,
                      }))
                    }
                  >
                    {Object.keys(GRADUATE_GRADE).map((k, idx) => (
                      <option key={idx} value={GRADUATE_GRADE[k]}>
                        {k}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Mint where?</FormLabel>
                  <Input
                    value={certMintData.mintWhere}
                    onChange={(e) =>
                      setCertMintData((pre) => ({
                        ...pre,
                        mintWhere: e.target.value,
                      }))
                    }
                    placeholder="where does mint cert?"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              isLoading={submitting}
              onClick={handleMintCert}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <HStack>
        <Box>
          <Select
            size="lg"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            {Object.keys(certMenu).map((k, idx) => (
              <option key={idx} value={certMenu[k]} style={{ color: "black" }}>
                {certMenu[k]}
              </option>
            ))}
          </Select>
        </Box>
        <Button colorScheme="teal" onClick={onOpen}>
          ADD
        </Button>
      </HStack>

      {renderBody()}
    </Box>
  );
};

export default Cert;
