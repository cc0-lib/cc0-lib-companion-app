"use client";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiConfig, createConfig } from "wagmi";
import { mainnet, polygon, zora } from "wagmi/chains";

const chains = [mainnet, zora, polygon];

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    appName: "cc0-lib Uploader",
    appDescription: "cc0-lib Uploader",
    appUrl: "https://cc0-lib.wtf",
    appIcon: "https://cc0-lib.wtf/cc0-lib-circle.png",
    chains,
  }),
);

type Web3ProviderProps = {
  children: React.ReactNode;
};

const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        mode="midnight"
        customTheme={{
          "--ck-font-family": "JetBrains Mono",
          "--ck-accent-color": "#E9FF5F",
          "--ck-accent-text-color": "#292929",
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
