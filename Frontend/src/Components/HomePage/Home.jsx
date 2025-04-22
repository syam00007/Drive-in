// Home.js
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { extendTheme } from "@mui/material/styles";
import { Settings } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import StoreIcon from "@mui/icons-material/Store";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Psn from "../Images/SYAMlogo2.png";

const API_BASE_URL = "http://localhost:9098/api/cp";

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "DodgerBlue !important",
            color: "#ffffff !important",
            "& .MuiListItemIcon-root": {
              color: "#ffffff !important",
            },
            "& .MuiSvgIcon-root": { // Target the icon directly
              color: "#ffffff !important",
            }
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgb(18, 111, 250) !important",
            "& .MuiSvgIcon-root": {
              color: "#ffffff !important",
            }
          },
      /*   "&:hover": {
            backgroundColor: "#e8f5e9",
            "& .MuiSvgIcon-root": {
              color: "#1976d2 !important", // Blue on hover
            }
          }, */
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#1976d2 !important", // Default blue color
          minWidth: "40px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          // color: "rgba(0, 0, 0, 0.8)",
          // Add selected state for text
          ".Mui-selected &": {
            color: "#ffffff !important",
          }
        },
      },
    },
  },
});

export default function DashboardLayoutBasic() {
  const [counters, setCounters] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const router = React.useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate,
      // Add match logic to determine active state
      match: (path) => location.pathname.startsWith(path),
    }),
    [location, navigate]
  );

  // Fetch counters from backend
  const fetchCounters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      const fetchedCounters = response.data.map((counter) => ({
        segment: `counters/${counter.id}`,
        title: counter.counterName,
        to: `/admin/counters/${counter.id}`,
      }));
      setCounters(fetchedCounters);
    } catch (error) {
      console.error("Failed to fetch counters:", error);
    }
  };

  useEffect(() => {
    fetchCounters();
    const intervalId = setInterval(() => {
      fetchCounters();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const NAVIGATION = [
    { kind: "header", title: "Menu" },
    {
      segment: "admin",
      title: "Counters",
      icon: <RestaurantIcon />,
      to: "/admin/counters",
      children: counters,
    },
    {
      segment: "admin/counterprofiles",
      title: "Counter Profiles",
      icon: <StoreIcon />,
      to: "/admin/counterprofiles",
    },
    {
      segment: "admin/counteravailability",
      title: "Counter Availability",
      icon: <RestaurantMenuIcon />,
      to: "/admin/counteravailability",
    },
    {
      segment: "admin/settings",
      title: "Settings",
      icon: <Settings />,
      to: "/admin/settings",
    },
    {
      segment: "logout",
      title: "Logout",
      icon: <LogoutIcon />,
      to: "/logout",
    },
  ];

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={{
        logo: <img src={Psn} alt="Logo" style={{ height: 40 }} />,
        title: "The Place Drive In",
        homeUrl: "/admin",
      }}
      theme={demoTheme}
    >
      <DashboardLayout headerProps={{ title: "" }}>
        <div style={{ fontFamily: "Sans-Serif" }}>
          <Outlet />
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}