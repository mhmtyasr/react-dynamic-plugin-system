import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
} from "react";
import { IJsonModel } from "flexlayout-react";
import axios from "axios";
import { getPluginsFromLayout } from "../helper";
import { usePlugin } from "./pluginProvider";
import { Spin } from "antd";

export interface DynamicContextType {
  getContextApi: (servicesName: string) => any;
}

let DynamicContext = createContext<DynamicContextType>(null!);

function DynamicProvider({ children }: { children: React.ReactNode }) {
  const { pluginUploading, setPluginUploading } = usePlugin();

  const contexts = useRef<React.Context<any>[]>([]);
  const providers = useRef<any[]>([]);

  let layoutModel = JSON.parse(
    localStorage.getItem("layout") as string
  ) as IJsonModel | null;


  //Uploading all plugins from layout
  const getAllPlugins =  async () => {
    const plugins = getPluginsFromLayout(layoutModel!);
    plugins.forEach(async (plugin, index) => {
      await axios.get(plugin.url).then((res) => {
        const func = new Function(res.data) as any;

        //set plugin to window
        func();

        const attributes = //@ts-ignore
          (window[plugin.libraryName] as any).getAttributes() as any;

          console.log(plugin.libraryName)

        if (typeof attributes.service !== "undefined") {
          if (typeof attributes.service.provider !== "undefined") {
        
            attributes.service.contextApi.displayName = plugin.libraryName;
            if (
              contexts.current.find(
                (x) => x.displayName === plugin.libraryName
              )
            ) {
              return;
            }

            contexts.current.push(attributes.service.contextApi);
            providers.current.push(attributes.service.provider);
          }
        }

        if (index === plugins.length - 1) {
          setPluginUploading(false);
        }
      });
    });
  };

  useEffect(() => {
    getAllPlugins();
  }, []);

  const getContextApi = (servicesName: string) => {
    var data = contexts.current.find((x) => x.displayName === servicesName);

    if (typeof data === "undefined") {
      return null;
    }

    return data;
  };

  let value = {
    getContextApi,
  };

  return pluginUploading ? (
    <Spin tip="Plugins Uploading" />
  ) : (
    <DynamicContext.Provider value={value}>
      {providers.current.length > 0
        ? providers.current.map((Provider, index) => {
            return (
              <Provider value={{}} key={index}>
                {children}
              </Provider>
            );
          })
        : children}
    </DynamicContext.Provider>
  );
}

const useDynamic = (): DynamicContextType => {
  return useContext(DynamicContext);
};

export { useDynamic, DynamicProvider };
