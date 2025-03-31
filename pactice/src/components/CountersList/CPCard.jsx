// CPCard.jsx
import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";

const CPCard = ({ profile, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const baseImageUrl = "http://localhost:9096/uploads/";
  const imageUrl = profile.imageUrl
    ? profile.imageUrl
    : profile.image
    ? `${baseImageUrl}${profile.image}`
    : null;

  const handleSettingsClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  const handleEdit = () => {
    onEdit(profile);
    handleClose();
  };
  const handleDelete = () => {
    onDelete(profile.id);
    handleClose();
  };

  const handleImageClick = () => {
    navigate(`/details/${profile.id}`, { state: { profile } });
  };

  return (
    <Card sx={{ position: "relative", cursor: "pointer" }}>
      {imageUrl ? (
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Profile Image"
          height="200"
          onClick={handleImageClick}
        />
      ) : (
        <Box
          sx={{ height: 200, backgroundColor: "gray" }}
          onClick={handleImageClick}
        />
      )}
      <IconButton
        onClick={handleSettingsClick}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.27)",
            "& svg": { color: "white" },
          },
        }}
      >
        <SettingsIcon sx={{ color: "white" }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <Box
        onClick={handleImageClick}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: "rgba(1, 1, 2, 0.67)",
          color: "white",
          px: 1,
          py: 0.5,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {profile.counterName}
        </Typography>
      </Box>
    </Card>
  );
};

export default CPCard;
