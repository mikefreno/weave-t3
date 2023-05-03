import { Loading } from "@nextui-org/react";
import DarkLogo from "@/public/Logo - dark.png";
import LightLogo from "@/public/Logo - light.png";
import Image from "next/image";
import { useContext } from "react";
import ThemeContext from "./ThemeContextProvider";

export default function AdjustableLoadingElement() {
  const { isDarkTheme } = useContext(ThemeContext);

  return (
    <div className="flex h-full items-center justify-center">
      <Loading size="xl" color={"secondary"} />
      <Image src={isDarkTheme ? DarkLogo : LightLogo} alt={"logo"} height={50} width={50} className="absolute" />
    </div>
  );
}
