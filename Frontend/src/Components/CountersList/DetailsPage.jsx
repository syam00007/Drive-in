import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Container,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DetailsPage = ({ profiles }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const profileFromState = location.state?.profile;
  const profileFromProps =
    profiles?.find((profile) => profile.id.toString() === id);
  const profile = profileFromState || profileFromProps;

  const baseImageUrl = "http://localhost:9098/uploads/";
  const imageUrl = profile?.imageUrl
    ? profile.imageUrl
    : profile?.image
    ? `${baseImageUrl}${profile.image}`
    : null;

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Go Back
        </Button>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Profile Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The profile you're looking for does not exist. Please return and try
            again.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: "absolute",
          top: 20, // vertical offset
          left: 20, // horizontal offset
          zIndex: 1000,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4}>
            {imageUrl && (
              <Grid item xs={12} md={5}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt={profile.counterName}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: 400,
                    objectFit: "cover",
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h1" gutterBottom>
                {profile.counterName}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Owner:</strong> {profile.owner}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Mobile:</strong> {profile.mobileNumber}
                </Typography>
                <Typography variant="body1"sx={{ mb: 1 }}>
                  <strong>Email:</strong> {profile.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {profile.status}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default DetailsPage;
