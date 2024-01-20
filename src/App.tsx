import Maper from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector';
import "ol/ol.css";
// import Map from 'ol/Map';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useGeographic } from 'ol/proj';

function App() {
  const data = [
    'https://raw.githubusercontent.com/yusufsyaifudin/wilayah-indonesia/master/data/geojson/province/65.geojson',
    'https://raw.githubusercontent.com/yusufsyaifudin/wilayah-indonesia/master/data/geojson/province/74.geojson'
  ]
  const [region, setRegion] = useState(data[1]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useGeographic()
  
  useEffect(() => {
    const source = new VectorSource({
      url: region,
      format: new GeoJSON(),
    });
    
    const vectorLayer = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(251, 146, 60, 0.2)',
        'stroke-width': 1,
        'stroke-color': '#fb923c',
        'circle-radius': 5,
        'circle-fill-color': 'rgba(255, 255, 255, 0.6)',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#319FD3',
      },
    });
    

    const place = [117, -2];
    new View({
      center: place,
      zoom: 6,
    });

    // Check if the map is already initialized
    if (!mapRef.current) {
      const place = [117, -2];
      const view = new View({
        center: place,
        zoom: 6,
      });

      const map = new Maper({
        layers: [
          new TileLayer({
            source: new OSM({
              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
            }),
          }),
          vectorLayer,
        ],
        target: 'map',
        view: view,
      });

      // Save the map instance to the ref
      mapRef.current = map;
    } else {
      // If the map is already initialized, just add the new vector layer
      mapRef.current.getLayers().item(1).setSource(source);
    }


    return () => {
      console.log('unmount')
    }
    
  }, [region])

 
  return (
    <>
      <div className="map" id="map"></div>
      <div className="card">
        <div className="radio">
          <input onChange={() => {
            setRegion(data[0])
          }} type="radio" name="filter" id="filter" />
          <span>Wilayah Satu</span>
        </div>
        <div className="radio">
          <input defaultChecked onChange={() => {
            setRegion(data[1])
          }} type="radio" name="filter" id="filter" />
          <span>Wilayah Dua</span>
        </div>
      </div>
    </>
  )
}

export default App
