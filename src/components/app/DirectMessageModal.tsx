import SearchIcon from "@/src/icons/SearchIcon";
import { Input } from "@nextui-org/react";
import React, { RefObject, useContext, useState } from "react";
import ThemeContext from "../ThemeContextProvider";

const DirectMessageModal = (props: {
  directMessageModalRef: RefObject<HTMLDivElement>;
}) => {
  const { isDarkTheme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Perform your search logic here
  };

  return (
    <div id="modal" className="fixed">
      <div className="modal-offset absolute flex h-screen w-screen items-center justify-center">
        <div
          ref={props.directMessageModalRef}
          id="serverModalContent"
          className="fade-in -mt-24 w-3/4 rounded-xl bg-zinc-400 p-12 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          <div className="text-center text-2xl">
            Have a direct Conversation!
          </div>
          <div className="mt-4 flex justify-center">
            <form onSubmit={handleSubmit} className="mx-2 py-4">
              <Input
                aria-label="search input"
                type="search"
                className="w-24 text-xs"
                placeholder="Find ya mate"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                contentLeft={
                  <SearchIcon
                    height={12}
                    width={12}
                    stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  />
                }
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMessageModal;
