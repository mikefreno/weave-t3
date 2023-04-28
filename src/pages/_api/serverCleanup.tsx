import { api } from "@/src/utils/api";
import { Button, Loading } from "@nextui-org/react";
import { Server, User } from "@prisma/client";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function ServerCleanup() {
  const [serverDeletionLoadingMap, setServerDeletionLoadingMap] = useState<Map<string, boolean>>(new Map());
  //prettier ignore
  const [unlistedServers, setUnlistedServers] = useState<(Server & { owner: User })[]>([]);

  const deleteUnlistedServers = api.server.deleteUnlistedServer.useMutation();
  const getUnlistedServers = api.server.getUnlistedServers.useQuery();

  useEffect(() => {
    if (getUnlistedServers && getUnlistedServers.data) {
      setUnlistedServers(getUnlistedServers.data);
    }
  }, [getUnlistedServers]);

  const serverDeletion = async (serverID: number) => {
    await deleteUnlistedServers.mutateAsync(serverID);
    await getUnlistedServers.refetch();
  };

  const deleteAll = async () => {
    await Promise.all(unlistedServers.map(async (server) => await deleteUnlistedServers.mutateAsync(server.id)));
    getUnlistedServers.refetch();
  };

  return (
    <>
      <Head>
        <title> Mongo DB Sync | Weave</title>
      </Head>
      <div className="bg-zinc-50 dark:bg-zinc-900">
        <div className="flex h-screen flex-row justify-evenly pt-[30vh]">
          <div className="flex w-full flex-col">
            <div className="-ml-14 flex w-full justify-evenly">
              <div>Name</div>
              <div>Blurb</div>
              <div>Owner Email</div>
              <div></div>
            </div>
            <hr className="my-4" />
            {unlistedServers.map((server) => (
              <div key={server.id} className="flex w-full justify-evenly">
                <div className="my-auto">{server.name}</div>
                <div className="my-auto italic">{server.blurb}</div>
                <div className="my-auto italic">{server.owner.email}</div>
                <div>
                  <Button size={"sm"} color={"error"} onClick={() => serverDeletion(server.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {unlistedServers.length > 0 ? (
              <div className="flex justify-center pt-24">
                <Button color={"error"} size={"lg"} auto onClick={deleteAll}>
                  Delete All
                </Button>
              </div>
            ) : (
              <div className="text-center text-lg">Unlisted Servers will appear here</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
