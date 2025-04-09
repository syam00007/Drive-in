// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home1 from "./Home1";
import Home from "./Components/Home";
import CounterPage from "./Components/counters/CounterPage"; // New counter page with full functionality
import CPList from "./Components/CountersList/CPList";
import Settings from "./Components/settings/Settings";
import Counteravailability from "./Components/counteravailability/counteravailability";
import DetailsPage from "./Components/CountersList/DetailsPage";
import Footer from "./Footer";
import Main from "./Components/Mainpaje";
import { SnackbarProvider } from "notistack";
import Logout from "./Components/Logout";

function App({ profiles }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div>
        <Routes>
          <Route path="/" element={<Home1 />} />
          <Route path="/admin" element={<Home />}>
            <Route index element={<Main />} />
            {/* Updated route for counters with all required features */}
            <Route path="counters" element={<CounterPage />} />
            <Route path="counterprofiles" element={<CPList />} />
            <Route
              path="counteravailability"
              element={<Counteravailability />}
            />
            <Route path="settings" element={<Settings />} />
            <Route
              path="details/:id"
              element={<DetailsPage profiles={profiles} />}
            />
          </Route>
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </div>
    </SnackbarProvider>
  );
}

export default App;
