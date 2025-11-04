import { createContext } from "react";

const ShortBaseURLContext = createContext();

export default function ShortBaseURLProvider({ children }) {
  const getShortUrl = (shortId) => {
    const hostname = import.meta.env.VITE_SHORT_HOSTNAME;
    const protocol = hostname?.includes("localhost") ? "http" : "https";
    return `${protocol}://${hostname}/r/${shortId}`;
  };

  const getShortHostname = () => {
    return import.meta.env.VITE_SHORT_HOSTNAME;
  };

  const value = {
    getShortUrl,
    getShortHostname,
    isProduction: !getShortHostname()?.includes("localhost"),
    config: {
      shortHostname: getShortHostname(),
    },
  };

  return (
    <ShortBaseURLContext.Provider value={value}>
      {children}
    </ShortBaseURLContext.Provider>
  );
}

export const ShortBaseURL = ShortBaseURLContext;
