import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import { useDynamic } from "../../context/dynamicProviders";
import React from "react";

const Leaflet = () => {
  const position = [51.505, -0.09];

  const { getContextApi } = useDynamic();

  const { missionData, handleAddMissionData } = React.useContext(
    getContextApi("testPluginWithProvider")
  ) as  any;

  return (
    <>
    Local
    <MapContainer center={position as any} zoom={13} scrollWheelZoom={false} > 
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {missionData.map((item: any,index:number) => {
        return (
          <CircleMarker
            center={[position[0],position[1]+index*0.01]}
            pathOptions={{ color: "red" }}
            radius={20}
          >
            <Tooltip>{item}</Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
    </>
  );
};

export default Leaflet;
