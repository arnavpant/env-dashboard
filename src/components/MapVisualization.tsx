import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  latitude: number;
  longitude: number;
}

const MapVisualization: React.FC<Props> = ({ latitude, longitude }) => (
  <MapContainer center={[latitude, longitude]} zoom={10} style={{ height: '350px', width: '100%' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[latitude, longitude]}>
      <Popup>Current Location</Popup>
    </Marker>
  </MapContainer>
);

export default MapVisualization;
