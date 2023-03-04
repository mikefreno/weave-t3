import Link from "next/link";
import React, { useRef } from "react";
import Xmark from "../icons/Xmark";

const StageBanner = (props: { isDarkTheme: boolean }) => {
  const banner = useRef<HTMLDivElement | null>(null);
  const close = () => {
    banner.current!.style.display = "none";
  };
  return (
    <div
      ref={banner}
      className="bannerBGColor fixed z-[100] flex w-screen py-2 backdrop-blur"
    >
      <button onClick={close} className="my-auto flex justify-end">
        <Xmark
          className={"w-8"}
          color={props.isDarkTheme ? "#e4e4e7" : "#27272a"}
        />
      </button>
      <div className="my-auto pl-12">
        This app is currently in an alpha stage, many core feature have yet to
        be deployed. Read more <Link href={"/roadmap"}>here</Link>
      </div>
    </div>
  );
};

export default StageBanner;
