const { create } = require("ipfs-http-client");

// connect to a different API
const client = create("https://ipfs.infura.io:5001/api/v0");

export const uploadIPFS = async (payload) => {
  // call Core API methods
  const { path } = await client.add(JSON.stringify(payload));
  const fullPath = `https://ipfs.infura.io/ipfs/${path}`;
  return fullPath;
};
