import BackArrow from "@/src/icons/BackArrow";
import SearchIcon from "@/src/icons/SearchIcon";
import Xmark from "@/src/icons/Xmark";
import { Input } from "@nextui-org/react";
import React, { RefObject, useContext, useState } from "react";
import ThemeContext from "../ThemeContextProvider";

const BotServiceModal = (props: {
  botModalRef: RefObject<HTMLDivElement>;
  botModalToggle: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Perform your search logic here
  };
  const switchToCategory = () => {};

  const showGoTo = (event: any) => {
    document
      .getElementById("goto")
      ?.classList.remove("opacity-0", "cursor-default");
  };

  return (
    <div id="modal" className="fixed">
      <div className="modal-offset absolute flex h-screen w-screen items-center justify-center">
        <div
          ref={props.botModalRef}
          className="fade-in -mt-24 h-96 w-3/4 rounded-xl bg-zinc-400 p-4 shadow-2xl dark:bg-zinc-800 sm:w-2/3 md:w-1/2 xl:w-1/3"
        >
          <button onClick={props.botModalToggle}>
            <Xmark className={"w-10"} />
          </button>
          <div className="mb-4 text-center text-2xl">
            Beep Boop. Find a bot here!
          </div>
          <div id="modal-body text-center">
            <div className="my-4 flex flex-col">
              <div className="text-center">Search by Category</div>
              <select
                id="BotCategories"
                className="custom-select mx-auto mt-2 w-1/2 rounded-xl border-zinc-300 bg-zinc-100 dark:bg-zinc-900"
                onChange={showGoTo}
                defaultValue={""}
              >
                <option value="" disabled className="">
                  Select Category
                </option>
                <option value="Productivity">Productivity</option>
                <option value="Chat">Chat</option>
                <option value="Utility">Utility</option>
                <option value="Creation">Creation</option>
                <option value="Comedy">Comedy</option>
                <option value="Education">Education</option>
              </select>

              <button
                id="goto"
                onClick={switchToCategory}
                className="hover:text-color-zinc ml-24 flex cursor-default justify-center opacity-0 transition duration-1000"
              >
                <span className="my-auto">Go to Category</span>
                <BackArrow
                  height={30}
                  width={30}
                  strokeWidth={1}
                  stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  className="rotate-180"
                />
              </button>
            </div>
            <div className="my-4 text-center">Search by Name</div>
            <form onSubmit={handleSubmit} className="mx-2 flex justify-center">
              <Input
                type="search"
                className="w-24 text-xs"
                size="lg"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                contentLeft={
                  <SearchIcon
                    height={12}
                    width={12}
                    stroke={isDarkTheme ? "#e4e4e7" : "#27272a"}
                  />
                }
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotServiceModal;
