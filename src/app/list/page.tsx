"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import UploaderTableItem from "@/components/uploader/table-item";
import Container from "@/components/ui/container";
import { SignContext } from "@/providers/sign-provider";
import { RefreshCw } from "lucide-react";
import { irysGraphQL } from "@/lib/constants";

type Props = {};
const ListPage = (props: Props) => {
  const [uploadedData, setUploadedData] = useState<BundlrFilteredData>([]);
  const [uploadedDataCount, setUploadedDataCount] = useState<number>(0);
  const { ens } = useContext(SignContext);

  const handleGetData = useCallback(async () => {
    if (!ens) {
      return {
        message: "invalid ens",
      };
    }

    try {
      const url = irysGraphQL;
      const requestBody = {
        query: `
        query {
          transactions(tags: [{ name: "Uploader", values: ["${ens}"] }],
          order: DESC
          ) {
            edges {
              node {
                id
                address
                timestamp
                tags {
                  name
                  value
                }
              }
            }
          }
        }
        `,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        next: {
          revalidate: 1,
        },
      });

      const { data } = (await res.json()) as BundlrQueryResponse;

      const uploadedData = data.transactions.edges;

      // filter out undefined nodes
      const filteredData = uploadedData.filter(
        (e) => e.node !== undefined,
      ) as BundlrFilteredData;

      setUploadedDataCount(filteredData.length);
      setUploadedData(filteredData);

      return {
        message: "success",
        data: filteredData,
      };
    } catch (error) {
      return {
        message: `getting uploaded data failed. ${error}`,
      };
    }
  }, [ens]);

  useEffect(() => {
    handleGetData();
  }, [ens]);

  return (
    <Container>
      <div className="h-96 w-full overflow-auto text-xs">
        <div className="flex w-full flex-row items-center justify-between">
          <span className="flex flex-row items-center gap-2 font-jetbrains text-xl uppercase text-zinc-200">
            Your uploads
            <button
              onClick={handleGetData}
              className="inline-block items-center"
            >
              <RefreshCw className="h-4 w-4 hover:text-prim" />
            </button>
          </span>
        </div>
        <table className="w-full table-auto border-none border-zinc-800 font-jetbrains uppercase text-zinc-200">
          <thead className="sticky -top-1 bg-black">
            <tr>
              <th className=" border-zinc-800 px-2">+++++</th>
              <th className="w-full  border-zinc-800 px-4 py-4 text-left">
                Filename
              </th>

              <th className=" border-zinc-800 px-4 text-left">Type</th>
              <th className=" border-zinc-800 px-4 text-right">Date</th>

              <th className=" border-zinc-800 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedData &&
              uploadedData.length > 1 &&
              uploadedData.map((e) => {
                return <UploaderTableItem node={e.node} key={e.node.id} />;
              })}
          </tbody>
        </table>

        {uploadedDataCount === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <button
              onClick={handleGetData}
              className="ml-4 rounded-lg bg-zinc-900 px-4 py-2 text-zinc-200"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </Container>
  );
};
export default ListPage;
