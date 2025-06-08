// src/components/MapView.jsx
import React, { useEffect, useState } from "react";

export default function MapView() {
  const [vehicleLocations, setVehicleLocations] = useState([]);
  const token = localStorage.getItem("authToken");

  // Fetch vehicle locations from the API on mount
  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch(
          `https://api.veyza.in/veyza-api/v0/get-live-location`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vehicle locations");
        }
        const data = await response.json();
        setVehicleLocations(data); // Expects an array of objects: { vehicleNumber, latitude, longitude, lastPacketReceivedAt }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }
    fetchLocations();
  }, [token]);

  // Initialize Google Map and add markers when vehicleLocations are available
  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API is not loaded");
      return;
    }
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) {
      console.error('Map container with id "map-container" not found.');
      return;
    }
    // Initialize the map centered on India
    const map = new window.google.maps.Map(mapContainer, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
    });

    vehicleLocations.forEach((location) => {
      // Parse latitude and longitude as numbers
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);
      if (isNaN(lat) || isNaN(lng)) {
        console.warn("Invalid coordinates for vehicle:", location);
        return; // Skip invalid data
      }

      // Create a marker with a truck icon
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: location.vehicleNumber,
        icon: {
          url: "https://img.icons8.com/fluency/48/000000/truck.png", // Replace with your truck icon URL if needed
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      // Convert lastPacketReceivedAt to a readable string
      const lastPacketTime = new Date(location.lastPacketReceivedAt).toLocaleString();

      // Create an InfoWindow for marker details
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div>
            <strong>Vehicle:</strong> ${location.vehicleNumber}<br>
            <strong>Latitude:</strong> ${lat}<br>
            <strong>Longitude:</strong> ${lng}<br>
            <strong>Timestamp:</strong> ${lastPacketTime}
          </div>
        `,
      });

      // On marker click, zoom and center the map, then open the InfoWindow
      marker.addListener("click", () => {
        map.setZoom(12); // Adjust zoom level as desired
        map.setCenter(marker.getPosition());
        infoWindow.open(map, marker);
      });
    });
  }, [vehicleLocations]);

  return <div id="map-container" style={{ height: "100vh", width: "100%" }}></div>;
}