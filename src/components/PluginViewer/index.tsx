import { Spin } from "antd";
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authProvider";
import { IPluginUIModel } from "../../models/plugin";
import { useDynamic } from "../../context/dynamicProviders";

const PluginViewer: React.FC<IPluginUIModel> = (plugin: IPluginUIModel) => {
  const [Component, setComponent] = useState<any>(null);
  const { getContextApi } = useDynamic();

  useEffect(() => {
    //@ts-ignore
    var creator = window[plugin.libraryName!] as any;
    //@ts-ignore
    if (creator && creator.default) {
      setComponent(creator);
    }
  }, []);

  const Plugin = React.lazy(() => {
    return Component ? Promise.resolve(Component) : Promise.resolve(() => {});
  });

  return (
    <React.Suspense fallback={<Spin tip="Plugin Uploading..." />}>
      {Component ? (
        <Plugin useAuth={useAuth} getContextApi={getContextApi} />
      ) : (
        <Spin tip="Plugin Uploading..." />
      )}
    </React.Suspense>
  );
};

export default React.memo(PluginViewer, (prev, next) => {
  return prev.libraryName === next.libraryName;
});
