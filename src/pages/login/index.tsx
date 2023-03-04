import LoginModal from "@/src/components/loginModal";
import Navbar from "@/src/components/Navbar";
import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import React, { useRef } from "react";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const switchRef = useRef<HTMLDivElement>(null);

  if (status === "authenticated") {
    router.push("/app");
  }
  return (
    <div>
      <Head>
        <title>Login | Weave</title>
        <meta name="description" content="Login" />
      </Head>
      <Navbar switchRef={switchRef} />
      <div className="pt-24 text-center text-3xl">
        You must be logged in to use that page
      </div>
      <LoginModal onClose={undefined} loginRef={undefined} />
    </div>
  );
};

export default LoginPage;
