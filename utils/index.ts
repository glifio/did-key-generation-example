import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DagJWS, DID } from "dids";
import crypto from "crypto";

// did key looks like did:key:123
export const createDIDKey = async (seed: Uint8Array): Promise<DID> => {
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  return did;
};

export const createDIDSeed = (messages: string[]): string => {
  const hash = crypto.createHash("sha256");
  messages.forEach((m) => hash.update(m));
  return hash.digest("hex");
};

export const serializeJWS = (jws: DagJWS): string => {
  return `${jws.signatures[0].protected}.${jws.payload}.${jws.signatures[0].signature}`;
};
