import SearchIcon from "@/src/icons/SearchIcon";
import { Input } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import ServerCard from "./ServerCard";

const PublicServersPages = (props: { selectedInnerTab: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);

  //need to grab all of the servers for the given page and pass them to be used in the map function that uses the following
  const servers = [1, 2, 3, 4, 5, 6];

  return (
    <div className="bg-zinc-300 dark:bg-zinc-700">
      <div className="mx-auto h-96 rounded-md bg-[url('/Forest-painting.png')] bg-cover bg-center bg-no-repeat pt-24"></div>
      <div className="flex flex-col items-center text-center">
        <div className="text-2xl">
          Find your Community
          {props.selectedInnerTab === "Made By Weave" ? ", " : " in "}
          {props.selectedInnerTab}!
        </div>
        <div className="my-6 pt-12">
          <Input
            type="search"
            className="z-0 text-xs"
            css={{ zIndex: 0 }}
            size="xl"
            labelPlaceholder="Find your Community..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            contentClickable
            contentRight={
              <button className="">
                <SearchIcon
                  height={24}
                  width={24}
                  stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                />
              </button>
            }
          />
        </div>
      </div>
      <div className="mx-4 pt-12">
        <div className="grid grid-flow-row grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
          {servers.map((child, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="rounded-lg shadow-lg">
                <ServerCard
                  logo={""}
                  banner={""}
                  name={""}
                  blurb={""}
                  members={0}
                  membersOnline={0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicServersPages;
