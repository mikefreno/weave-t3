import React from "react";
import GitHub from "@/src/icons/GitHub";
import LinkedIn from "@/src/icons/LinkedIn";
import Envelope from "@/src/icons/Envelope";

function Footer(props: { fillColor: string }) {
  const currentYear = new Date().getFullYear().toString();
  let copyright_tag = "2023";
  if (currentYear != "2023") {
    copyright_tag += ` - ${currentYear}`;
  }

  return (
    <div className="mx-auto mt-12 h-2/5 w-screen text-center text-[#171717] dark:text-[#E2E2E2]">
      <ul className="icons mt-6">
        <li>
          <a
            href="https://github.com/MikeFreno/"
            target="_blank"
            className="hvr-grow-rotate-left rounded-full border-[#171717] dark:border-[#E2E2E2]"
          >
            <span className="m-auto">
              <GitHub
                height={16}
                width={16}
                fill={props.fillColor}
                stroke={undefined}
              />
            </span>
          </a>
        </li>
        <li>
          <a
            href="mailto:mike@notesapp.net"
            className="hvr-grow rounded-full border-[#171717] dark:border-[#E2E2E2]"
          >
            <span className="m-auto">
              <Envelope height={16} width={16} fill={props.fillColor} />
            </span>
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/michael-freno-176001256/"
            target="_blank"
            className="hvr-grow-rotate rounded-full border-[#171717] dark:border-[#E2E2E2]"
          >
            <span className="m-auto">
              <LinkedIn
                height={16}
                width={16}
                fill={props.fillColor}
                stroke={undefined}
              />
            </span>
          </a>
        </li>
      </ul>
      <div className="mr-24 mb-12 -mt-6 flex flex-col items-end">
        <span className="flex">©{copyright_tag}</span>
        <span className="flex">Michael Freno</span>
      </div>
    </div>
  );
}

export default Footer;
