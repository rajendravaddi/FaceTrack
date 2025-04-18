import React, { createContext, useContext, useState } from "react";

// Create context
const IpAddressContext = createContext();

// Provider
export const IpAddressProvider = ({ children }) => {
  const [ipAddress, setIpAddress] = useState("");

  return (
    <IpAddressContext.Provider value={{ ipAddress, setIpAddress }}>
      {children}
    </IpAddressContext.Provider>
  );
};

// Hook to use context
export const useIpAddress = () => useContext(IpAddressContext);
