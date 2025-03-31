// src/components/CPForm.js
import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";

const API_BASE_URL = "http://localhost:9096/api/cp";

const CPForm = ({ profile, onSuccess, onCancel }) => {
  const isEdit = Boolean(profile);
  const { enqueueSnackbar } = useSnackbar();
  const [owner, setOwner] = useState(profile?.owner || "");
  const [mobileNumber, setMobileNumber] = useState(profile?.mobileNumber || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [counterName, setCounterName] = useState(profile?.counterName || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({ mobile: "", email: "", image: "" });

  useEffect(() => {
    if (profile) {
      setOwner(profile.owner);
      setMobileNumber(profile.mobileNumber);
      setEmail(profile.email);
      setCounterName(profile.counterName);
    }
  }, [profile]);

  const validateMobile = (value) => {
    if (!/^[6-9]\d{9}$/.test(value)) {
      return "Mobile number must start with 6, 7, 8, or 9 and be exactly 10 digits.";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return "Please enter a valid email.";
    }
    return "";
  };

  // For adding a new profile, an image is required.
  const validateImage = () => {
    if (!isEdit && !selectedImage) {
      return "Image is required.";
    }
    return "";
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
    }
    setErrors((prev) => ({ ...prev, mobile: validateMobile(value) }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      mobile: validateMobile(mobileNumber),
      email: validateEmail(email),
      image: validateImage(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("owner", owner);
    formData.append("mobileNumber", mobileNumber);
    formData.append("email", email);
    formData.append("counterName", counterName);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/update/${profile.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_BASE_URL}/save`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      // Determine the message based on the form type (edit or add)
      const message = isEdit
        ? "Counter profile updated successfully!"
        : "Counter profile added successfully!";
      enqueueSnackbar(message, {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      
      onSuccess();
    } catch (error) {
      alert("Submission failed. Please try again.");
      console.error("Error in submission:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {isEdit ? "Edit Counter Profile" : "Add Counter Profile"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Mobile Number"
            value={mobileNumber}
            onChange={handleMobileChange}
            required
            error={!!errors.mobile}
            helperText={errors.mobile}
            inputProps={{ maxLength: 10 }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={handleEmailChange}
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Counter Name"
            value={counterName}
            onChange={(e) => setCounterName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Typography
            variant="caption"
            display="block"
            mt={1}
            sx={{ color: errors.image ? "error.main" : "inherit" }}
          >
            {selectedImage ? `Selected: ${selectedImage.name}` : errors.image}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="outlined" sx={{ mr: 1 }} onClick={onCancel}>
            CANCEL
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? "UPDATE" : "SUBMIT"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CPForm;
