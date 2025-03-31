// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CPList from "./components/CountersList/CPList";
import Home from "./components/Home";
import Main from "./components/Mainpaje";
import Settings from "./components/settings/Settings";
import Counteravailability from "./components/counteravailability/counteravailability";
import Counters from "./components/counters/counters";
import DetailsPage from "./components/CountersList/DetailsPage";
import { SnackbarProvider } from "notistack";
import Syam from "./components/syam/syam";

function App({ profiles }) {
  return (
    <SnackbarProvider 
      maxSnack={3} 
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Main />} />
            <Route path="counters" element={<Counters />} />
            <Route path="counterprofiles" element={<CPList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="counteravailability" element={<Counteravailability />} />
            <Route path="details/:id" element={<DetailsPage profiles={profiles} />} />

            <Route path="/syam" element={<Syam />} />

          </Route>
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
