import { Loading } from "@nextui-org/react";
import Image from "next/image";
import LightLogo from "@/public/Logo - light.png";
import DarkLogo from "@/public/Logo - dark.png";

const LoadingOverlay = (props: { isDarkTheme: boolean }) => {
  const { isDarkTheme } = props;
  return (
    <div className="absolute z-[100] flex h-screen w-screen justify-center pt-[45vh] backdrop-blur">
      <Loading color={"secondary"} size="xl" />
      <div className="absolute mt-2">
        {isDarkTheme ? (
          <Image src={DarkLogo} alt={"logo"} width="50" />
        ) : (
          <Image src={LightLogo} alt={"logo"} width="50" />
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
