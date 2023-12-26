"use client";

import Container from "@/components/ui/container";
import { useContext, useEffect } from "react";
import { useAccount, useEnsName, useSignMessage } from "wagmi";
import { Cloud, Shield, UploadCloud } from "lucide-react";
import { SignContext, SignDispatchContext } from "@/providers/sign-provider";
import Link from "next/link";
import useLocalStorage from "@/hooks/use-local-storage";

export type SignDataType = {
  sig?: string;
  address?: string;
  ens?: string;
};

export default function Home() {
  const { address, isConnected, isDisconnected } = useAccount();
  const { signedIn } = useContext(SignContext);
  const signDispatch = useContext(SignDispatchContext);
  const [signData, setSignData] = useLocalStorage<SignDataType[]>(
    "signData",
    [],
  );

  if (!signDispatch) {
    throw new Error(
      "useSignDispatch must be used within a SignDispatchProvider",
    );
  }

  let { data: ens } = useEnsName({
    address,
  });

  const messageToSign =
    `Sign this to prove you own ${address}` +
    "\n" +
    `Timestamp: ${Date.now()}
  `;

  const {
    data: sig,
    isError,
    isLoading,
    isSuccess,
    signMessage,
  } = useSignMessage({
    message: messageToSign,
  });

  const checkSignData = () => {
    const data = signData.find((sign) => sign.address === address);
    const { sig: dataSig, ens: dataENS } = data ?? {
      sig: undefined,
      ens: undefined,
    };
    if (dataSig && dataENS) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (checkSignData()) {
      signDispatch({
        type: "SIGN_IN",
        address: address,
        sig: sig,
        ens: ens as string,
      });
    }
  }, [isConnected]);

  const handleSignOut = () => {
    signDispatch({
      type: "SIGN_OUT",
    });
    const newSignData = signData.filter((sign) => sign.address !== address);
    setSignData(newSignData);
  };

  const handleSignIn = () => {
    signMessage();
  };

  useEffect(() => {
    if (isDisconnected) {
      signDispatch({
        type: "SIGN_OUT",
      });
    }
  }, [isDisconnected]);

  useEffect(() => {
    if (isSuccess && sig && address && ens) {
      signDispatch({
        type: "SIGN_IN",
        address: address,
        sig: sig,
        ens: ens,
      });
      setSignData([...signData, { address: address, sig: sig, ens: ens }]);
    }
  }, [isSuccess, sig, address, ens]);

  if (isConnected && !signedIn && !ens) {
    return (
      <Container>
        <div className="flex w-full max-w-prose flex-col items-center justify-center gap-8">
          <h1 className="text-center text-4xl">welcome {ens ?? "anon"}</h1>
          {!ens && (
            <div className="flex flex-col items-center gap-2 text-xs">
              <span>oops. you do not have an ens</span>
              <span>
                mint your free{" "}
                <Link
                  href="https://ens.vision/name/cc0-gang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-prim"
                >
                  name.cc0-gang.eth
                </Link>{" "}
                ENS now!
              </span>
            </div>
          )}
        </div>
      </Container>
    );
  }

  if (isConnected && signedIn) {
    return (
      <Container>
        <div className="flex w-full max-w-prose flex-col items-center justify-center gap-8 text-sm">
          <h1 className="text-center text-4xl">welcome {ens ?? "anon"}</h1>
          <div className="flex flex-col items-center justify-center gap-2">
            <div>
              click{" "}
              <Link href="/upload" className="hover:text-prim">
                <UploadCloud className="inline-block h-6 w-6 items-center" />
              </Link>{" "}
              to start uploading
            </div>
            <div>
              click{" "}
              <Link href="/list" className="hover:text-prim">
                <Cloud className="inline-block h-6 w-6 items-center" />
              </Link>{" "}
              to view your uploads
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex w-full max-w-prose flex-col items-center justify-center gap-8">
        <h1 className="text-center text-4xl">
          {!isConnected ? "You are not connected" : "You are not signed in"}
        </h1>

        {!isConnected && (
          <div className="flex flex-col items-center gap-2 text-xs">
            <span>please connect your wallet</span>
            <span>
              click <Shield className="inline-block h-4 w-4" /> to connect
            </span>
          </div>
        )}
        {!signedIn && isConnected && (
          <button disabled={isLoading} onClick={handleSignIn}>
            Sign message
          </button>
        )}
        {isError && <div>Error signing message</div>}
      </div>
    </Container>
  );
}
