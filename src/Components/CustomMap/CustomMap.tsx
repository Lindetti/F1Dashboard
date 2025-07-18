import React, { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Map, LatLngBounds, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface IconDefault extends Icon.Default {
  _getIconUrl?: string;
}
delete (Icon.Default.prototype as IconDefault)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface CustomMapProps {
  lat: number;
  long: number;
  zoom: number;
  raceName: string;
}

const CustomMap: React.FC<CustomMapProps> = ({ lat, long, zoom, raceName }) => {
  const position: LatLngExpression = [lat, long];

  const mapRef = useRef<Map | null>(null);

  const raceCoordinates = useMemo(() => {
    return [
      [lat, long] as [number, number],
      [lat + 0.05, long + 0.05] as [number, number],
    ];
  }, [lat, long]);

  useEffect(() => {
    if (mapRef.current && raceCoordinates.length > 0) {
      const bounds = new LatLngBounds(raceCoordinates);

      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
      });
    }
  }, [raceCoordinates]);

  return (
    <div style={{ height: "100%" }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ width: "100%", height: "100%", borderRadius: "10px" }}
        minZoom={zoom}
        maxZoom={16}
        ref={mapRef}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={position}>
          <Popup>
            <h3>{raceName}</h3>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default CustomMap;
