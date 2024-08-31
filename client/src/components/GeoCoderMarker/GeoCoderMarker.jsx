// GeoCoderMarker.jsx
import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import * as ELG from 'esri-leaflet-geocoder';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const GeoCoderMarker = ({ address }) => {
  const map = useMap();
  const [position, setPosition] = useState([60, 19]);

  useEffect(() => {
    if (!map || !address) return; // Check if map is initialized and address is available

    ELG.geocode().text(address).run((err, results) => {
      if (err) {
        console.error("Geocode error:", err);
        return;
      }

      if (results?.results?.length > 0) {
        const { lat, lng } = results.results[0].latlng;
        setPosition([lat, lng]);

        if (map) {
          map.flyTo([lat, lng], 16); // Ensure map is available before calling flyTo
        }
      }
    });
  }, [address, map]);

  return (
    <Marker position={position} icon={DefaultIcon}>
      <Popup>{address}</Popup> {/* Display the address in the popup */}
    </Marker>
  );
};

export default GeoCoderMarker;