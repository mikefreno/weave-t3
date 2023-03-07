import Navbar from "@/src/components/Navbar";
import ThemeContext from "@/src/components/ThemeContextProvider";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";
import NamingsImage from "@/public/namings.jpg";
import Head from "next/head";

export default function WhatIsWeave() {
  const switchRef = useRef<HTMLDivElement>(null);

  const [scrollPosition, setScrollPosition] = useState(0);

  const firstHighlight = useRef<HTMLSpanElement>(null);
  const secondHighlight = useRef<HTMLSpanElement>(null);
  const thirdHighlight = useRef<HTMLSpanElement>(null);
  const fourthHighlight = useRef<HTMLSpanElement>(null);
  const fifthHighlight = useRef<HTMLSpanElement>(null);
  const sixthHighlight = useRef<HTMLSpanElement>(null);
  const seventhHighlight = useRef<HTMLSpanElement>(null);
  const eighthHighlight = useRef<HTMLSpanElement>(null);
  const ninthHighlight = useRef<HTMLSpanElement>(null);
  const { isDarkTheme } = useContext(ThemeContext);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log(scrollPosition);
    setTimeout(() => {
      firstHighlight.current?.classList.add("highlightLong");
    }, 2500);
    setTimeout(() => {
      secondHighlight.current?.classList.add("highlightExtraLong");
    }, 3500);

    if (scrollPosition >= 5) {
      firstHighlight.current?.classList.add("highlight");
    }
    if (scrollPosition >= 20) {
      secondHighlight.current?.classList.add("highlightLong");
    }
    if (scrollPosition >= 190) {
      thirdHighlight.current?.classList.add("highlightLong");
    }

    if (scrollPosition >= 270) {
      fourthHighlight.current?.classList.add("highlight");
    }
    if (scrollPosition >= 310) {
      fifthHighlight.current?.classList.add("highlightExtraLong");
    }
    if (scrollPosition >= 385) {
      sixthHighlight.current?.classList.add("highlightExtraLong");
    }
    if (scrollPosition >= 440) {
      seventhHighlight.current?.classList.add("highlightExtraLong");
    }
    if (scrollPosition >= 440) {
      eighthHighlight.current?.classList.add("highlightExtraLong");
    }
    if (scrollPosition >= 440) {
      ninthHighlight.current?.classList.add("highlightLong");
    }
  }, [scrollPosition]);

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900">
      <Head>
        <title>What is Weave? | Weave</title>
        <meta name="description" content="Weave explainer" />
      </Head>
      <Navbar switchRef={switchRef} />
      <div className="fade-in">
        <div className="pt-20 text-center text-4xl tracking-wider">
          What is Weave?
        </div>
        <div className="flex justify-center py-14">
          <Image
            src={isDarkTheme ? DarkLogo : LightLogo}
            alt="logo"
            width={160}
            height={160}
            priority
          />
        </div>
        <p className="mx-auto w-3/4 text-center text-xl tracking-wide md:w-1/2 xl:w-1/3">
          Weave is a communication platform that empowers communities with{" "}
          <span ref={firstHighlight} className="highlightSpacings inline-block">
            powerful tools
          </span>{" "}
          and puts{" "}
          <span
            ref={secondHighlight}
            className="highlightSpacings inline-block"
          >
            {" "}
            users in control of their data,
          </span>{" "}
          with customizable privacy settings at every level.
        </p>
        <div className="pt-20 text-center text-3xl tracking-wide">
          Real names vs Pseudonyms
        </div>
        <div className="flex justify-center py-14">
          <Image
            src={NamingsImage}
            alt="RealName&Pseudonym"
            width={350}
            height={160}
            className="rounded-lg"
          />
        </div>
        <p className="mx-auto w-3/4 text-center text-xl tracking-wide md:w-1/2 xl:w-1/3">
          Just like in world of atoms, in the world of bits,{" "}
          <span ref={thirdHighlight} className="highlightSpacings inline-block">
            first impressions
          </span>{" "}
          dictate to a large degree how interactions will go. It is for this
          reason that Weave allows for{" "}
          <span
            ref={fourthHighlight}
            className="highlightSpacings inline-block"
          >
            both
          </span>{" "}
          real names and pseudonyms{" "}
          <span ref={fifthHighlight} className="highlightSpacings inline-block">
            dictated at the server and channel level.
          </span>
        </p>
        <p className="mx-auto w-3/4 py-4 text-center text-xl tracking-wide md:w-1/2 xl:w-1/3">
          Anonymity (or pseudonymity) can be leveraged{" "}
          <span ref={sixthHighlight} className="highlightSpacings inline-block">
            for many important purposes,
          </span>{" "}
          including:
        </p>
        <ul className="mx-auto w-3/4 pb-36 text-center text-xl tracking-wide md:w-1/2 xl:w-1/3">
          <li>
            Voicing{" "}
            <span
              ref={seventhHighlight}
              className="highlightSpacings inline-block"
            >
              unpopular opinions
            </span>
          </li>
          <li>
            <span
              ref={eighthHighlight}
              className="highlightSpacings inline-block"
            >
              Increasing participation
            </span>{" "}
            by reducing barriers
          </li>
          <li>
            And the{" "}
            <span
              ref={ninthHighlight}
              className="highlightSpacings inline-block"
            >
              protection of privacy
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
