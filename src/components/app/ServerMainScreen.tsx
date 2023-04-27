import { Server } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ServerMainScreen = (props: {
  usersServers: Server[] | undefined;
  selectedInnerTabID: number;
  selectedServer: Server | null;
}) => {
  const { usersServers, selectedServer } = props;

  return (
    <div>
      <div className="w-full justify-center">
        {selectedServer?.banner_url ? (
          <div className="h-64 lg:h-72 xl:h-80">
            <img
              src={selectedServer?.banner_url}
              alt={`${selectedServer?.name}-banner`}
              className="h-full w-full rounded-b-lg object-cover object-center"
            />
          </div>
        ) : null}
      </div>
      <div className="flex justify-center pt-12">
        <div className="flex max-w-[60vw] flex-col text-center">
          <div className="text-xl">
            Welcome to <span className="tracking-wider underline underline-offset-4">{selectedServer?.name}</span>
          </div>
          <div className="py-4">- {selectedServer?.blurb}</div>
          <div className="mx-auto py-4">
            <img src={selectedServer?.logo_url as string} className="h-32 w-32 md:h-64 md:w-64" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerMainScreen;
