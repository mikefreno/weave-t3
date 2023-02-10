import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept, fileHolder, preSet }: any) => {
  // Initializing useDropzone hooks with options
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });
  return (
    <div
      className={`z-50 my-4 flex rounded-full ${
        fileHolder === null ? "border" : null
      } border-dashed border-zinc-100 bg-transparent shadow-md`}
      {...getRootProps()}
    >
      <label
        htmlFor="upload"
        className=" flex h-32 w-32 cursor-pointer items-center justify-center"
      >
        <input className="dropzone-input" {...getInputProps()} />
        {(fileHolder !== null || preSet !== null) && !isDragActive ? (
          <div>
            <img
              src={fileHolder == null ? preSet : fileHolder}
              className="h-32 w-32 rounded-full"
              alt="upload"
            />
          </div>
        ) : isDragActive ? (
          <div className="-mt-12">Drop File!</div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 fill-transparent stroke-zinc-700 dark:stroke-zinc-400"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span
              id="drop"
              className="text-md text-zinc-700 dark:text-zinc-400"
            >
              Upload file
              <br />
              <span className="text-sm">Click or drag</span>
            </span>
          </>
        )}
      </label>
    </div>
  );
};

export default Dropzone;
