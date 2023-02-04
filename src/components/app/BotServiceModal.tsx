import React, { RefObject } from "react";

const BotServiceModal = (props: { botModalRef: RefObject<HTMLDivElement> }) => {
  return (
    <div id="modal" className="fixed">
      <div className="modal-offset absolute flex h-screen w-screen items-center justify-center">
        <div
          ref={props.botModalRef}
          id="serverModalContent"
          className="fade-in -mt-24 h-96 w-3/4 rounded-xl bg-zinc-400 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          Create
        </div>
      </div>
    </div>
  );
};

export default BotServiceModal;
