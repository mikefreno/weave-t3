import { Server } from "@prisma/client";
import Image from "next/image";
import React from "react";

const ServerMainScreen = (props: {
  usersServers: Server[];
  selectedInnerTabID: number;
}) => {
  const { usersServers } = props;
  const thisServer = usersServers.find(
    (server) => server.id === props.selectedInnerTabID
  );

  return (
    <div>
      {thisServer?.banner_url ? (
        <div className="h-64 lg:h-72 xl:h-80">
          <img
            src={thisServer?.banner_url}
            alt={`${thisServer?.name}-banner`}
            className="h-full w-full rounded-lg object-cover object-center"
          />
        </div>
      ) : null}
    </div>
  );
};

export default ServerMainScreen;
