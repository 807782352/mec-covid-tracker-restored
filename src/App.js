import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppBar } from "@mui/material";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Map from "./components/Map";
import Login from "./components/Login";

function App() {
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    async function getData() {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const results = data.map((item) => ({
            name: item.country,
            value: item.countryInfo.iso2,
          }));
          setMapCountries(data);
        });
    }

    getData();
  }, []);

  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route
                exact
                path="/map"
                render={(props) => (
                  <Map
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                  />
                )}
              />
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
