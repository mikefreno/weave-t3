import { Server } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ServerMainScreen = (props: {
  usersServers: Server[] | undefined;
  selectedInnerTabID: number;
}) => {
  const { usersServers } = props;
  const [thisServer, setThisServer] = useState<Server | null>(null);

  useEffect(() => {
    if (usersServers) {
      const serverMatch = usersServers.find(
        (server) => server.id === props.selectedInnerTabID
      );
      if (serverMatch) {
        setThisServer(serverMatch);
      }
    }
  }, []);

  return (
    <div>
      {thisServer?.banner_url ? (
        <div className="h-64 lg:h-72 xl:h-80">
          <img
            src={thisServer?.banner_url}
            alt={`${thisServer?.name}-banner`}
            className="h-full w-full rounded-b-lg object-cover object-center"
          />
        </div>
      ) : null}
    </div>
  );
};

export default ServerMainScreen;
