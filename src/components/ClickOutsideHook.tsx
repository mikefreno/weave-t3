import { useEffect, RefObject } from "react";

type Refs = RefObject<HTMLElement>[];

const useOnClickOutside = (
  refs: Refs,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const contains = refs.reduce<boolean | null>(
        (acc, curr) =>
          acc || (curr.current && curr.current.contains(event.target as Node)),
        false
      );
      if (contains) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler]);
};
export default useOnClickOutside;
