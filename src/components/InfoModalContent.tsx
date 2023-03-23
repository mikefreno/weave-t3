import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import BackArrow from "../icons/BackArrow";

const InfoModalContent = (props: { isDarkTheme: boolean }) => {
  const { isDarkTheme } = props;
  const pathname = usePathname();
  const [showingDocs, setShowingDocs] = useState<boolean>(false);

  const firstPathnameChunk = pathname?.split("/")[1];

  const toggleDocsMenu = () => {
    setShowingDocs(!showingDocs);
  };

  if (showingDocs) {
    return (
      <>
        <button
          className="absolute ml-28 flex rounded-full py-1 px-2 hover:bg-purple-400 dark:hover:bg-zinc-700"
          onClick={toggleDocsMenu}
        >
          <div className="pl-1">Back</div>
          <div className="my-auto rotate-180">
            <BackArrow
              height={24}
              width={24}
              stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
              strokeWidth={1}
            />
          </div>
        </button>
        <div className="w-48 p-2 pt-8">
          {pathname == "/docs/roadmap" ? (
            <>
              <div className="rounded-b rounded-tr rounded-tl-2xl bg-purple-400 p-2 dark:bg-zinc-700">
                <div className="text-lg text-zinc-800 dark:text-zinc-100">
                  Roadmap
                </div>
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  See whats coming to Weave
                </p>
              </div>
            </>
          ) : (
            <Link href="/docs/roadmap">
              <div className="rounded-b rounded-tr rounded-tl-2xl p-2 hover:bg-purple-400 dark:hover:bg-zinc-700">
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
          {pathname == "/docs/privacy-policy" ? (
            <div>
              <div className="rounded bg-purple-400 p-2 dark:bg-zinc-700">
                <div className="text-lg text-zinc-800 dark:text-zinc-100">
                  Privacy Policy
                </div>
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  See how we gather and handle your data
                </p>
              </div>
            </div>
          ) : (
            <Link href="/docs/privacy-policy">
              <div className="rounded p-2 hover:bg-purple-400 dark:hover:bg-zinc-700">
                <div className="text-lg text-zinc-800 dark:text-zinc-100">
                  Privacy Policy
                </div>
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  See how we gather and handle your data
                </p>
              </div>
            </Link>
          )}
        </div>
        <div className="w-48 p-2">
          {pathname == "/docs/terms-of-service" ? (
            <div>
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
  } else {
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
          {pathname == "/docs/what-is-weave" ? (
            <>
              <div className="rounded bg-purple-400 p-2 dark:bg-zinc-700">
                <div className="text-lg text-zinc-800 dark:text-zinc-100">
                  What is Weave?
                </div>
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                  An explainer
                </p>
              </div>
            </>
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
        <div className="w-48 p-2">
          {firstPathnameChunk === "docs" ? (
            <button
              onClick={toggleDocsMenu}
              className="rounded-t rounded-b-2xl bg-purple-400 p-2 dark:bg-zinc-700"
            >
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                Docs
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                API, Bots, Terms of Service, and more
              </p>
            </button>
          ) : (
            <button
              onClick={toggleDocsMenu}
              className="rounded-t rounded-b-2xl p-2 hover:bg-purple-400 dark:hover:bg-zinc-700"
            >
              <div className="text-lg text-zinc-800 dark:text-zinc-100">
                Docs
              </div>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                API, Bots, Terms of Service, and more
              </p>
            </button>
          )}
        </div>
      </>
    );
  }
};

export default InfoModalContent;
