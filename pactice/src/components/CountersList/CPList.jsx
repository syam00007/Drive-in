import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Button, Dialog } from "@mui/material";
import axios from "axios";
import CPCard from "./CPCard";
import CPForm from "./CPForm";

const API_BASE_URL = "http://localhost:9096/api/cp";

const CPList = () => {
  const [profiles, setProfiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleOpenDialog = (profile = null) => {
    setSelectedProfile(profile);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProfile(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      setProfiles(profiles.filter((profile) => profile.id !== id));
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  const onSuccess = () => {
    fetchProfiles();
    handleCloseDialog();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" style={{color:"DodgerBlue"}}><strong>List of counter profiles: </strong></Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Counter
        </Button>
      </Box>

      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <CPCard 
              profile={profile} 
              onEdit={handleOpenDialog} 
              onDelete={handleDelete} 
            />
          </Grid>
        ))}
        {profiles.length === 0 && (
          <Typography variant="h6" align="center" sx={{ width: "100%", mt: 2 }}>
            No counter profiles available.
          </Typography>
        )}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: "15px",
            p: 0,
            width: "500px",
          }
        }}
      >
        <CPForm 
          profile={selectedProfile} 
          onSuccess={onSuccess} 
          onCancel={handleCloseDialog} 
        />
      </Dialog>
    </Container>
  );
};

export default CPList;
