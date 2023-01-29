import React, { useState } from "react";
import Link from "next/link";
import { Nunito, Raleway } from "@next/font/google";
import LoginModal from "./loginModal";
import { Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const nunito_200 = Nunito({ weight: "200", subsets: ["latin"] });

function Menu({ openLogin }: any) {
  const pathname = usePathname();
  return (
    <div id="menu" className="fade-in absolute right-4 top-2 mr-2 md:hidden">
      <div
        className={`${nunito_200} rounded-lg border-2 border-gray-300 bg-zinc-200 p-4 shadow-xl dark:bg-zinc-800`}
      >
        <ul className="py-4 px-4">
          <li className="mb-4 pt-2 text-lg">
            {pathname == "/" ? (
              <Link
                href="/"
                className="border-b-2 border-zinc-800 text-zinc-800 dark:border-zinc-300 dark:text-zinc-300"
              >
                Home
              </Link>
            ) : (
              <Link
                href="/"
                className=" border-zinc-800  text-zinc-800 hover:border-b-2 dark:border-zinc-300  dark:text-zinc-300"
              >
                Home
              </Link>
            )}
          </li>
          <li className="mb-4 text-lg ">
            {pathname == "/downloads" ? (
              <Link
                href="/downloads"
                className="border-b-2 border-zinc-800 text-zinc-800 dark:border-zinc-300 dark:text-zinc-300"
              >
                Download
              </Link>
            ) : (
              <Link
                href="/downloads"
                className=" border-zinc-800  text-zinc-800 hover:border-b-2 dark:border-zinc-300  dark:text-zinc-300"
              >
                Download
              </Link>
            )}
          </li>
          <li className="mb-2 text-lg">
            <button
              onClick={openLogin}
              className="border-[#171717] hover:border-b-2"
            >
              Login / Register
            </button>
          </li>
          <li className="mt-4 text-lg">
            <Button shadow color="gradient" auto>
              <Link href={"/app"} className="text-zinc-300">
                Web App
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
