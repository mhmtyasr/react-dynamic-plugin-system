import { createContext, useState, useContext, useRef, useEffect } from "react";
import { IPluginUIModel, PluginStatus } from "../models/plugin";
import React from "react";
export interface PluginContextType {
  pluginUploading: boolean;
  setPluginUploading: (pluginUploading: boolean) => void;
}

let PluginContext = createContext<PluginContextType>(null!);


function PluginProvider({ children }: { children: React.ReactNode }) {
  const [pluginUploading, setPluginUploading] = useState<boolean>(true);

  let value = {
    pluginUploading,
    setPluginUploading
  };

  return (
    <PluginContext.Provider value={value}>{children}</PluginContext.Provider>
  );
}

const usePlugin = (): PluginContextType => {
  return useContext(PluginContext);
};

export { usePlugin, PluginProvider };

