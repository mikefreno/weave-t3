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
            <div className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]">
              <div className="rounded-b rounded-tl-2xl rounded-tr-sm bg-zinc-600 p-2">
                <div className="text-lg text-zinc-100">Downloads</div>
                <p className="text-center text-sm text-zinc-400">Coming soon</p>
              </div>
            </div>
          ) : (
            <div className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]">
              <div className="rounded-b rounded-tl-2xl rounded-tr-sm p-2 hover:bg-zinc-700">
                <div className="text-lg text-zinc-100">Downloads</div>
                <p className="text-center text-sm text-zinc-400">Coming soon</p>
              </div>
            </div>
          )}
        </div>
      </Tooltip>
      <div className="w-48 p-2">
        {pathname == "/roadmap" ? (
          <Link
            href="/roadmap"
            className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
          >
            <div className="rounded bg-zinc-600 p-2">
              <div className="text-lg text-zinc-100">Roadmap</div>
              <p className="text-center text-sm text-zinc-400">
                See whats coming to Weave
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href="/roadmap"
            className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
          >
            <div className="rounded p-2 hover:bg-zinc-700">
              <div className="text-lg text-zinc-100">Roadmap</div>
              <p className="text-center text-sm text-zinc-400">
                See what&apos;s coming to Weave next!
              </p>
            </div>
          </Link>
        )}
      </div>
      <div className="w-48 p-2">
        {pathname == "/docs/what-is-weave" ? (
          <Link
            href="/docs/what-is-weave"
            className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
          >
            <div className="rounded bg-zinc-600 p-2">
              <div className="text-lg text-zinc-100">What is Weave?</div>
              <p className="text-center text-sm text-zinc-400">An explainer</p>
            </div>
          </Link>
        ) : (
          <Link
            href="/docs/what-is-weave"
            className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
          >
            <div className="rounded p-2 hover:bg-zinc-700">
              <div className="text-lg text-zinc-100">What is Weave?</div>
              <p className="text-center text-sm text-zinc-400">An explainer</p>
            </div>
          </Link>
        )}
      </div>
      <div className="w-48 p-2">
        {pathname == "/docs/api-intro" ? (
          <Link
            href="/docs/api-intro"
            className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
          >
            <div className="rounded-b-2xl rounded-t-sm bg-zinc-600 p-2">
              <div className="text-lg text-zinc-100">API & Bots</div>
              <p className="text-center text-sm text-zinc-400">
                Get more from weave
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href="/docs/api-intro"
            className="border-[#171717] text-[#171717] dark:border-[#E2E2E2] dark:text-[#E2E2E2]"
          >
            <div className="rounded-b-2xl rounded-t-sm p-2 hover:bg-zinc-700">
              <div className="text-lg text-zinc-100">API & Bots</div>
              <p className="text-center text-sm text-zinc-400">
                Get more from weave
              </p>
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default InfoModalContent;
