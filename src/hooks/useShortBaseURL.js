import { useContext } from "react";
import { ShortBaseURL } from "../context/ShortBaseURL";

export const useShortBaseUrl = () => {
  const context = useContext(ShortBaseURL);
  if (!context) {
    throw new Error(
      "useShortBaseUrl must be used within an ShortBaseURLProvider",
    );
  }
  return context;
};
