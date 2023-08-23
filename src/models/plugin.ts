export interface IPluginUIModel {
    id: number;
    url: string;
    name: string;
    description: string;
    libraryName: string;
}

export enum PluginStatus {
    Ok = "Ok",
    Waiting = "Waiting",
    Error = "Error",
  }