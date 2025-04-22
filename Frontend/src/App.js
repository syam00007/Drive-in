// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home1 from "./Components/HomePage/Home1";
import Home from "./Components/HomePage/Home";
import CounterPage from "./Components/counters/CounterPage"; // New counter page with full functionality
import CPList from "./Components/CountersList/CPList";
import Settings from "./Components/settings/Settings";
import Counteravailability from "./Components/counteravailability/counteravailability";
import DetailsPage from "./Components/CountersList/DetailsPage";
import Footer from "./Components/HomePage/Footer";
import Main from "./Components/HomePage/Mainpaje";
import { SnackbarProvider } from "notistack";
import Logout from "./Components/Logout/Logout";

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
            <Route path="counters/:counterId" element={<CounterPage />} />
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
