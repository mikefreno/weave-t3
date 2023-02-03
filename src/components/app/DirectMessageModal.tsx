import React, { RefObject } from "react";

const DirectMessageModal = (props: {
  directMessageModalRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <div id="modal" className="z-10 flex justify-center">
      <div className="modal-offset absolute flex h-screen items-center">
        <div
          ref={props.directMessageModalRef}
          id="serverModalContent"
          className="fade-in -mt-24 h-96 w-96 rounded-xl bg-white"
        >
          Create
        </div>
      </div>
    </div>
  );
};

export default DirectMessageModal;
