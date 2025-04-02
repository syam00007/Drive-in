// Main.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Counters from "./counters/counters";
import CPList from "./CountersList/CPList";
import Settings from "./settings/Settings";
import Counteravailability from "./counteravailability/counteravailability";
import DetailsPage from "./CountersList/DetailsPage";
import Footer from "../Footer";
import { Logout } from "@mui/icons-material";

const Main = ({ profiles }) => {
  return (
    <div>
      <Routes>
        {/* The Home container should include an Outlet for nested routes */}
        <Route path="/" element={<Home />}>
          <Route path="counters" element={<Counters />} />
          <Route path="admin/counterprofiles" element={<CPList />} />
          <Route path="counteravailability" element={<Counteravailability />} />
          <Route path="settings" element={<Settings />} />
          <Route path="details/:id" element={<DetailsPage profiles={profiles} />} />
        </Route>
        {/* For demonstration, a route with a logout icon. 
            Replace with an actual Logout component if needed. */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Main;
