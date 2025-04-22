import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
} from "@mui/material";
import { Edit, Delete, Settings } from "@mui/icons-material";
import { motion } from "framer-motion";

// ------------------ ItemSection Component ------------------
const ItemSection = ({
  items = [],
  editMode, // Controlled by the parent
  onItemClick,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onToggleEditMode, // Callback to toggle edit mode from within this component
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          style={{
            color: "#ffffff",
            fontFamily: "Bebas Neue, sans-serif",
          }}
        >
          Items
        </Typography>
        {editMode ? (
          <Button variant="contained"
          size="small"
           onClick={() => onAddItem()}
           sx={{
            background: "#FE840E",
            '&:hover': {
              backgroundColor: "#FF9C33",
              transform: "scale(1.02)",
            },
          }}
          >
            Add Item
          </Button>
        ) : (
          // When not in edit mode, display the settings icon
          <IconButton onClick={onToggleEditMode} sx={{ color: "#ffffff" }}>
            <Settings />
          </IconButton>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              {editMode && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{ cursor: !editMode ? "pointer" : "default" }}
                onClick={
                  !editMode
                    ? () => onItemClick && onItemClick(item)
                    : undefined
                }
                component={motion.tr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                {editMode && (
                  <TableCell align="right">
                    <IconButton onClick={() => onEditItem && onEditItem(item)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteItem && onDeleteItem(item.id)}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={editMode ? 4 : 3}>
                  <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                  >
                    No items found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// ------------------ ItemDetailModal Component ------------------
export const ItemDetailModal = ({ open, item, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>{item?.name}</DialogTitle>
      <DialogContent dividers>
        {item && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                <strong>Price:</strong> ${item.price}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Quantity:</strong> {item.quantity}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Status:</strong>{" "}
                <Chip
                  label={item.status}
                  color={item.status === "Available" ? "success" : "error"}
                  size="small"
                />
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {item.description || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Category:</strong> {item.category?.name}
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemSection;
