import {
  IJsonBorderNode,
  IJsonModel,
  IJsonRowNode,
  IJsonTabNode,
  IJsonTabSetNode,
} from "flexlayout-react";
import { IPluginUIModel } from "../models/plugin";

export const getPluginsFromLayout = (layout: IJsonModel) => {
  var borders = layout.borders;
  var layouts = layout.layout;

  if (!layout) return [];

  const plugins: IPluginUIModel[] = [];

  borders?.forEach((border) => {
    if (border.children.length > 0) {

      border.children.forEach((tabset) => {
        if (tabset.component === "plugin") {
          plugins.push(tabset.config);
        }
      });
    }
  });

  layouts.children.forEach((row) => {
    row.children.forEach((tabset) => {
      //@ts-ignore
      if (tabset.component === "plugin") {
         //@ts-ignore
        plugins.push(tabset.config as IPluginUIModel);
      }
    });
  });

  return plugins;
};
