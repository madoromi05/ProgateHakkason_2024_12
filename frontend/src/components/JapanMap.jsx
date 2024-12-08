import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";

const JapanMap = () => {
  const [mapData, setMapData] = React.useState(null);

  React.useEffect(() => {
    fetch("/japan.topojson")
      .then(response => response.json())
      .then(data => {
        console.log("Loaded TopoJSON:", data); // データ構造を確認
        setMapData(data);
      })
      .catch(error => console.error("Error loading map:", error));
  }, []);

  if (!mapData) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: "400px", marginTop: "2rem" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1600,
          center: [137, 38]
        }}
      >
        <ZoomableGroup>
          <Geographies geography={mapData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                  style={{
                    default: {
                      fill: "#EAEAEC",
                      outline: "none"
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default JapanMap;