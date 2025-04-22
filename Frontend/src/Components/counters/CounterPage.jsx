// CounterPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import bgImage from "../Images/bg2.jpg";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { ArrowBack, Settings } from "@mui/icons-material";
import CategorySection from "./Sections/CategorySection";
import ItemSection, { ItemDetailModal } from "./Sections/ItemSection";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:9098/api/cp";

// Helper to update an item.
const updateItemAPICall = (id, itemData) =>
  axios.put(`${API_BASE_URL}/item/edit/${id}`, itemData);

const CounterPage = () => {
  const { counterId } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    selectedCounter: null,
    selectedCategory: null,
    counters: [],
    categories: [],
    items: [],
    loading: false,
    editMode: false,
    selectedItem: null,
    itemDetailOpen: false,
    error: "",
    success: "",
  });

  // --- Modal state for Category (Add/Edit) ---
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("add");
  const [categoryForm, setCategoryForm] = useState({ id: null, name: "" });

  // --- Modal state for Item (Add/Edit) ---
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState("add");
  const [itemForm, setItemForm] = useState({
    id: null,
    name: "",
    price: "",
    quantity: "",
    status: "Available",
  });

  // ---------------- Data Fetching ----------------
  const fetchInitialData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const [countersRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/all`),
        axios.get(`${API_BASE_URL}/category`),
      ]);
      const fetchedCounters = countersRes.data || [];
      setState((prev) => ({
        ...prev,
        counters: fetchedCounters,
        categories: categoriesRes.data || [],
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to load initial data" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Set the selected counter based on the URL parameter (or default to the first active one)
  useEffect(() => {
    if (state.counters.length > 0) {
      if (counterId) {
        const foundCounter = state.counters.find(
          (counter) => String(counter.id) === counterId
        );
        if (foundCounter) {
          if (foundCounter.status !== "Active") {
            setState((prev) => ({
              ...prev,
              error: "Counter is inactive. Please activate it first.",
              selectedCounter: null,
              selectedCategory: null,
              items: [],
              editMode: false,
            }));
            return;
          }
          if (!state.selectedCounter || state.selectedCounter.id !== foundCounter.id) {
            setState((prev) => ({
              ...prev,
              selectedCounter: foundCounter,
              selectedCategory: null,
              items: [],
              editMode: false,
              error: "",
            }));
          }
        }
      } else {
        if (!state.selectedCounter) {
          const defaultCounter = state.counters[0];
          if (defaultCounter.status !== "Active") {
            setState((prev) => ({
              ...prev,
              error: "Default counter is inactive. Please activate it first.",
            }));
            return;
          }
          setState((prev) => ({
            ...prev,
            selectedCounter: defaultCounter,
            selectedCategory: null,
            items: [],
            editMode: false,
            error: "",
          }));
          navigate(`/admin/counters/${defaultCounter.id}`);
        }
      }
    }
  }, [counterId, state.counters, state.selectedCounter, navigate]);

  const fetchItems = useCallback(async () => {
    if (!state.selectedCounter) return;
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(
        `${API_BASE_URL}/counter/${state.selectedCounter.id}`
      );
      setState((prev) => ({
        ...prev,
        items: Array.isArray(response.data) ? response.data : [],
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to fetch items" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [state.selectedCounter]);

  useEffect(() => {
    if (state.selectedCounter) {
      fetchItems();
    }
  }, [state.selectedCounter, fetchItems]);

  // ---------------- Handlers ----------------
  // Toggle edit mode – note we now toggle rather than force true.
  const handleToggleSettings = () =>
    setState((prev) => ({ ...prev, editMode: !prev.editMode }));

  const handleExitEditMode = () =>
    setState((prev) => ({ ...prev, editMode: false, selectedCategory: null }));

  const handleSelectCategory = (category) => {
    if (!state.editMode) {
      setState((prev) => ({ ...prev, selectedCategory: category }));
    }
  };

  // Back arrow: clear selected category or exit edit mode.
  const handleBack = () => {
    if (state.selectedCategory) {
      setState((prev) => ({ ...prev, selectedCategory: null }));
    } else if (state.editMode) {
      handleExitEditMode();
    }
  };

  // ------------- API Calls for Category -------------
  const addCategory = async (data) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await axios.post(`${API_BASE_URL}/category/new`, data);
      setState((prev) => ({
        ...prev,
        categories: [...prev.categories, response.data],
        success: "Category added successfully",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to add category" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const editCategory = async (data) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await axios.put(
        `${API_BASE_URL}/category/edit/${data.id}`,
        data
      );
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === response.data.id ? response.data : cat
        ),
        success: "Category updated successfully",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to update category" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const deleteCategory = async (id) => {
    // Get all items that belong to the category.
    const itemsInCategory = state.items.filter(
      (item) => item.category?.id === id
    );

    let proceed = true;
    if (itemsInCategory.length > 0) {
      proceed = window.confirm(
        `Deleting this category will also delete its ${itemsInCategory.length} item${
          itemsInCategory.length > 1 ? "s" : ""
        }. Do you want to proceed?`
      );
    }
    if (!proceed) return;

    try {
      setState((prev) => ({ ...prev, loading: true }));
      // First delete all items under this category.
      if (itemsInCategory.length > 0) {
        await Promise.all(
          itemsInCategory.map((item) =>
            axios.delete(`${API_BASE_URL}/item/delete/${item.id}`)
          )
        );
      }
      // Now delete the category.
      await axios.delete(`${API_BASE_URL}/category/delete/${id}`);
      setState((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat.id !== id),
        items: prev.items.filter((item) => item.category?.id !== id),
        success: "Category (and its items) deleted successfully",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to delete category" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ------------- API Calls for Item -------------
  const addItem = async (data) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await axios.post(`${API_BASE_URL}/item`, data);
      setState((prev) => ({
        ...prev,
        items: [...prev.items, response.data],
        success: "Item added successfully",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to add item" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const editItem = async (data) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await updateItemAPICall(data.id, data);
      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === response.data.id ? response.data : item
        ),
        success: "Item updated successfully",
      }));
    } catch (error) {
      console.error("Error updating item:", error);
      setState((prev) => ({ ...prev, error: "Failed to update item" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const deleteItem = async (id) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await axios.delete(`${API_BASE_URL}/item/delete/${id}`);
      setState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        success: "Item deleted successfully",
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to delete item" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ------------- Modal Handlers -------------
  const handleOpenCategoryModal = (mode, category = { id: null, name: "" }) => {
    setCategoryModalMode(mode);
    setCategoryForm(category);
    setCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setCategoryModalOpen(false);
    setCategoryForm({ id: null, name: "" });
  };

  const handleCategoryModalSubmit = async () => {
    const data = { counterId: state.selectedCounter.id, name: categoryForm.name };
    if (categoryModalMode === "add") {
      await addCategory(data);
    } else {
      await editCategory({ id: categoryForm.id, ...data });
    }
    handleCloseCategoryModal();
  };

  const handleOpenItemModal = (
    mode,
    item = { id: null, name: "", price: "", quantity: "", status: "Available" },
    category = null
  ) => {
    setItemModalMode(mode);
    if (mode === "edit") {
      setItemForm({ ...item, category: item.category || state.selectedCategory });
    } else {
      setItemForm({
        ...item,
        category: category || state.selectedCategory,
        counter: state.selectedCounter,
      });
    }
    setItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setItemModalOpen(false);
    setItemForm({ id: null, name: "", price: "", quantity: "", status: "Available" });
  };

  const handleItemModalSubmit = async () => {
    const payload = {
      ...itemForm,
      price: parseFloat(itemForm.price),
      counter: state.selectedCounter,
      category: itemForm.category || state.selectedCategory,
    };
    if (itemModalMode === "add") {
      await addItem(payload);
    } else {
      await editItem(payload);
    }
    handleCloseItemModal();
  };

  const handleItemClick = (item) => {
    setState((prev) => ({
      ...prev,
      selectedItem: item,
      itemDetailOpen: true,
    }));
  };

  const closeItemDetailModal = () => {
    setState((prev) => ({
      ...prev,
      itemDetailOpen: false,
      selectedItem: null,
    }));
  };

  const handleRefresh = () => {
    // Clear data and re-fetch initial data.
    setState((prev) => ({
      ...prev,
      selectedCounter: null,
      categories: [],
      items: [],
      selectedCategory: null,
    }));
    fetchInitialData();
  };

  // ------------- Filtering Categories -------------
  const filteredCategories = state.selectedCounter
    ? state.categories.filter((cat) => {
        const selectedId = String(state.selectedCounter.id);
        let categoryCounterId = "";
        if (cat.counter) {
          categoryCounterId =
            typeof cat.counter === "object" ? String(cat.counter.id) : String(cat.counter);
        } else if (cat.counterId) {
          categoryCounterId = String(cat.counterId);
        }
        return categoryCounterId === selectedId;
      })
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box sx={{ flex: 1, p: 3 }}>
        {state.selectedCounter ? (
          <>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              {(state.editMode || state.selectedCategory) ? (
                <IconButton onClick={handleBack}>
                  <ArrowBack style={{ color: "#ffffff" }} />
                </IconButton>
              ) : (
                <Box />
              )}
              <Typography
                variant="h4"
                sx={{ flexGrow: 1, textAlign: "center" }}
                style={{ fontFamily: "Bebas Neue, sans-serif", color: "#FE840E" }}
              >
                {state.editMode
                  ? `Edit Mode: ${state.selectedCounter.counterName}`
                  : ` ${state.selectedCounter.counterName}`}
              </Typography>
              {(!state.editMode && !state.selectedCategory) && (
                <IconButton onClick={handleToggleSettings}>
                  <Settings style={{ color: "#ffffff" }} />
                </IconButton>
              )}
            </Box>

            {/* Render Categories or Items */}
            {!state.selectedCategory ? (
              <CategorySection
                categories={filteredCategories}
                items={state.items}
                editMode={state.editMode}
                onSelectCategory={handleSelectCategory}
                onEditCategory={(cat) => handleOpenCategoryModal("edit", cat)}
                onDeleteCategory={(id) => deleteCategory(id)}
                onAddCategory={() => handleOpenCategoryModal("add")}
                onItemClick={handleItemClick}
                onEditItem={(item) => handleOpenItemModal("edit", item)}
                onDeleteItem={(id) => deleteItem(id)}
                onAddItem={(cat) =>
                  handleOpenItemModal(
                    "add",
                    { name: "", price: "", quantity: "", status: "Available" },
                    cat
                  )
                }
              />
            ) : (
              <ItemSection
                items={state.items.filter((item) => {
                  const selectedCatId = state.selectedCategory.id;
                  return (
                    (item.category && item.category.id === selectedCatId) ||
                    item.categoryId === selectedCatId
                  );
                })}
                editMode={state.editMode}
                onItemClick={handleItemClick}
                onEditItem={(item) => handleOpenItemModal("edit", item)}
                onDeleteItem={(id) => deleteItem(id)}
                onAddItem={(cat) =>
                  handleOpenItemModal(
                    "add",
                    { name: "", price: "", quantity: "", status: "Available" },
                    cat
                  )
                }
                onToggleEditMode={handleToggleSettings}
              />
            )}
          </>
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 5, color: "#ffffff" }}>
            Please select a counter to load categories and items.
          </Typography>
        )}
      </Box>

      <ItemDetailModal
        open={state.itemDetailOpen}
        item={state.selectedItem}
        onClose={closeItemDetailModal}
      />

      <Snackbar
        open={!!state.error}
        autoHideDuration={3000}
        onClose={() => setState((prev) => ({ ...prev, error: "" }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}

      >
        <Alert severity="error" variant="filled" onClose={() => setState((prev) => ({ ...prev, error: "" }))}>
          {state.error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!state.success}
        autoHideDuration={3000}
        onClose={() => setState((prev) => ({ ...prev, success: "" }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}

      >
        <Alert severity="success"  variant="filled" onClose={() => setState((prev) => ({ ...prev, success: "" }))}>
          {state.success}
        </Alert>
      </Snackbar>

      {/* Category Modal */}
      <Dialog open={categoryModalOpen} onClose={handleCloseCategoryModal}>
        <DialogTitle
          style={{
            fontFamily: "Kanit, sans-serif",
            fontWeight: 500,
            fontStyle: "normal",
            fontSize: "25px",
          }}
        >
          {categoryModalMode === "add" ? "Add Category" : "Edit Category"}
        </DialogTitle>
        <DialogContent style={{ paddingTop: "5px" }}>
          <TextField
            label="Category Name"
            fullWidth
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryModal}>Cancel</Button>
          <Button onClick={handleCategoryModalSubmit} variant="contained">
            {categoryModalMode === "add" ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Item Modal */}
      <Dialog open={itemModalOpen} onClose={handleCloseItemModal}>
        <DialogTitle
          style={{
            fontFamily: "Kanit, sans-serif",
            fontWeight: 500,
            fontStyle: "normal",
            fontSize: "30px",
          }}
        >
          {itemModalMode === "add" ? "Add Item" : "Edit Item"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            fullWidth
            value={itemForm.name}
            onChange={(e) =>
              setItemForm((prev) => ({ ...prev, name: e.target.value }))
            }
            margin="normal"
          />
          <TextField
            label="Price"
            fullWidth
            type="number"
            value={itemForm.price}
            onChange={(e) =>
              setItemForm((prev) => ({ ...prev, price: e.target.value }))
            }
            margin="normal"
          />
          <TextField
            label="Quantity"
            fullWidth
            value={itemForm.quantity}
            onChange={(e) =>
              setItemForm((prev) => ({ ...prev, quantity: e.target.value }))
            }
            margin="normal"
          />
          <TextField
            label="Status"
            fullWidth
            select
            value={itemForm.status}
            onChange={(e) =>
              setItemForm((prev) => ({ ...prev, status: e.target.value }))
            }
            margin="normal"
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemModal}>Cancel</Button>
          <Button onClick={handleItemModalSubmit} variant="contained">
            {itemModalMode === "add" ? "Add" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CounterPage;
