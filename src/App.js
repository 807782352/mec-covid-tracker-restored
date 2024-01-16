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
  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Map />} />
              <Route path="/map" element={<Map />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
