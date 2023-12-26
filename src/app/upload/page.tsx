"use client";

import Container from "@/components/ui/container";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { checkIfImage, checkIfVideo, truncateString } from "@/lib/utils";
import { SignContext } from "@/providers/sign-provider";
import { useAccount, useEnsName } from "wagmi";
import { Shield } from "lucide-react";
import mime from "mime-types";

const secret = process.env.NEXT_PUBLIC_UPLOADER_SECRET_KEY as string;

type Props = {};
const TestPage = (props: Props) => {
  const [filePaths, setFilePaths] = useState<string[] | null>([]);

  const [files, setFiles] = useState<FileType[] | null>([]);
  const [fileBuffers, setFileBuffers] = useState<any[] | null>([]);
  const [log, setLog] = useState<string>("");
  const { address, isConnected } = useAccount();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [uploadBuffers, setUploadBuffers] = useState<any[] | null>([]);

  let { data: ens } = useEnsName({
    address,
  });

  const { signedIn } = useContext(SignContext);
  useEffect(() => {
    listen("tauri://file-drop", (event) => {
      const payload = event.payload as string[];
      if (payload.length === 0) return;
      setFilePaths([filePaths, payload].flat() as string[]);
      setLog(
        `${payload.length} ${
          payload.length > 1 ? "files" : "file"
        } ready to upload`,
      );
    });
  }, []);

  useEffect(() => {
    console.log("files =>", files);
  }, [files]);

  useEffect(() => {
    console.log("buffers =>", fileBuffers);
  }, [fileBuffers]);

  const checkMimeType = (format: string) => {
    console.log(mime.extension(mime.lookup(format) as string));
    return mime.lookup(format);
  };

  const handleFiles = async () => {
    if (!filePaths) return;

    const files = filePaths.map((file) => {
      return {
        path: file as string,
        name: file.split("/").pop() as string,
        type:
          checkMimeType(file.split(".").pop() as string) ??
          "application/octet-stream",
        ens: ens as string,
      };
    }) as FileType[];

    const buffers: any[] = [];
    const uploadBuffers: any[] = [];

    for (const file of files) {
      const resolvedPath = (
        await import("@tauri-apps/api/tauri")
      ).convertFileSrc(file.path);

      buffers.push(resolvedPath);
      setFileBuffers(buffers);

      const reader = new FileReader();

      reader.onload = (e) => {
        const res = e.target?.result;
        if (!res) {
          return;
        }
        uploadBuffers.push(res);
      };

      const blob = await fetch(resolvedPath).then((r) => r.blob());

      reader.readAsDataURL(blob);
    }

    setUploadBuffers(uploadBuffers);
    setFiles(files);
  };

  useEffect(() => {
    handleFiles();
  }, [filePaths]);

  const handleUpload = async (e: any) => {
    if (!files) {
      return;
    }
    setIsUploading(true);
    setLog(`uploading ${files.length} ${files.length > 1 ? "files" : "file"}`);

    files.map(async (file) => {
      const url = "https://cc0-lib.wtf/api/bundlr";

      if (!uploadBuffers) return;

      const data: UploaderFileRequestData = {
        name: file.name,
        type: file.type,
        ens: ens as string,
        file: uploadBuffers[files.indexOf(file)],
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            type: "uploadFile",
            secret: secret,
            data: data,
          }),
        });

        console.log("res =>", res);

        if (res.status !== 200) {
          setLog(`upload failed: ${res.status} ${res.statusText}`);
          return;
        }

        const response = await res.json();

        const { message, data: resData } = response;

        console.log("message =>", message);

        if (resData) {
          setLog(
            `uploaded ${files.length} ${files.length > 1 ? "files" : "file"}`,
          );
          setIsUploaded(true);
        } else {
          setLog(`upload failed: ${message}`);
        }
      } catch (error) {
        setLog(`upload failed: ${error}`);
      }
    });
    setIsUploading(false);
  };

  const handleReset = () => {
    setFilePaths(null);
    setFiles(null);
    setFileBuffers(null);
    setLog("");
    setIsUploaded(false);
    setIsUploading(false);
  };

  useEffect(() => {
    handleReset();
  }, []);

  if (signedIn && ens) {
    return (
      <Container>
        <div className="my-4 max-h-[400px] w-full items-center justify-center overflow-auto rounded-xl border-2 border-dashed border-zinc-700 p-8 text-center text-zinc-200">
          {!files && (
            <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4">
              <p className="flex w-full items-center justify-center text-center text-3xl">
                drop your files here
              </p>
              <p className="flex w-full items-center justify-center text-center text-sm">
                max size per file: 4mb
              </p>
            </div>
          )}
          {files && files.length > 0 && fileBuffers && (
            <div className="">
              <div
                className={`${files.length < 2 && "w-full"} 
              ${files.length === 2 && "grid grid-cols-2"}
              ${files.length > 2 && "grid grid-cols-3"}
              items-center justify-center gap-4 font-jetbrains
               `}
              >
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex h-full w-full flex-col items-center justify-between gap-8"
                  >
                    {checkIfImage(file) && (
                      <img
                        src={fileBuffers[files.indexOf(file)]}
                        width={300}
                        height={300}
                        alt={file.name}
                        className="h-full w-full max-w-md object-contain"
                      />
                    )}
                    {checkIfVideo(file) && (
                      <video
                        src={fileBuffers[files.indexOf(file)]}
                        controls
                        className="h-full w-full object-contain"
                      />
                    )}
                    {!checkIfVideo(file) && !checkIfImage(file) && (
                      <img
                        src={`https://placehold.co/300x300/black/white/?text=${file.type}`}
                        width={300}
                        height={300}
                        alt={file.name}
                        className="h-auto w-full max-w-md object-contain"
                      />
                    )}
                    <span className="text-center text-xs text-prim">
                      {truncateString(file.name, 20)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="-mt-4 flex w-full flex-row items-center justify-between gap-4">
          {log && <pre className="w-full overflow-auto text-sm">{log}</pre>}
          {isUploaded && (
            <Link href="/list">
              <button className="rounded-md bg-lime-400 px-4 py-2 text-zinc-800 active:bg-zinc-800 active:text-lime-400">
                check
              </button>
            </Link>
          )}
          {files && !isUploading && (
            <button
              onClick={handleReset}
              className="rounded-md bg-lime-400 px-4 py-2 text-zinc-800 active:bg-zinc-800 active:text-lime-400"
            >
              reset
            </button>
          )}
          {files && !isUploading && !isUploaded && (
            <button
              onClick={handleUpload}
              className="rounded-md bg-lime-400 px-4 py-2 text-zinc-800 active:bg-zinc-800 active:text-lime-400"
            >
              upload
            </button>
          )}
        </div>
      </Container>
    );
  }

  if (signedIn && !ens) {
    return (
      <Container>
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
      </Container>
    );
  }

  if (isConnected && !signedIn) {
    return (
      <Container>
        <div className="flex flex-col gap-8">
          <h1 className="text-center text-4xl">You are not signed in</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <h1 className="text-center text-4xl">You are not signed in</h1>
        <div className="flex flex-col items-center gap-2 text-xs">
          <span>please connect your wallet</span>
          <span>
            click <Shield className="inline-block h-4 w-4" /> to connect
          </span>
        </div>
      </div>
    </Container>
  );
};
export default TestPage;
