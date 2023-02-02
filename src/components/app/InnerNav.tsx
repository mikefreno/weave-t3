import AddIcon from "@/src/icons/AddIcon";
import HandWave from "@/src/icons/HandWave";
import PaperPlanes from "@/src/icons/PaperPlanes";
import SearchIcon from "@/src/icons/SearchIcon";
import { Input } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import ThemeContext from "../ThemeContextProvider";

function InnerNav(props: { currentTab: string }) {
  const { currentTab } = props;
  const { isDarkTheme } = useContext(ThemeContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInnerTab, setSelectedInnerTab] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Perform your search logic here
  };

  if (currentTab == "0") {
    return (
      <div className="">
        <form onSubmit={handleSubmit} className="mx-2 my-4">
          <Input
            type="search"
            className="w-24 text-xs"
            placeholder="Search..."
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
        <button
          className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
            selectedInnerTab == "friends"
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("friends")}
        >
          <span className="my-auto">
            <HandWave
              height={24}
              width={24}
              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
            />
          </span>
          <span className="mx-auto">Friends</span>
        </button>
        <button
          className={`mx-auto mt-1 flex w-11/12 rounded-md px-4 py-2 text-lg ${
            selectedInnerTab == "conversations"
              ? "bg-zinc-400 dark:bg-zinc-500"
              : "hover:bg-zinc-600 dark:hover:bg-zinc-700"
          }`}
          onClick={() => setSelectedInnerTab("conversations")}
        >
          <span className="my-auto">
            <PaperPlanes
              height={24}
              width={24}
              color={isDarkTheme ? "#e4e4e7" : "#27272a"}
            />
          </span>
          <span className="mx-auto">Conversations</span>
        </button>
      </div>
    );
  } else {
    return <div>Not DM tab</div>;
  }
}

export default InnerNav;
