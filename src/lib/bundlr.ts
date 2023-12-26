import Bundlr from "@bundlr-network/client";

const key = process.env.BUNDLR_SECRET_KEY as string;
const uploaderSecret = process.env.UPLOADER_SECRET_KEY as string;
const bundlrNode = "https://node1.bundlr.network";

const bundlr = new Bundlr(bundlrNode, "matic", key, {
  providerUrl: "https://polygon-rpc.com/",
});

console.log("bundlr =>", bundlr);

const handleBundlrUpload = async (file: FileType) => {
  if (!file) return;

  await bundlr.ready();

  console.log(bundlr);

  const tags = [
    {
      name: "Filename",
      value: file.name,
    },
    {
      name: "Uploader",
      value: file.ens,
    },
    {
      name: "App",
      value: "cc0-lib desktop uploader",
    },
  ];

  const res = await bundlr.uploadFile(file.path, { tags });
  console.log("res =>", res);
  const { id, timestamp } = res;
  console.log("id =>", id);
  console.log("timestamp =>", timestamp);

  return {
    message: `file upload successful.`,
    data: {
      id: id,
      url: `https://arweave.net/${id}`,
      timestamp: timestamp,
    },
  };
};

const getBalance = async () => {
  try {
    const atomicBal = await bundlr.getLoadedBalance();

    const convertedBal = bundlr.utils.fromAtomic(atomicBal);

    return {
      message: `balance is ${convertedBal} MATIC`,
      data: {
        balance: Number(convertedBal),
      },
    };
  } catch (error) {
    console.log("error =>", error);
    return {
      message: `getting balance failed. ${error}`,
      data: {
        balance: 0,
      },
    };
  }
};

const checkPrice = async (bytes: number) => {
  try {
    const priceAtomic = await bundlr.getPrice(bytes);
    const price = bundlr.utils.fromAtomic(priceAtomic);
    return {
      message: `price for ${bytes} bytes is ${price} MATIC`,
      data: {
        price: Number(price),
      },
    };
  } catch (error) {
    console.log("error =>", error);
    return {
      message: `getting price failed. ${error}`,
      data: {
        price: 0,
      },
    };
  }
};

const getRemainingBytes = async () => {
  try {
    const balance = await getBalance();
    const price = await checkPrice(1);

    if (!price.data) {
      return {
        message: `getting price failed. ${price.message}`,
      };
    }

    if (!balance.data) {
      return {
        message: `getting balance failed. ${balance.message}`,
      };
    }

    const remainingBytes = balance.data.balance / price.data.price;
    return {
      message: `remaining bytes is ${remainingBytes}`,
      data: {
        remainingBytes: remainingBytes,
      },
    };
  } catch (error) {
    console.log("error =>", error);
    return {
      message: `getting remaining bytes failed. ${error}`,
      data: {
        remainingBytes: 0,
      },
    };
  }
};

export default bundlr;

export { getBalance, checkPrice, getRemainingBytes, handleBundlrUpload };
