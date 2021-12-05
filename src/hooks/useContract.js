import { Contract } from "@ethersproject/contracts";
import { getAddress } from "@ethersproject/address";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { CERT_ADDRESS } from "configs";
import CertABI from "abis/Cert.json";

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// account is not optional
export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library, account = undefined) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address, ABI, library, account = undefined) {
  if (
    !isAddress(address) ||
    address === 0x0000000000000000000000000000000000000000
  ) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

// returns null on errors
export function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export async function callContract(
  contract,
  method,
  args = [],
  overrides = {}
) {
  try {
    const tx = await contract[method](...args, {
      ...overrides,
    });
    if (typeof tx.wait !== "function") return tx;

    if (!tx) throw new Error("cannot create transaction");
    const res = await tx.wait();
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useJobCoreContract() {
  return useContract(CERT_ADDRESS, CertABI);
}

export function getCertContract(library, account = undefined) {
  return getContract(CERT_ADDRESS, CertABI, library, account);
}
