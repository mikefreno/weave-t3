import { api } from "@/src/utils/api";
import { Button, Loading } from "@nextui-org/react";
import Head from "next/head";
import { useState } from "react";

export default function MongoSync() {
  const syncUsers = api.databaseMgmt.syncAllMongoUsers.useMutation();
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [syncUsersResponse, setSyncUsersResponse] = useState<string>("");

  const syncServers = api.databaseMgmt.syncAllMongoServers.useMutation();
  const [serverLoading, setServerLoading] = useState<boolean>(false);
  const [syncServersResponse, setSyncServersResponse] = useState<string>("");

  const userSync = async () => {
    setUserLoading(true);
    const res = await syncUsers.mutateAsync();
    if (typeof res.message === "string") {
      setSyncUsersResponse(res.message);
    } else {
      console.log(res);
      setSyncUsersResponse("Error: read logs");
    }
    setUserLoading(false);
  };

  const serverSync = async () => {
    setServerLoading(true);
    const res = await syncServers.mutateAsync();
    if (typeof res.message === "string") {
      setSyncServersResponse(res.message);
    } else {
      console.log(res);
      setSyncServersResponse("Error: read logs");
    }
    setServerLoading(false);
  };

  return (
    <>
      <Head>
        <title> Mongo DB Sync | Weave</title>
      </Head>
      <div className="bg-zinc-50 dark:bg-zinc-900">
        <div className="flex h-screen flex-row justify-evenly pt-[30vh]">
          <div className="flex flex-col">
            {userLoading ? (
              <Button disabled>
                <Loading type="points" />
              </Button>
            ) : (
              <Button color={"secondary"} onClick={userSync}>
                User Sync
              </Button>
            )}
            <div className="text-center">{syncUsersResponse}</div>
          </div>
          <div className="flex flex-col">
            {serverLoading ? (
              <Button disabled>
                <Loading type="points" />
              </Button>
            ) : (
              <Button color={"primary"} onClick={serverSync}>
                Server Sync
              </Button>
            )}
            <div className="text-center">{syncServersResponse}</div>
          </div>
        </div>
      </div>
    </>
  );
}
