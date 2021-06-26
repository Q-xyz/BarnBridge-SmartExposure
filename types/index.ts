import { Signer } from "@ethersproject/abstract-signer";

export interface Accounts {
  admin: string;
  user: string;
  dao: string;
  guardian: string;
  feesOwner: string;
  owner: string;
  user2: string;
}

export interface Signers {
  admin: Signer;
  user: Signer;
  dao: Signer;
  guardian: Signer;
  feesOwner: Signer;
  owner: Signer;
  user2: Signer;
}
