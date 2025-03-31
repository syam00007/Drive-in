import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { extendTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import StoreIcon from "@mui/icons-material/Store";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Psn from "./images/psnlogo2.png";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Updated NAVIGATION array
const NAVIGATION = [
  {
    kind: "header",
    title: "Menu",
  },
  {
    segment: "counters",
    title: "Counters",
    icon: <RestaurantIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
        to: "/sales",
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
        to: "/traffic",
      },
    ],
  },
  {
    segment: "counterprofiles",
    title: "Counter Profiles",
    icon: <StoreIcon />,
    to: "/counterprofiles",
  },
  {
    segment: "counteravailability",
    title: "Counter Availability",
    icon: <RestaurantMenuIcon />,
    to: "/counteravailability",
  },
  {
    segment: "settings",
    title: "Settings",
    icon: <SettingsIcon />,
    to: "/settings",
  },
  {
    segment: "logout",
    title: "Logout",
    icon: <LogoutIcon />,
    to: "/logout",
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function DashboardLayoutBasic() {
  const location = useLocation();
  const navigate = useNavigate();

  const router = React.useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate,
    }),
    [location, navigate]
  );

  // ==== Login / Session Logic ====
  // Initially, no user is logged in.
  const [session, setSession] = React.useState(null);
  // Control whether to show the login dialog.
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  // Login form state with empty default values.
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  // Control password visibility.
  const [showPassword, setShowPassword] = React.useState(false);

  // Opens the sign in dialog.
  const handleOpenLogin = () => {
    setShowLoginDialog(true);
  };

  // Validate the credentials entered in the dialog.
  const handleSignIn = () => {
    if (username === "admin" && password === "admin") {
      setSession({
        user: {
          name: "Syam User",
          email: "syam@gmail.com",
          image: "https://placekitten.com/200/200",
        },
      });
      setError("");
      setShowLoginDialog(false);
    } else {
      setError("Invalid username or password!");
    }
  };

  const authentication = React.useMemo(() => {
    return {
      signIn: handleOpenLogin,
      signOut: () => setSession(null),
    };
  }, []);


  function ToolbarActions() {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {session ? (
          <Button variant="contained" color="secondary" onClick={authentication.signOut}>
            Logout
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={authentication.signIn}>
            Sign In
          </Button>
        )}
      </Box>
    );
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      session={session}
      authentication={authentication}
      branding={{
        logo: <img src={Psn} alt="Logo" />,
        title: "The Place Drive In",
        homeUrl: "/",
        toolbar: <ToolbarActions />,
      }}
      theme={demoTheme}
    >
      <DashboardLayout headerProps={{ title: "" }}>
        <div style={{ fontFamily: "Sans-Serif" }}>
          <Outlet />
        </div>
      </DashboardLayout>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)}>Cancel</Button>
          <Button onClick={handleSignIn} variant="contained" color="primary">
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </AppProvider>
  );
}
