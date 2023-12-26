"use client";

import Link from "next/link";
import ConnectButton from "@/components/web3/connect-button";
import { Cloud, HardDrive, Info, UploadCloud, Wallet2 } from "lucide-react";
import { useEffect, useState } from "react";
import { bytesToString } from "@/lib/utils";
import { apiURL } from "@/lib/constants";

const secret = process.env.NEXT_PUBLIC_UPLOADER_SECRET_KEY as string;

type Props = {
  children: React.ReactNode;
};
const Container = ({ children }: Props) => {
  const [balance, setBalance] = useState<number>(0);
  const [remainingData, setRemainingData] = useState<string>("");

  const getBalance = async () => {
    const url = apiURL;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        type: "balance",
        secret: secret,
      }),
    });

    const { message, data: resData } = await res.json();

    console.log(message, resData);
    setBalance(resData.balance);

    return resData.balance;
  };

  const checkPrice = async (bytes: number) => {
    const url = apiURL;

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        type: "checkPrice",
        data: {
          bytes: bytes,
        },
        secret: secret,
      }),
    });

    const { message, data: resData } = await res.json();
    console.log(message, resData);

    return resData.price;
  };

  const getRemainingData = async () => {
    const mb: number = 1000000;
    const price = await checkPrice(mb); // price per mb around 0.00547324761162088 matic
    const balance = await getBalance(); // balance in matic

    const remainingData = balance / price; // remaining data in bytes

    console.log("balance =>", balance);
    console.log("price =>", price);
    console.log("remainingData =>", remainingData);

    const formattedData = bytesToString(remainingData * mb);

    console.log("formattedData =>", formattedData);

    setRemainingData(formattedData);
  };

  useEffect(() => {
    getBalance();
    getRemainingData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 py-6 uppercase">
      <header className="flex w-full flex-row items-center justify-between px-2">
        <div className="flex flex-row items-center gap-4">
          <Link href="/" className="hover:text-prim">
            <img src="./cc0lib-h.svg" alt="cc0-lib" className="h-8 w-24 " />
          </Link>
          <span className="text-sm uppercase">uploader</span>
        </div>
        {/* <span className="items-center text-xs text-zinc-600">
          TICKERKEKRKERKERK KEKE
        </span> */}

        <div className="flex flex-row items-center gap-4">
          <Link href="/about" className="hover:text-prim">
            <Info className="h-6 w-6 items-center" />
          </Link>
          <Link href="/upload" className="hover:text-prim">
            <UploadCloud className="h-6 w-6 items-center" />
          </Link>
          <Link href="/list" className="hover:text-prim">
            <Cloud className="h-6 w-6 items-center" />
          </Link>
          <ConnectButton />
        </div>
      </header>
      {children}
      <footer className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <span className="text-sm uppercase text-zinc-600">
            POOL BALANCE →
          </span>
          {balance && balance > 0 ? (
            <span className="items-center text-sm text-zinc-600">
              <Wallet2 className="mr-2 inline-block h-5 w-5 items-center" />
              {Number(balance).toFixed(3)} MATIC
            </span>
          ) : (
            <span className="items-center text-sm text-zinc-600">
              <Wallet2 className="mr-2 inline-block h-5 w-5 items-center" />
              X.XXX
            </span>
          )}{" "}
          <span className="text-zinc-600">|</span>
          {remainingData ? (
            <span className="items-center text-sm uppercase text-zinc-600">
              <HardDrive className="mr-2 inline-block h-5 w-5 items-center" />
              {remainingData}
            </span>
          ) : (
            <span className="items-center text-sm text-zinc-600">
              <HardDrive className="mr-2 inline-block h-5 w-5 items-center" />
              XXX.X MB
            </span>
          )}
        </div>
        <Link
          href="https://cc0-lib.wtf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-600 hover:text-prim"
        >
          CC0-LIB
        </Link>
      </footer>
    </main>
  );
};
export default Container;
