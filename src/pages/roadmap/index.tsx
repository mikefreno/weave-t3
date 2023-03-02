import Navbar from "@/src/components/Navbar";
import React, { useEffect, useRef } from "react";

const RoadMap = () => {
  const switchRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Navbar switchRef={switchRef} />
      <div className="pt-20">
        <aside
          id="side"
          className="fixed h-screen w-52 border-r border-zinc-200 pt-2 pl-4"
        >
          <div className="text-xl font-semibold underline underline-offset-4">
            Roadmap Overview
          </div>
          <ul className="pl-4">
            <li className="hvr-move-right">
              <a
                href="#UI"
                className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                User Interface
              </a>
            </li>
            <li className="hvr-move-right">
              <a
                href="#UserAccount"
                className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
              >
                User / Account
              </a>
            </li>
            <li className="hvr-move-right">
              <a className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100">
                Servers
              </a>
            </li>
            <li className="hvr-move-right">
              <a className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100">
                Bots
              </a>
            </li>
            <li className="hvr-move-right">
              <a className="cursor-pointer text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100">
                Misc
              </a>
            </li>
          </ul>
        </aside>
        <div id="content" className="ml-52 flex-1 overflow-y-scroll pl-4">
          <div id="top" className="pb-16">
            <div className="text-3xl font-semibold tracking-wider">
              Weave Roadmap
            </div>
            <p className="px-36 pt-12 tracking-wide">
              This page is to outline the vision and progress of Weave. Broken
              down into the sections on the right, this roadmap will go over the
              various features planned and in development. Each feature will be
              labeled in the following way:{" "}
            </p>
            <ul className="px-40">
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-green-500 pt-1"></div>
                <div className="pl-2"> indicates the feature is launched</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">
                  indicates the feature is in active development
                </div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">indicates the feature is planned</div>
              </li>
            </ul>
            <p className="px-36 pt-2 tracking-wide">
              Everything is subject to change, feature that are launched may be
              unlaunched, and features in development may be axed at any given
              time. Feel free to reach out on the github repo at{" "}
              <a
                href="https://github.com/MikeFreno/weave-t3"
                className="hover:underline"
              >
                https://github.com/MikeFreno/weave-t3
              </a>{" "}
              or by email at{" "}
              <span className="underline underline-offset-2">
                michael@freno.me
              </span>
            </p>
          </div>
          <div id="UI" className="py-16">
            <div className="text-2xl font-semibold tracking-wider">
              User Interface
            </div>
            <p className="px-36 pt-12 tracking-wide">
              These features are mainly in reference to the way the app looks,
              and the way that you as a user interact with it
            </p>
            <ul className="px-40">
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">
                  Mobile experience improvements to web app
                </div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">
                  Mobile experience improvements to front-page
                </div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">
                  Accessibility improvements (catch all for blindness, color
                  blindness support, font-size changes, etc.)
                </div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Real name vs Pseudonym Preference</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Real name usage alerts</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Availability indicators on user icon</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">
                  Show user on comment icon click/hover
                </div>
              </li>
            </ul>
          </div>
          <div id="UserAccount">
            <div className="text-2xl font-semibold tracking-wider">
              User / Account
            </div>
            <p className="px-36 pt-12 tracking-wide">
              These features regard your control over your account
            </p>
            <ul className="px-40">
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">
                  Getting Google authentication enabled
                </div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">
                  Multiple auth methods for one account, such as Email, and
                  Google
                </div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Account Deletion</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Friends</div>
              </li>
            </ul>
          </div>
          <div id="UserAccount">
            <div className="text-2xl font-semibold tracking-wider">Server</div>
            <p className="px-36 pt-12 tracking-wide">
              These features regard how servers function
            </p>
            <ul className="px-40">
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Message Link Preview</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Message Attachments</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Server Aesthetics</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Server Admin</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Server Templates</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Voice Channels</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Channel Deletion</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Real name vs Pseudonym</div>
              </li>
            </ul>
          </div>
          <div id="misc">
            <div className="text-2xl font-semibold tracking-wider">
              Miscellaneous
            </div>
            <p className="px-36 pt-12 tracking-wide">
              These features don't neatly fall into any of the previous
              categories
            </p>
            <ul className="px-40">
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Direct Messaging</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">User Search</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Server Search</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Desktop App</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Mobile Apps</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-zinc-900 pt-1"></div>{" "}
                <div className="pl-2">Usage Statistics</div>
              </li>
              <li className="flex">
                <div className="my-auto h-3 w-3 rounded-full border border-zinc-400 bg-orange-500 pt-1"></div>{" "}
                <div className="pl-2">Privacy Policy Documentation</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadMap;
