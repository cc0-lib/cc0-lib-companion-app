"use client";

import { ArrowDownToLine, Loader2 } from "lucide-react";
import { useState } from "react";

const DownloadButton = ({ node }: { node: BundlrQueryResponseNode }) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const downloadFile = async (): Promise<boolean> => {
    const file = node;
    const filename = file.tags.find((tag) => tag.name === "Filename")
      ?.value as string;
    const contentType = file.tags.find((tag) => tag.name === "Content-Type")
      ?.value;
    const url = `https://arweave.net/${file.id}`;

    try {
      setIsDownloading(true);
      const res = await fetch(url);
      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Downloaded ${filename}`);
      setIsDownloading(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsDownloading(false);
      console.log(`Failed to download ${filename}`);
      return false;
    }
  };

  return (
    <button onClick={downloadFile}>
      {isDownloading ? (
        <Loader2 className="stroke-prim h-6 w-6 animate-spin self-center" />
      ) : (
        <ArrowDownToLine className={`hover:stroke-prim h-6 w-6 self-center`} />
      )}
    </button>
  );
};
export default DownloadButton;
