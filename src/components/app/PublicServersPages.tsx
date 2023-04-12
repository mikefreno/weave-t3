import SearchIcon from "@/src/icons/SearchIcon";
import { api } from "@/src/utils/api";
import { Input } from "@nextui-org/react";
import { Server } from "@prisma/client";
import React, { useContext, useEffect, useState } from "react";
import ThemeContext from "../ThemeContextProvider";
import ServerCard from "./ServerCard";

interface PublicServersPagesProps {
  selectedInnerTab: string;
  refreshUserServers: () => void;
  fullscreen: boolean;
}

export default function PublicServersPages(props: PublicServersPagesProps) {
  const { selectedInnerTab, refreshUserServers, fullscreen } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);
  const [servers, setServers] = useState<Server[]>();
  //need to grab all of the servers for the given page and pass them to be used in the map function that uses the following
  const serverMutation = api.server.getAllPublicServers.useMutation();

  const getServers = async () => {
    const serverRes = await serverMutation.mutateAsync(selectedInnerTab);
    setServers(serverRes);
  };

  useEffect(() => {
    getServers();
  }, [selectedInnerTab]);

  return (
    <>
      <div className="">
        <div className="scrollXDisabled h-screen rounded bg-zinc-50 dark:bg-zinc-900">
          <div className={`fixed z-20 ${fullscreen ? "w-screen" : "w-full"}`}>
            <div className="mx-auto -mt-24 h-64 rounded-md bg-[url('/Forest-painting.png')] bg-cover bg-center bg-no-repeat pt-24 md:h-96"></div>
          </div>
          <div id="spacer" className="mt-52 pt-6 md:mt-72"></div>
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl">
              Find your Community
              {props.selectedInnerTab === "Made By Weave" ? ", " : " in "}
              {props.selectedInnerTab}!
            </div>
            <div className="py-6 pt-12">
              <Input
                aria-label="search input"
                type="search"
                className="z-0 text-xs"
                css={{ zIndex: 0 }}
                size="xl"
                status="secondary"
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
          <div className="z-0 px-4 py-24">
            <div className="grid grid-flow-row grid-cols-1 gap-8 overflow-y-scroll  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {servers ? (
                servers.map((child, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="rounded-lg shadow-lg">
                      <ServerCard
                        logo={child.logo_url ? child.logo_url : ""}
                        banner={child.banner_url ? child.banner_url : ""}
                        name={child.name}
                        blurb={child.blurb ? child.blurb : ""}
                        members={0}
                        membersOnline={0}
                        serverID={child.id}
                        refreshUserServers={refreshUserServers}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-xl">
                  No public servers in this category yet!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
