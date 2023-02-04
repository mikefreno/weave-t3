import React, { useState } from "react";

const FileUpload = () => {
  const [dragged, setDragged] = useState(false);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragged(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragged(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragged(false);
    const files = event.dataTransfer.files;
    console.log(files);
    // handle the dropped files here
  };

  return (
    <div
      className="z-50 my-4 flex rounded-full border border-dashed border-zinc-100 bg-transparent shadow-md"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label
        htmlFor="upload"
        className=" flex h-32 w-32 cursor-pointer items-center justify-center"
      >
        {dragged ? (
          <div>Drop File!</div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 fill-transparent stroke-zinc-700 dark:stroke-zinc-400"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
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
      <input id="upload" type="file" className="hidden" />
    </div>
  );
};

export default FileUpload;
