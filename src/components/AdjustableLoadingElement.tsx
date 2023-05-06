import { Loading } from "@nextui-org/react";
import DarkLogo from "@/public/Logo - dark.png";
import LightLogo from "@/public/Logo - light.png";
import Image from "next/image";
import { useContext } from "react";
import ThemeContext from "./ThemeContextProvider";

export default function AdjustableLoadingElement(props: {
  specifiedHeight?: number;
  specifiedWidth?: number;
  specifiedSpinnerSize?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div className="flex h-full items-center justify-center">
      <Loading size={props.specifiedSpinnerSize ? props.specifiedSpinnerSize : "xl"} color={"secondary"} />
      <Image
        src={isDarkTheme ? DarkLogo : LightLogo}
        alt={"logo"}
        height={props.specifiedHeight ? props.specifiedHeight : 50}
        width={props.specifiedWidth ? props.specifiedWidth : 50}
        className="absolute"
      />
    </div>
  );
}
