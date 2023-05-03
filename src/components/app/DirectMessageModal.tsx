import SearchIcon from "@/src/icons/SearchIcon";
import { Input } from "@nextui-org/react";
import React, { RefObject, useContext, useRef, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import { api } from "@/src/utils/api";
import { type Server as MongoServer, type User as MongoUser } from "@prisma/client/mongo";
import Search from "./Search";
import useOnClickOutside from "@/src/components/ClickOutsideHook";

const DirectMessageModal = (props: {
  directMessageModalRef: RefObject<HTMLDivElement>;
  userSelect: (input: MongoUser) => void;
}) => {
  const { isDarkTheme } = useContext(ThemeContext);
  //state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("Recent");
  const [userSearchData, setUserSearchData] = useState<MongoUser[] | null>(null);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  //ref
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const getUserSearchData = api.search.getMongoUsers.useMutation();

  //click outside hook
  useOnClickOutside([searchInputRef, searchResultsRef], () => {
    setShowSearch(false);
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Perform your search logic here
  };

  const loadUserSearchData = async () => {
    if (!userSearchData) {
      const res: MongoUser[] | null = await getUserSearchData.mutateAsync();
      if (res) {
        setUserSearchData(res);
      } else {
        console.log("error retrieving user search data");
      }
    }
  };

  return (
    <div id="modal" className="fixed">
      <div className="modal-offset absolute flex h-screen w-screen items-center justify-center">
        <div
          ref={props.directMessageModalRef}
          id="serverModalContent"
          className="fade-in -mt-24 w-3/4 rounded-xl bg-zinc-400 p-12 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          <div className="text-center text-2xl">Have a direct Conversation!</div>
          <div className="mt-4 flex justify-center">
            <form onSubmit={handleSubmit} className="mx-2 py-4">
              <Input
                aria-label="search input"
                type="search"
                className="w-24 text-xs"
                placeholder="Find ya mate"
                value={searchTerm}
                onFocus={() => {
                  loadUserSearchData();
                  setShowSearch(true);
                }}
                onChange={(event) => setSearchTerm(event.target.value)}
                contentLeft={<SearchIcon height={12} width={12} stroke={isDarkTheme ? "#e4e4e7" : "#27272a"} />}
              />
              {showSearch && userSearchData && searchTerm.length > 2 ? (
                <div className="flex justify-center">
                  <div className="fixed w-48 " ref={searchResultsRef}>
                    <Search userInput={searchTerm} select={props.userSelect} userData={userSearchData} />
                  </div>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMessageModal;
