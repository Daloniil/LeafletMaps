import React, { useState } from "react";
import {
  Circle,
  Popup,
  LayersControl,
  Polyline,
  Map,
  TileLayer,
  FeatureGroup,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw";

const Leaflet = () => {
  const [editableFG, setEditableFG] = useState(null);
  const [circle, setCircle] = useState([]);
  const [polygon, setPolygon] = useState([]);
  const [linePolygon, setLinePolygon] = useState([]);

  const color = ["blue", "lime", "purple", "red", "green"];

  const [allLayer, setAllLayer] = useState(["blue"]);
  const [selectLayer, setSelectLayer] = useState(allLayer.length - 1);

  const onCreated = (e) => {
    const drawnItems = editableFG.leafletElement._layers;

    Object.keys(drawnItems).forEach((layerid, index) => {
      if (index > 0) return;

      const layer = drawnItems[layerid];
      if (layer._latlng) {
        const cord = layer._latlng;
        setCircle((oldArray) => [
          ...oldArray,
          {
            id: selectLayer,
            cord: [cord.lat, cord.lng],
            radius: layer._mRadius,
          },
        ]);
        editableFG.leafletElement.removeLayer(layer);
      } else {
        if (layer._latlngs[0].lat) {
          const cord = layer._latlngs;
          const arrFigure = [];
          cord.forEach((cor) => arrFigure.push([cor.lat, cor.lng]));
          setLinePolygon((oldArray) => [
            ...oldArray,
            { id: selectLayer, cord: [arrFigure] },
          ]);
        } else {
          const cord = layer._latlngs[0];
          const arrFigure = [];
          cord.forEach((cor) => arrFigure.push([cor.lat, cor.lng]));
          setPolygon((oldArray) => [
            ...oldArray,
            { id: selectLayer, cord: [arrFigure] },
          ]);
        }
        editableFG.leafletElement.removeLayer(layer);
      }
    });
  };

  const onFeatureGroupReady = (reactFGref) => {
    setEditableFG(reactFGref);
  };

  return (
      <Map center={[37.8189, -122.4786]} zoom={13} style={{ height: "100vh" }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup
          ref={(featureGroupRef) => {
            onFeatureGroupReady(featureGroupRef);
          }}
        >
          <EditControl position="topright" onCreated={onCreated} />
        </FeatureGroup>
        <LayersControl position="bottomright">
          {allLayer.map((layer, index) => (
            <LayersControl.Overlay checked name={index + 1 + ". Layer"}>
              <FeatureGroup>
                <Popup>Popup in FeatureGroup</Popup>
                {circle.map((cen) =>
                  index == cen.id ? (
                    <Circle
                      color={layer}
                      center={cen.cord}
                      radius={cen.radius}
                    />
                  ) : (
                    ""
                  )
                )}
                {polygon.map((fig) =>
                  index == fig.id ? (
                    <Polygon color={layer} positions={fig.cord} />
                  ) : (
                    ""
                  )
                )}
                {linePolygon.map((fig) =>
                  index == fig.id ? (
                    <Polyline color={layer} positions={fig.cord} />
                  ) : (
                    ""
                  )
                )}
              </FeatureGroup>
            </LayersControl.Overlay>
          ))}
        </LayersControl>

     
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: "20px",
            padding: "10px",
            zIndex: 400,
          }}
        >
          {allLayer.map((slo, index) => (
            <p
              style={{cursor:'pointer',color:index===selectLayer?allLayer[selectLayer]:''}}
              onClick={() => {
                setSelectLayer(index);
              }}
            >
              {index + 1} Layer
            </p>
          ))}
          <button
          onClick={() => {
            setAllLayer((oldArray) => [...oldArray, color[allLayer.length]]);
            setSelectLayer(selectLayer + 1);
          }}
        >
          Add Layer
        </button>

        </div>
      </Map>

  );
};

export default Leaflet;
