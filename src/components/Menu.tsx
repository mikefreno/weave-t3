import React, { RefObject } from "react";
import Link from "next/link";
import { Nunito } from "@next/font/google";
import { Button, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const nunito_200 = Nunito({ weight: "200", subsets: ["latin"] });

const Menu = (props: {
  openLogin: React.MouseEventHandler<HTMLButtonElement>;
  menuRef: RefObject<HTMLDivElement>;
  session: any;
  status: any;
}) => {
  const pathname = usePathname();
  const { session, status } = props;

  return (
    <div
      id="menu"
      ref={props.menuRef}
      className={`fade-in absolute right-4 top-2 mr-2 ${
        pathname === "/app" ? "" : "md:hidden"
      }`}
    >
      <div
        className={`${nunito_200} rounded-lg border-2 border-zinc-400 bg-zinc-200 p-4 shadow-xl dark:border-zinc-300 dark:bg-zinc-800`}
      >
        <ul className="p-2">
          <li className="mb-4 pt-2 text-lg">
            {pathname == "/" ? null : (
              <Link
                href="/"
                className=" border-zinc-800  text-zinc-800 hover:border-b-2 dark:border-zinc-300  dark:text-zinc-300"
              >
                Home
              </Link>
            )}
          </li>
          <li className="mb-4 text-lg ">
            {pathname == "/downloads" ? null : (
              <Link
                href="/downloads"
                className=" border-zinc-800 text-zinc-800 hover:border-b dark:border-zinc-300  dark:text-zinc-300"
              >
                Downloads
              </Link>
            )}
          </li>
          {session ? (
            <li className="my-auto text-lg">
              <button
                onClick={() => signOut()}
                className="text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                Sign out
              </button>
            </li>
          ) : (
            <li className="my-auto text-lg">
              <button
                onClick={props.openLogin}
                className="text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-300"
              >
                Login / Register
              </button>
            </li>
          )}
          {pathname == "/app" ? null : (
            <li className="mt-4 text-lg">
              {status == "authenticated" ? (
                <Button shadow color="gradient" auto size={"sm"}>
                  <Link href={"/app"} className="text-[#E2E2E2]">
                    Web App
                  </Link>
                </Button>
              ) : (
                <Tooltip
                  content={"Login to use!"}
                  placement="bottomStart"
                  color={"secondary"}
                >
                  <Button shadow color="gradient" auto size={"sm"}>
                    <Link href={"/"} className="text-[#E2E2E2]">
                      Web App
                    </Link>
                  </Button>
                </Tooltip>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Menu;
