import React, { FC, useCallback } from "react";
import {
  IJsonModel,
  IJsonRowNode,
  IJsonTabNode,
  IJsonTabSetNode,
  Model,
  TabNode,
} from "flexlayout-react";
import * as FlexLayout from "flexlayout-react";
import PluginViewer from "../../components/PluginViewer";
import { IPluginUIModel } from "../../models/plugin";

interface ILayoutProps {}

const ShowLayout: FC<ILayoutProps> = () => {
  let model = JSON.parse(
    localStorage.getItem("layout") as string
  ) as IJsonModel | null;

  if (model === null) {
    model = {
      global: {
        borderMinSize: 100,
        tabEnableFloat: true,
        tabSetMinWidth: 100,
        tabSetMinHeight: 100,
        tabSetEnableMaximize: false,
      },
      layout: {
        id: "#edd84c97-a41a-433c-8f26-1007dbdccc15",
        type: "row",
        children: [],
      },
      borders: [],
    } as IJsonModel;
  } else {
    model.global = {
      splitterSize: 0,
    };

    model.borders?.forEach((x: FlexLayout.IJsonBorderNode) => {
      if (x.children.length === 0) {
        x.barSize = 0.1;
      }
      x.children.forEach((element: any) => {
        element.enableClose = false;
        element.enableDrag = false;
        element.enableFloat = false;
        element.enableRename = false;
      });
    });

    const recursive = (node: IJsonRowNode | IJsonTabSetNode) => {
      if (node.type === "tabset") {
        node.enableMaximize = false;
        node.children.forEach((tab: IJsonTabNode) => {
          tab.enableClose = false;
          tab.enableRename = false;
          tab.enableFloat = false;
          tab.enableDrag = false;
        });
        if (node.children.length === 1) {
          node.tabStripHeight = 0.1;
          node.headerHeight = 0.1;
        }
      } else if (node.type === "row") {
        node.children.forEach((element: any) => {
          recursive(element);
        });
      }
    };

    model.layout.children.forEach((x: IJsonRowNode | IJsonTabSetNode) => {
      recursive(x);
    });
  }

  const factory = useCallback((node: TabNode): any => {
    const config = node.getConfig() as IPluginUIModel;

    return <PluginViewer {...config} />;
  }, []);
  return (
    <FlexLayout.Layout
      // classNameMapper={(className: string) => {
      //   if (className === "flexlayout__layout") {
      //     return "flexlayout__layout flexlayout__layout--show";
      //   }
      //   return className;
      // }}
      model={Model.fromJson(model)}
      factory={factory}
      onAction={(e) => {
        return e;
      }}
    />
  );
};

export default ShowLayout;
