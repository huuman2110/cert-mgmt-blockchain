export const CERT_ADDRESS = "0x3a18CC47B457D62d62205b609885a3A4d0A3bdf6";

export const CERT_METHODS = {
  getOwnerRoles: "getOwnerRoles",
  addCensor: "addCensor",
  editCensor: "editCensor",
  deleteCensor: "deleteCensor",
  totalCensors: "totalCensors",
  censors: "censors",
  addSpecializedTraining: "addSpecializedTraining",
  getSpecializedTrainings: "getSpecializedTrainings",
  deleteSpecializedTraining: "deleteSpecializedTraining",
  addCertForm: "addCertForm",
  deleteCertForm: "deleteCertForm",
  getCertForms: "getCertForms",
  totalCertForm: "totalCertForm",
  certFormMinted: "certFormMinted",
  addCert: "addCert",
  getCertsPending: "getCertsPending",
  approveCert: "approveCert",
  balanceOf: "balanceOf",
  tokenOfOwnerByIndex: "tokenOfOwnerByIndex",
  tokenURI: "tokenURI",
  REFACTOR_NAME: "REFACTOR_NAME",
};

export const ROLES = {
  ADMIN: {
    name: "admin",
    value: 0,
  },
  CENSOR: {
    name: "censors",
    value: 1,
  },
  USER: {
    name: "users",
    value: 2,
  },
};

export const GRADUATE_GRADE = {
  F: "F",
  D: "D",
  C: "C",
  B: "B",
  A: "A",
};

export const STUDY_MODES = {
  fullTime: "Full-time",
  partTime: "Part-time",
  remoteFullTime: "Remote Full-time",
  remotePartTime: "Remote Part-time",
};

export const GENDER = {
  MALE: 0,
  FEMALE: 1,
};

export const CERT_STATUSES = {
  DEFAULT: 0,
  PENDING: 1,
  REPORTED: 2,
};
