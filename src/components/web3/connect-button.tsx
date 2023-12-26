"use client";

import { SignDataType } from "@/app/page";
import useLocalStorage from "@/hooks/use-local-storage";
import { ConnectKitButton } from "connectkit";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const ConnectButton = () => {
  const [signData, setSignData] = useLocalStorage<SignDataType[]>(
    "signData",
    [],
  );
  const { address, isConnected } = useAccount();
  const [signExist, setSignExist] = useState<boolean>(false);

  const checkSignData = () => {
    const data = signData.find((sign) => sign.address === address);
    const { sig: dataSig, address: dataAddr } = data ?? {
      sig: undefined,
      address: undefined,
    };
    if (dataSig && dataAddr) {
      return setSignExist(true);
    }
    return setSignExist(false);
  };

  useEffect(() => {
    checkSignData();
  }, [signData, address, isConnected]);

  return (
    <ConnectKitButton.Custom>
      {({
        isConnected,
        isConnecting,
        isDisconnected,
        show,
        hide,
        address,
        ensName,
        chain,
      }: {
        isConnected: boolean;
        isConnecting: boolean;
        isDisconnected: boolean;
        show: () => void;
        hide: () => void;
        address: string;
        ensName: string;
        chain: string;
      }) => {
        return (
          <button
            aria-label="Connect to wallet"
            onClick={show}
            className="flex items-center"
          >
            {isConnected ? (
              signExist ? (
                <ShieldCheck className="h-6 w-6 text-lime-500" />
              ) : (
                <ShieldAlert className="h-6 w-6 text-red-400" />
              )
            ) : (
              <Shield className="h-6 w-6 " />
            )}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
export default ConnectButton;
