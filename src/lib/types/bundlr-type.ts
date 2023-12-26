type UploaderErrorResponse = {
  message: string;
};

type UploaderFileResponse = {
  message: string;
  data: UploaderFileResponseData;
};

type UploaderFileResponseData = {
  id: string;
  url: string;
  timestamp: string;
};

type UploaderFolderResponse = {
  message: string;
  data: {
    tx: string;
    url: string;
    timestamp: string;
  };
};

type UploaderFundResponse = {
  message: string;
};

type UploadersCheckPriceResponse = {
  message: string;
  data: {
    price: number;
  };
};

type UploaderBalanceResponse = {
  message: string;
  data: {
    balance: number;
  };
};

type UploaderFileRequestData = {
  name: string;
  type: string;
  ens: string;
  file: ArrayBuffer;
};

type BundlrQueryResponse = {
  data: {
    transactions: {
      edges: {
        node: BundlrQueryResponseNode;
      }[];
    };
  };
};

type BundlrQueryResponseTag = {
  name: string;
  value: string;
};

type BundlrQueryResponseNode = {
  id: string;
  address: string;
  timestamp: number;
  tags: BundlrQueryResponseTag[];
};

type BundlrFilteredData = {
  node: BundlrQueryResponseNode;
}[];
