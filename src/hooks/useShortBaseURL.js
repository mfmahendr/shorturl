import { useContext } from "react";
import ShortBaseURLContext from "../context/ShortBaseURL";

export const useShortBaseUrl = () => {
  const context = useContext(ShortBaseURLContext);
  if (!context) {
    throw new Error(
      "useShortBaseUrl must be used within an ShortBaseURLProvider",
    );
  }
  return context;
};
