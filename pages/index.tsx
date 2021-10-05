import { Box, Button, CopyText, Input, Text } from "@glif/react-components";
import styled from "styled-components";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import { fromString } from "uint8arrays/from-string";
import { useWeb3Provider } from "../src/contexts";
import { createDIDKey, createDIDSeed } from "../utils";
import { DID } from "dids";

export const PageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* Temp implementation to simplistically handle large scale displays. This should be removed and a more dynamic solution introduced e.g https://css-tricks.com/optimizing-large-scale-displays/  */
  max-width: 1440px;
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`;

const HeaderText = ({
  walletConnected,
  did,
}: {
  walletConnected: boolean;
  did: string | null;
}) => {
  if (did) {
    return (
      <Text m={0} p={0}>
        Sign a permission
      </Text>
    );
  }
  if (walletConnected) {
    return (
      <Text m={0} p={0}>
        Login to DID
      </Text>
    );
  }
  return (
    <Text m={0} p={0}>
      Connect Wallet
    </Text>
  );
};

type Claim = { key: string; value: string };

const ClaimInput = ({
  claim,
  setClaim,
  number,
}: {
  claim: Claim;
  setClaim: Dispatch<SetStateAction<{ key: string; value: string }>>;
  number: number;
}) => {
  return (
    <Box display="flex" flexDirection="row" ml={3}>
      <Input.Text
        my={2}
        value={claim.key}
        onChange={(e: SyntheticEvent) => {
          const target = e.target as HTMLInputElement;
          setClaim({ ...claim, key: target.value });
        }}
        label={`Claim ${number}`}
        placeholder="Claim key"
      />
      <Input.Text
        my={2}
        value={claim.value}
        onChange={(e: SyntheticEvent) => {
          const target = e.target as HTMLInputElement;
          setClaim({ ...claim, value: target.value });
        }}
        mx={5}
        placeholder="Claim value"
      />
    </Box>
  );
};

const IndexPage = () => {
  const [pass, setPass] = useState("");
  const [did, setDid] = useState<DID | null>(null);
  const [claim1, setClaim1] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });
  const [claim2, setClaim2] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });
  const [claim3, setClaim3] = useState<{ key: string; value: string }>({
    key: "",
    value: "",
  });

  const { connect, address, signer, connected } = useWeb3Provider();

  const signAndSendClaims = async (e: SyntheticEvent) => {
    e.preventDefault();
    const claims = [claim1, claim2, claim3].reduce((claims, claim) => {
      return { ...claims, [claim.key]: claim1.value };
    }, {});
    const jws = await did.createJWS(claims);
    alert(`Signed claims!:
      ${JSON.stringify(claims)}
    
      JWS: ${jws.payload}
    `);
  };

  return (
    <PageWrapper>
      <Box
        boxShadow={2}
        borderRadius={4}
        display="flex"
        flexDirection="column"
        minHeight={11}
        minWidth={11}
      >
        <Box
          width="100%"
          p={3}
          border={0}
          borderTopRightRadius={3}
          borderTopLeftRadius={3}
          bg="core.primary"
          color="core.white"
          textAlign="center"
        >
          <HeaderText walletConnected={connected} did={did?.id} />
        </Box>
        <Box
          width="100"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {did?.id && (
            <Box>
              <Box m={3} display="flex" flexDirection="row">
                <Text color="core.primary">{did.id}</Text>
                <CopyText text={did.id} color="core.primary" />
              </Box>
              <Box display="flex" flexDirection="column" mb={4}>
                <ClaimInput claim={claim1} setClaim={setClaim1} number={1} />
                <ClaimInput claim={claim2} setClaim={setClaim2} number={2} />
                <ClaimInput claim={claim3} setClaim={setClaim3} number={3} />
                <Button
                  mx={9}
                  my={3}
                  variant="secondary"
                  title="Sign and send JWS with claims"
                  onClick={signAndSendClaims}
                />
              </Box>
            </Box>
          )}
          {!did && !connected && (
            <Button mt={7} title="Connect" role="button" onClick={connect} />
          )}
          {!did && connected && (
            <Box
              m={3}
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Input.Text
                value={pass}
                onChange={(e: SyntheticEvent) => {
                  const target = e.target as HTMLInputElement;
                  setPass(target.value);
                }}
                label="Password"
                type="password"
                width="200px"
              />
              <Box mt={3}>
                <Button
                  title="Derive DID"
                  onClick={async () => {
                    const hash = createDIDSeed(pass);
                    const signature = await signer.signMessage(hash);
                    const did = await createDIDKey(
                      fromString(signature).slice(0, 32)
                    );
                    await did.authenticate();
                    setDid(did);
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default IndexPage;
