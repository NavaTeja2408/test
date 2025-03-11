import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  OverlayView,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = { lat: 37.769299, lng: -122.486263 }; // Example: San Francisco
const latGridSize = 0.00006; // Smaller spacing for latitude
const lngGridSize = 0.00003; // Larger spacing for longitude

const rotationAngle = 20; // Rotate left by 20 degrees
const angleRad = (rotationAngle * Math.PI) / 180; // Convert to radians

// Function to rotate a point around the center
const rotatePoint = (lat, lng) => {
  const x = lng - center.lng;
  const y = lat - center.lat;

  const xRotated = x * Math.cos(angleRad) - y * Math.sin(angleRad);
  const yRotated = x * Math.sin(angleRad) + y * Math.cos(angleRad);

  return {
    lat: center.lat + yRotated,
    lng: center.lng + xRotated,
  };
};

const generateGrid = (center) => {
  const grid = [];
  const rows = 6;
  const cols = 10;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let lat = center.lat + i * latGridSize;
      let lng = center.lng + j * lngGridSize;

      // Apply rotation to each corner
      let p1 = rotatePoint(lat, lng);
      let p2 = rotatePoint(lat + latGridSize, lng);
      let p3 = rotatePoint(lat + latGridSize, lng + lngGridSize);
      let p4 = rotatePoint(lat, lng + lngGridSize);

      let value = Math.floor(Math.random() * 100) + 1;

      grid.push({
        paths: [p1, p2, p3, p4],
        value,
        loc: { lat: lat, lng: lng },
        center: rotatePoint(lat + latGridSize / 2, lng + lngGridSize / 2), // Center for text
      });
    }
  }
  return grid;
};

const Maps = () => {
  const gridCells = generateGrid({ lat: 37.769006, lng: -122.486801 });
  const gridCells2 = generateGrid({ lat: 37.769231, lng: -122.485973 });
  const [Mapcenter, setMapCenter] = useState(center);
  const [selectedCell, setSelectedCell] = useState(null);
  const [popUp, setPopUp] = useState(null);
  const [zoom, setZoom] = useState(20);

  return (
    <div>
      {popUp !== null && (
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "100px",
            top: "40%",
            left: "40%",
            transform: "translate(-40%, -40%)",
            backgroundColor: "white",
            color: "black",
            zIndex: 5000,
            paddingBottom: "30px",
            paddingTop: "20px",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "left",
          }}
        >
          <button
            onClick={() => {
              setMapCenter(center);
              setZoom(20);
              setPopUp(null);
            }}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            X
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ margin: "0", fontSize: "14px" }}>Slot Name:</h3>
            <p
              style={{
                marginTop: "15px",
                margin: "0",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Example {JSON.stringify(popUp)}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: "0", fontSize: "14px" }}>Longitude:</h3>
            <p style={{ margin: "0", fontSize: "14px" }}>
              {JSON.stringify(Mapcenter.lng)}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: "0", fontSize: "14px" }}>Latitude:</h3>
            <p style={{ margin: "0", fontSize: "14px" }}>
              {JSON.stringify(Mapcenter.lat)}
            </p>
          </div>
        </div>
      )}
      <LoadScript googleMapsApiKey="AIzaSyCUufoXopiUE0xu2NNs24YKyzMkowDeL9c">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={Mapcenter}
          options={{
            mapTypeId: "satellite",
            mapTypeControl: false, // Remove map type control
            disableDefaultUI: true, // Remove all UI controls
            gestureHandling: "none", // Disable mouse and touch interactions
            zoomControl: false, // Disable zooming
            draggable: false, // Disable dragging
            scrollwheel: false, // Disable scroll zoom
            disableDoubleClickZoom: true, // Disable double click zoom
          }}
          zoom={zoom}
        >
          {gridCells.map((cell, index) => (
            <React.Fragment key={index}>
              <Polygon
                onClick={() => {
                  setPopUp(index);
                  setSelectedCell(cell); // Set the selected cell
                  setMapCenter(cell.loc);
                  setZoom(22);
                }}
                paths={cell.paths}
                options={{
                  fillColor:
                    index === popUp
                      ? "rgba(255, 0, 0, 0.6)"
                      : "rgba(0, 0, 255, 0.6)",
                  fillOpacity: 0.5,
                  strokeColor: "#000",
                  strokeWeight: 1,
                }}
              />

              {/* Display index in the center of the cell */}
              <OverlayView
                position={cell.center}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex", // ✅ Enables Flexbox
                    alignItems: "center", // ✅ Centers items vertically
                    justifyContent: "center", // ✅ Centers items horizontally
                    textAlign: "center",
                  }}
                >
                  {index}
                </div>
              </OverlayView>
            </React.Fragment>
          ))}
          {gridCells2.map((cell, index) => (
            <React.Fragment key={index}>
              <Polygon
                onClick={() => {
                  setPopUp(index);
                  setSelectedCell(cell); // Set the selected cell
                  setMapCenter(cell.loc);
                  setZoom(22);
                }}
                paths={cell.paths}
                options={{
                  fillColor:
                    index === popUp
                      ? "rgba(255, 0, 0, 0.6)"
                      : "rgba(0, 0, 255, 0.6)",
                  fillOpacity: 0.5,
                  strokeColor: "#000",
                  strokeWeight: 1,
                }}
              />

              {/* Display index in the center of the cell */}
              <OverlayView
                position={cell.center}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex", // ✅ Enables Flexbox
                    alignItems: "center", // ✅ Centers items vertically
                    justifyContent: "center", // ✅ Centers items horizontally
                    textAlign: "center",
                  }}
                >
                  {index}
                </div>
              </OverlayView>
            </React.Fragment>
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Maps;
