import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const InfoModalContent = () => {
  const pathname = usePathname();

  return (
    <>
      <Tooltip
        content={"Coming Soon!"}
        trigger="click"
        color={"secondary"}
        placement="top"
      >
        <div className="w-48 p-2">
          {pathname == "/downloads" ? (
            <div className="rounded-b rounded-tl-2xl rounded-tr-sm bg-purple-400 p-2 dark:bg-zinc-700">
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                Downloads
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Coming soon
              </p>
            </div>
          ) : (
            <div className="rounded-b rounded-tl-2xl rounded-tr-sm p-2 hover:bg-purple-400 dark:hover:bg-zinc-700">
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                Downloads
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Coming soon
              </p>
            </div>
          )}
        </div>
      </Tooltip>
      <div className="w-48 p-2">
        {pathname == "/roadmap" ? (
          <Link href="/roadmap">
            <div className="rounded bg-purple-400 p-2 dark:bg-zinc-700">
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                Roadmap
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                See whats coming to Weave
              </p>
            </div>
          </Link>
        ) : (
          <Link href="/roadmap">
            <div className="rounded p-2 hover:bg-purple-400 dark:hover:bg-zinc-700">
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                Roadmap
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                See what&apos;s coming to Weave next!
              </p>
            </div>
          </Link>
        )}
      </div>
      <div className="w-48 p-2">
        {pathname == "/docs/what-is-weave" ? (
          <Link href="/docs/what-is-weave">
            <div className="rounded bg-purple-400 p-2 dark:bg-zinc-700">
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                What is Weave?
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                An explainer
              </p>
            </div>
          </Link>
        ) : (
          <Link href="/docs/what-is-weave">
            <div className="rounded p-2 hover:bg-purple-400 dark:hover:bg-zinc-700">
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                What is Weave?
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                An explainer
              </p>
            </div>
          </Link>
        )}
      </div>
      <Tooltip
        content={"Coming Soon!"}
        trigger="click"
        color={"secondary"}
        placement="bottom"
      >
        <div className="w-48 p-2">
          {pathname == "/docs/api-intro" ? (
            <div
            // href="/docs/api-intro"
            >
              <div className="rounded bg-purple-400 p-2 dark:bg-zinc-700">
                <div className="text-lg text-zinc-800 dark:text-zinc-100">
                  API & Bots
                </div>
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  Get more from weave
                </p>
              </div>
            </div>
          ) : (
            <div
            // href="/docs/api-intro"
            >
              <div className="rounded p-2 hover:bg-purple-400 dark:hover:bg-zinc-700">
                <div className="text-lg text-zinc-800 dark:text-zinc-100">
                  API & Bots
                </div>
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  Get more from weave
                </p>
              </div>
            </div>
          )}
        </div>
      </Tooltip>
      <div className="w-48 p-2">
        {pathname == "/docs/terms-of-service" ? (
          <div
          // href="/docs/api-intro"
          >
            <div className="rounded-b-2xl rounded-t bg-purple-400 p-2 dark:bg-zinc-700">
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                Terms of Service
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Check out the ToS
              </p>
            </div>
          </div>
        ) : (
          <Link href="/docs/terms-of-service">
            <div className="rounded-b-2xl rounded-t p-2 hover:bg-purple-400 dark:hover:bg-zinc-700">
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                Terms of Service
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Check out the ToS
              </p>
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default InfoModalContent;
