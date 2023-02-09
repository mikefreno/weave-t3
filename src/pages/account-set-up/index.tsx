import { useSession } from "next-auth/react";

import React, { useEffect, useState } from "react";
import router from "next/router";
import { Loading } from "@nextui-org/react";

const tempPage = () => {
  const { data: session } = useSession();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (session) {
      router.push(`/account-set-up/${session?.user?.id} `);
    }
    setTimer(timer + 1);
    console.log(timer);
    if (timer >= 20) {
      router.push("/");
    }
  }, [session]);

  return (
    <>
      <div className="mx-auto my-auto -mt-24 flex h-screen flex-row items-center justify-center text-3xl">
        Loading...
        <Loading />
      </div>
      <div></div>
    </>
  );
};

export default tempPage;
