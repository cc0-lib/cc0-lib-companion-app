"use client";

import { Clipboard, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DownloadButton from "@/components/uploader/file-dl";

const UploaderTableItem = ({ node }: { node: BundlrQueryResponseNode }) => {
  const checkIfImage = (node: BundlrQueryResponseNode): boolean => {
    const allowedContentTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    const contentTypes = node.tags
      .filter((tag) => tag.name === "Content-Type")
      .map((tag) => tag.value);

    const isImage = contentTypes.some((contentType) =>
      allowedContentTypes.includes(contentType),
    );
    return isImage;
  };

  const firstType = (node: BundlrQueryResponseNode): string => {
    const firstTag = node.tags.find((tag) => tag.name === "Content-Type");
    return firstTag?.value as string;
  };

  const truncatedFilename = (node: BundlrQueryResponseNode): string => {
    const tag = node.tags.find(
      (tag) => tag.name === "Filename",
    ) as BundlrQueryResponseTag;
    const fileName =
      tag.value.split(".")[0].length > 30
        ? tag.value.split(".")[0].slice(0, 30) + "..."
        : tag.value.split(".")[0];
    const format = tag.value.split(".")[1];
    return `${fileName}.${format}` as string;
  };

  const fullFilename = (node: BundlrQueryResponseNode): string => {
    const tag = node.tags.find(
      (tag) => tag.name === "Filename",
    ) as BundlrQueryResponseTag;
    return tag.value as string;
  };

  return (
    <tr key={node.id} className="font-spline normal-case">
      <td className=" border-zinc-800">
        <img
          src={
            checkIfImage(node)
              ? `https://arweave.net/${node.id}`
              : `https://placehold.co/32x32/black/white/svg?text=cc0-lib&font=roboto`
          }
          alt="logo"
          width={64}
          height={64}
          className="h-16 w-16 items-center justify-center object-contain p-1"
        />
      </td>
      <td className=" border-zinc-800 px-4 py-2">
        <h1>{truncatedFilename(node)}</h1>
      </td>
      <td className=" border-zinc-800 px-4 lowercase">{firstType(node)}</td>
      {/* <td className="border border-zinc-800 px-4">{`${node.id.slice(
        0,
        10,
      )}...${node.id.slice(-10)}`}</td> */}

      <td className=" border-zinc-800 p-4 text-right text-xs">
        <div className="flex h-full w-full flex-col items-end justify-center">
          <span className="text-zinc-200">
            {new Date(node.timestamp).toLocaleDateString("en-US")}
          </span>
          <span className="text-zinc-400">
            {new Date(node.timestamp).toLocaleTimeString("en-US", {
              hour12: false,
            })}
          </span>
        </div>
      </td>

      <td className=" border-zinc-800 px-4 uppercase ">
        <div className="flex flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://arweave.net/${node.id}/${fullFilename(node)}`,
              );
            }}
          >
            <Clipboard className="hover:text-prim h-6 w-6 items-center" />
          </button>
          <Link
            href={`https://arweave.net/${node.id}/${fullFilename(node)}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <LinkIcon className="hover:text-prim h-6 w-6 items-center" />
          </Link>
          {/* <DownloadButton node={node} /> */}
        </div>
      </td>
    </tr>
  );
};

export default UploaderTableItem;
