"use client";

import Web3Provider from "@/components/web3/web3-provider";
import "./globals.css";
import { SignProvider } from "@/providers/sign-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-jetbrains">
        <SignProvider>
          <Web3Provider>{children}</Web3Provider>
        </SignProvider>
      </body>
    </html>
  );
}
