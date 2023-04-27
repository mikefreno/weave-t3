// usePlatform.ts
import { useEffect, useState } from "react";

export type Platform = "Windows" | "Mac" | "Linux" | "Android" | "iOS" | "Unknown";

const detectPlatform = (userAgent: string): Platform => {
  if (/Android/i.test(userAgent)) {
    return "Android";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "iOS";
  } else if (/Mac/i.test(userAgent) && !/like Mac/i.test(userAgent)) {
    return "Mac";
  } else if (/Win/i.test(userAgent)) {
    return "Windows";
  } else if (/Linux/i.test(userAgent)) {
    return "Linux";
  } else {
    return "Unknown";
  }
};

export const usePlatform = (): Platform => {
  const [platform, setPlatform] = useState<Platform>("Unknown");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setPlatform(detectPlatform(userAgent));
  }, []);

  return platform;
};
