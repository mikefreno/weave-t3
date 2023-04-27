import React, { RefObject } from "react";

const AttachmentModal = (props: { toggle: any; attachmentModalRef: RefObject<HTMLDivElement> }) => {
  return (
    <div className="fixed -ml-36">
      <div className="modal-offset absolute flex h-screen w-screen items-center justify-center">
        <div
          className="fade-in -mt-24 w-3/4 rounded-xl bg-zinc-200 p-12 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
          ref={props.attachmentModalRef}
        >
          Attachments coming soon!
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;
