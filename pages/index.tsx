import { Button, Input } from "@glif/react-components";
import { SyntheticEvent, useState } from "react";
import { fromString } from "uint8arrays/from-string";
import { useWeb3Provider } from "../src/contexts";
import { createDIDKey, createDIDSeed } from "../utils";

const IndexPage = () => {
  const [pass, setPass] = useState("");
  const { connect, address, signer, connected } = useWeb3Provider();

  return (
    <div>
      {!connected && (
        <Button title="Connect to wallet" role="button" onClick={connect} />
      )}
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
      {connected && (
        <Button
          title="login"
          onClick={async () => {
            const hash = createDIDSeed(pass);
            const signature = await signer.signMessage(hash);
            const did = await createDIDKey(fromString(signature).slice(0, 32));
            await did.authenticate();
            const jws = await did.createJWS({ permission: "SUPER_USER" });
            console.log(jws.payload);
          }}
        />
      )}
      <p>My address: {address}</p>
    </div>
  );
};

export default IndexPage;
