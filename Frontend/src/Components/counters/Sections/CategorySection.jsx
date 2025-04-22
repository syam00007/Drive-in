// CategorySection.jsx
import React from "react";
import { Box, Typography, IconButton, Button, Chip } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Box)(({ theme }) => ({
  border: "1px solid #eee",
  borderRadius: 4,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
}));

const combinedStyle = {
  fontFamily: "Bebas Neue, sans-serif",
  color: "#FE840E",
  backgroundColor: "transparent",
};

const CategorySection = ({
  categories = [],
  items = [],
  editMode,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  onAddCategory,
  onItemClick,
  onEditItem,
  onDeleteItem,
  onAddItem,
}) => {
  return (
    <Box sx={{ backgroundColor: "transparent" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h2" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
          <span style={{ color: "#FE840E" }}>FOOD</span>{" "}
          <span style={{ color: "#ffffff" }}>MENU</span>
        </Typography>
        {editMode && (
          <div>
        <Button
            variant="contained"
            size="small"
            onClick={onAddCategory}
            sx={{
              background: "#FE840E",
              '&:hover': {
                backgroundColor: "#FF9C33",
                transform: "scale(1.02)",
              },
            }}
          >
            <strong>Add Category</strong>
          </Button>
          </div>
        )}
      </Box>
      <AnimatePresence>
        {categories.map((category) => {
          // Filter items belonging to this category
          const catItems = items.filter((item) => item.category?.id === category.id);
          return (
            <motion.div key={category.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <StyledCard style={{ backgroundColor: "transparent", color: "#ffffff", border: "transparent" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "2px solid #e47301",
                    width: "58%",
                  }}
                  style={combinedStyle}
                >
                  <Typography
                    variant="h6"
                    onClick={() => !editMode && onSelectCategory && onSelectCategory(category)}
                    sx={{ cursor: !editMode ? "pointer" : "default" }}
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: "35px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {category.name} <span style={{ color: "#ffffff" }}>MENU</span>
                  </Typography>
                  {editMode && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton onClick={() => onAddItem && onAddItem(category)}>
                        <Add fontSize="small" style={{ color: "#ffffff" }} />
                      </IconButton>
                      <IconButton onClick={() => onEditCategory && onEditCategory(category)}>
                        <Edit fontSize="small" style={{ color: "#ffffff" }} />
                      </IconButton>
                      <IconButton onClick={() => onDeleteCategory && onDeleteCategory(category.id)}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Box sx={{ mt: 1 }}>
                  {catItems.length > 0 ? (
                    catItems.map((item, index) => (
                      <Box
                        key={item.id}
                        sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap", py: 0.2, cursor: !editMode ? "pointer" : "default" }}
                        onClick={!editMode ? () => onItemClick && onItemClick(item) : undefined}
                        style={{ fontFamily: "Bebas Neue, sans-serif" }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="body1"
                            style={{
                              fontFamily: "Bebas Neue, sans-serif",
                              fontSize: "20px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {index + 1}. {item.name}
                          </Typography>
                        </Box>
                        <Box sx={{ minWidth: 90, textAlign: "right", display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body1"
                            style={{
                              fontFamily: "Bebas Neue, sans-serif",
                              fontSize: "20px",
                              color: "#FE840E",
                              whiteSpace: "nowrap",
                            }}
                          >
                            -${item.price}
                          </Typography>
                        </Box>
                        <Box sx={{ minWidth: 500, display: "flex", textAlign: "left" }}>
                          <Typography
                            variant="body1"
                            style={{
                              fontFamily: "Bebas Neue, sans-serif",
                              fontSize: "20px",
                              whiteSpace: "nowrap",
                              marginLeft: "16px",
                            }}
                          >
                            <Chip label={item.status} color={item.status === "Available" ? "success" : "error"} size="small" />
                          </Typography>
                          {editMode && (
                            <Box sx={{ display: "flex", ml: 1 }}>
                              <IconButton onClick={() => onEditItem && onEditItem(item)}>
                                <Edit fontSize="small" style={{ color: "#ffffff" }} />
                              </IconButton>
                              <IconButton onClick={() => onDeleteItem && onDeleteItem(item.id)}>
                                <Delete fontSize="small" color="error" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="#ffffff">
                      No items available.
                    </Typography>
                  )}
                </Box>
              </StyledCard>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Box>
  );
};

export default CategorySection;
