import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer as LeafletMap,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "./Map.css";
import { timeFormater } from "../utils/utils";
import { CircleLoader } from "react-spinners";


export default function Map() {
  const initialMapCenter = [35, 105];
  const initialMapZoom = 3;
  const initialCategory = "cases";

  // List of all countries
  const [countryList, setCountryList] = useState([]);

  // Data from the whole countries in the world
  const [countriesData, setCountriesData] = useState([]);

  // Data from the specific country
  const [curCountry, setCurCountry] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(initialMapCenter);
  const [mapZoom, setMapZoom] = useState(initialMapZoom);

  const [category, setCategory] = useState(initialCategory);

  const handleChangeCategory = (c) => {
    setCategory(c);
  };

  useEffect(() => {
    const getWorldInfo = async () => {
      setIsLoading(true);
      try {
        await fetch("https://disease.sh/v3/covid-19/all")
          .then((res) => res.json())
          .then((data) => {
            setCurCountry(data);
          });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setIsLoading(false);
    };
    getWorldInfo();
  }, []);

  useEffect(() => {
    const getCountryList = async () => {
      try {
        setIsLoading(true);

        await fetch("https://disease.sh/v3/covid-19/countries")
          .then((res) => res.json())
          .then((data) => {
            setCountriesData(data);
            const results = data.map((countryItem) => ({
              id: countryItem.countryInfo._id,
              name: countryItem.country,
              flag: countryItem.countryInfo.flag,
            }));

            results.unshift({
              id: 0,
              name: "World",
              flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/1280px-Flag_of_the_United_Nations.svg.png",
            });
            setCountryList(results);
          });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setIsLoading(false);
    };
    getCountryList();
  }, []);

  const handleChangeCountry = async (event) => {
    const curCountry = event.target.value;
    if (curCountry === "World") {
      const getWorldInfo = async () => {
        setIsLoading(true);
        try {
          await fetch("https://disease.sh/v3/covid-19/all")
            .then((res) => res.json())
            .then((data) => {
              setCurCountry(data);
              setMapCenter(initialMapCenter);
              setMapZoom(initialMapZoom);
            });
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
        setIsLoading(false);
      };

      getWorldInfo();
    } else {
      try {
        setIsLoading(true);

        await fetch(`https://disease.sh/v3/covid-19/countries/${curCountry}`)
          .then((res) => res.json())
          .then((data) => {
            setCurCountry(data);
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);
          });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setIsLoading(false);
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  const casesTypeColors = {
    cases: {
      hex: "#029FDC",
      rgb: "rgb(2,159,220)",
      half_op: "rgba(2, 159, 220, 0.5)",
      highlight: "#FF6A1A",
    },
    recovered: {
      hex: "#73C43D",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      highlight: "#FF000C",
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      highlight: "#012345",
    },
  };

  return (
    <div className="container">
      <div className="basic-info">
        <div className="list">
          <FormControl className="app_header" sx={{ m: 2, width: 300 }}>
            <InputLabel id="select-country" size="string">
              Country / Region
            </InputLabel>
            <Select
              labelId="select-country"
              variant="filled"
              value={curCountry?.country || "World"}
              onChange={handleChangeCountry}
              input={<OutlinedInput label="Country / Region" />}
              MenuProps={MenuProps}
              autoWidth
            >
              {countryList.map((countryItem, index) => (
                <MenuItem key={index} value={countryItem.name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <img
                      src={countryItem.flag}
                      alt={countryItem.name}
                      style={{ height: "40px", width: "60px" }}
                    />
                    <span>{countryItem.name}</span>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {!isLoading && (
          <span className="time">
            Last Data Updated at: {timeFormater(curCountry.updated)}
          </span>
        )}
      </div>

      {isLoading ? (
        <CircleLoader color="#1976d2" className="loader" />
      ) : (
        <div className="display">
          <TableContainer component={Paper} className="table">
            <Table aria-label="world table">
              <TableHead sx={{ background: "#029fdc" }}>
                <TableRow>
                  <TableCell sx={{ fontSize: "16px", color: "#ffffff" }}>
                    Situation
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: "16px", color: "#ffffff" }}
                  >
                    Daily
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: "16px", color: "#ffffff" }}
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  key="cases"
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    background: "#F4F6F9",
                  }}
                >
                  <TableCell component="th" scope="row">
                    Cases
                  </TableCell>
                  <TableCell align="right">{curCountry.todayCases}</TableCell>
                  <TableCell align="right">{curCountry.cases}</TableCell>
                </TableRow>
                <TableRow
                  key="recovered"
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    background: "#DDE1E7",
                  }}
                >
                  <TableCell component="th" scope="row">
                    Recovered
                  </TableCell>
                  <TableCell align="right">
                    {curCountry.todayRecovered}
                  </TableCell>
                  <TableCell align="right">{curCountry.recovered}</TableCell>
                </TableRow>
                <TableRow
                  key="deaths"
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    background: "#F4F6F9",
                  }}
                >
                  <TableCell component="th" scope="row">
                    Deaths
                  </TableCell>
                  <TableCell align="right">{curCountry.todayDeaths}</TableCell>
                  <TableCell align="right">{curCountry.deaths}</TableCell>
                </TableRow>
                <TableRow
                  key="active"
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    background: "#DDE1E7",
                  }}
                >
                  <TableCell component="th" scope="row">
                    Active
                  </TableCell>
                  <TableCell align="right"> - </TableCell>
                  <TableCell align="right">{curCountry.active}</TableCell>
                </TableRow>
                <TableRow
                  key="population"
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    background: "#F4F6F9",
                  }}
                >
                  <TableCell component="th" scope="row">
                    Population
                  </TableCell>
                  <TableCell align="right"> - </TableCell>
                  <TableCell align="right">{curCountry.population}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className="map">
            <ButtonGroup
              variant="contained"
              orientation="vertical"
              aria-label="vertical  primary button group"
              sx={{
                position: "absolute",
                zIndex: 1000,
                right: "4rem",
                top: "2rem",
              }}
            >
              <Button onClick={() => handleChangeCategory("cases")}>
                Cases
              </Button>
              <Button onClick={() => handleChangeCategory("recovered")}>
                Recovered
              </Button>
              <Button onClick={() => handleChangeCategory("deaths")}>
                Deaths
              </Button>
            </ButtonGroup>

            <LeafletMap
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={false}
              className="leafMap"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {category === "cases" &&
                countriesData.map((item, index) => {
                  return (
                    <CircleMarker
                      center={[item.countryInfo.lat, item.countryInfo.long]}
                      weight={item.country === curCountry?.country ? 4 : 2}
                      radius={
                        (Math.log(item.casesPerOneMillion) / Math.log(5)) *
                        (mapZoom + 1)
                      }
                      color={
                        item.country === curCountry?.country
                          ? casesTypeColors[category].highlight
                          : casesTypeColors[category].hex
                      }
                      key={index}
                    >
                      <Popup>
                        Country / Region: {item.country} <br />
                        Daily Cases: {item.todayCases} <br />
                        Total Cases: {item.cases}
                      </Popup>
                    </CircleMarker>
                  );
                })}
              {category === "deaths" &&
                countriesData.map((item, index) => {
                  return (
                    <CircleMarker
                      center={[item.countryInfo.lat, item.countryInfo.long]}
                      weight={item.country === curCountry?.country ? 4 : 2}
                      radius={
                        (Math.log(item.deathsPerOneMillion) / Math.log(5)) *
                        (mapZoom + 1)
                      }
                      key={index}
                      color={
                        item.country === curCountry?.country
                          ? casesTypeColors[category].highlight
                          : casesTypeColors[category].hex
                      }
                    >
                      <Popup>
                        Country / Region: {item.country} <br />
                        Daily Deaths: {item.todayDeaths} <br />
                        Total Deaths: {item.deaths}
                      </Popup>
                    </CircleMarker>
                  );
                })}
              {category === "recovered" &&
                countriesData.map((item, index) => {
                  return (
                    <CircleMarker
                      center={[item.countryInfo.lat, item.countryInfo.long]}
                      weight={item.country === curCountry?.country ? 4 : 2}
                      radius={
                        (Math.log(item.recoveredPerOneMillion) / Math.log(5)) *
                        (mapZoom + 1)
                      }
                      key={index}
                      color={
                        item.country === curCountry?.country
                          ? casesTypeColors[category].highlight
                          : casesTypeColors[category].hex
                      }
                    >
                      <Popup>
                        Country / Region: {item.country} <br />
                        Daily Recovered: {item.todayRecovered} <br />
                        Total Recovered: {item.recovered}
                      </Popup>
                    </CircleMarker>
                  );
                })}

              <MapComponent />
            </LeafletMap>
          </div>
        </div>
      )}
    </div>
  );
}

function MapComponent() {
  const map = useMap();

  // 设置边界
  const bounds = [
    [-89.98155760646617, -180], // 左下角的纬度和经度
    [89.99346179538875, 180], // 右上角的纬度和经度
  ];

  // 应用边界限制
  map.setMaxBounds(bounds);

  return null;
}
