import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  Chip,
  useMediaQuery,
  useTheme,
  MenuItem,
  Tooltip,
  Avatar,
  Fade,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Refresh,
  Search,
  Category,
  Fastfood,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

// Constants
const API_BASE = "http://localhost:9098/api/cp";
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];
const INITIAL_ITEM_STATE = {
  id: null,
  name: "",
  price: "",
  quantity: "",
  status: "Available",
};

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
}));

const AnimatedGridItem = motion(Grid);
const TableRowAnimated = motion(TableRow);

const CounterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [state, setState] = useState({
    selectedCounter: null,
    selectedCategory: null,
    counters: [],
    categories: [],
    items: [],
    loading: false,
    error: null,
    success: null,
    searchQuery: "",
    page: 0,
    rowsPerPage: 10,
  });

  const [modals, setModals] = useState({
    category: { open: false, mode: "create" },
    item: { open: false, mode: "create" },
    deleteConfirm: { open: false, type: "", id: null },
  });

  const [forms, setForms] = useState({
    category: { id: null, name: "" },
    item: INITIAL_ITEM_STATE,
  });

  // Fetch initial data: counters and categories
  const fetchInitialData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const [countersRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE}/all`),
        axios.get(`${API_BASE}/category`),
      ]);
      setState((prev) => ({
        ...prev,
        counters: countersRes.data || [],
        categories: categoriesRes.data || [],
      }));
    } catch (error) {
      handleError("Initial data fetch failed:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch all items for the selected counter.
  // The endpoint returns all items regardless of category.
  const fetchItems = async () => {
    if (!state.selectedCounter) return;
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(
        `${API_BASE}/counter/${state.selectedCounter.id}`,
        { headers: { "Content-Type": "application/json" } }
      );
      const itemsData = Array.isArray(response.data) ? response.data : [];
      setState((prev) => ({
        ...prev,
        items: itemsData,
        page: 0,
      }));
    } catch (error) {
      console.error("Error fetching items:", error);
      handleError("Failed to fetch items:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handlers

  const handleCounterSelect = (counter) => {
    if (counter.status !== "Active") {
      handleError("Counter is inactive", { message: "Please activate counter first" });
      return;
    }
    setState((prev) => ({
      ...prev,
      selectedCounter: counter,
      selectedCategory: null,
      items: [],
    }));
  };

  const handleCategorySubmit = async () => {
    const { mode } = modals.category;
    const isEdit = mode === "edit";
    const url = isEdit ? `/category/edit/${forms.category.id}` : "/category/new";

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const payload = { ...forms.category, counterId: state.selectedCounter.id };
      const { data } = await axios[isEdit ? "put" : "post"](`${API_BASE}${url}`, payload);
      setState((prev) => ({
        ...prev,
        categories: isEdit
          ? prev.categories.map((cat) => (cat.id === data.id ? data : cat))
          : [...prev.categories, data],
      }));
      handleSuccess(`Category ${isEdit ? "updated" : "created"} successfully`);
      handleModalClose();
    } catch (error) {
      handleError("Category operation failed:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleItemSubmit = async () => {
    const isEdit = modals.item.mode === "edit";
    const url = isEdit ? `/item/edit/${forms.item.id}` : "/item";

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const payload = {
        ...forms.item,
        price: parseFloat(forms.item.price),
        counter: state.selectedCounter,
        category: state.selectedCategory,
      };
      const { data } = await axios[isEdit ? "put" : "post"](`${API_BASE}${url}`, payload);
      setState((prev) => ({
        ...prev,
        items: isEdit
          ? prev.items.map((item) => (item.id === data.id ? data : item))
          : [...prev.items, data],
      }));
      handleSuccess(`Item ${isEdit ? "updated" : "created"} successfully`);
      handleModalClose();
    } catch (error) {
      handleError("Item operation failed:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async () => {
    const entityType = modals.deleteConfirm.type;
    const id = modals.deleteConfirm.id;
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await axios.delete(`${API_BASE}/${entityType}/delete/${id}`);
      setState((prev) => ({
        ...prev,
        [entityType === "category" ? "categories" : "items"]:
          prev[entityType === "category" ? "categories" : "items"].filter(
            (item) => item.id !== id
          ),
      }));
      handleSuccess(
        `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted`
      );
      handleModalClose();
    } catch (error) {
      handleError("Deletion failed:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Notification and modal helper functions
  const handleSuccess = (message) => {
    setState((prev) => ({ ...prev, success: message }));
    setTimeout(() => setState((prev) => ({ ...prev, success: null })), 3000);
  };

  const handleError = (logMessage, error) => {
    console.error(logMessage, error);
    setState((prev) => ({
      ...prev,
      error: error.response?.data?.message || "Operation failed",
    }));
  };

  const handleModalClose = () => {
    setModals({
      category: { open: false, mode: "create" },
      item: { open: false, mode: "create" },
      deleteConfirm: { open: false, type: "", id: null },
    });
    setForms({
      category: { id: null, name: "" },
      item: INITIAL_ITEM_STATE,
    });
  };

  // Updated client-side filtering:
  // Only show items that match the search string and whose category.id equals the selected category's id (if set).
  const filteredItems = state.items.filter((item) => {
    const searchFilter = item.name
      .toLowerCase()
      .includes(state.searchQuery.toLowerCase());
    const categoryFilter = state.selectedCategory
      ? item.category && item.category.id === state.selectedCategory.id
      : true;
    return searchFilter && categoryFilter;
  });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Sidebar
        isMobile={isMobile}
        counters={state.counters}
        selectedCounter={state.selectedCounter}
        onSelect={handleCounterSelect}
        onRefresh={fetchInitialData}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: isMobile ? 1 : 3 }}>
        <Header
          selectedCounter={state.selectedCounter}
          selectedCategory={state.selectedCategory}
          onBack={() => {
            setState((prev) => ({
              ...prev,
              selectedCategory: null,
              items: [],
            }));
            // Re-fetch items for the counter if needed.
            fetchItems();
          }}
          onAdd={() =>
            setModals((prev) => ({
              ...prev,
              [state.selectedCategory ? "item" : "category"]: { open: true, mode: "create" },
            }))
          }
        />

        {state.loading ? (
          <LinearProgress sx={{ height: 2 }} />
        ) : state.selectedCounter ? (
          state.selectedCategory ? (
            <ItemTable
              items={filteredItems}
              page={state.page}
              rowsPerPage={state.rowsPerPage}
              searchQuery={state.searchQuery}
              onEdit={(item) => {
                setForms((prev) => ({ ...prev, item }));
                setModals((prev) => ({ ...prev, item: { open: true, mode: "edit" } }));
              }}
              onDelete={(id) =>
                setModals((prev) => ({
                  ...prev,
                  deleteConfirm: { open: true, type: "item", id },
                }))
              }
              onSearch={(e) =>
                setState((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              onPageChange={(_, page) =>
                setState((prev) => ({ ...prev, page }))
              }
              onRowsPerPageChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  rowsPerPage: parseInt(e.target.value, 10),
                  page: 0,
                }))
              }
            />
          ) : (
            <CategoryGrid
              categories={state.categories.filter(
                (cat) => cat.counter?.id === state.selectedCounter.id
              )}
              onSelect={(category) => {
                setState((prev) => ({ ...prev, selectedCategory: category }));
                // Once a category is selected, fetch items.
                fetchItems();
              }}
              onEdit={(category) => {
                setForms((prev) => ({ ...prev, category }));
                setModals((prev) => ({
                  ...prev,
                  category: { open: true, mode: "edit" },
                }));
              }}
              onDelete={(id) =>
                setModals((prev) => ({
                  ...prev,
                  deleteConfirm: { open: true, type: "category", id },
                }))
              }
            />
          )
        ) : (
          <EmptyState
            icon={<Category sx={{ fontSize: 64 }} />}
            title="No Counter Selected"
            subtitle="Select a counter from the sidebar to begin management"
          />
        )}
      </Box>

      {/* Modals */}
      <CategoryModal
        open={modals.category.open}
        mode={modals.category.mode}
        form={forms.category}
        loading={state.loading}
        onClose={handleModalClose}
        onSubmit={handleCategorySubmit}
        onChange={(e) =>
          setForms((prev) => ({
            ...prev,
            category: { ...prev.category, name: e.target.value },
          }))
        }
      />

      <ItemModal
        open={modals.item.open}
        mode={modals.item.mode}
        form={forms.item}
        loading={state.loading}
        onClose={handleModalClose}
        onSubmit={handleItemSubmit}
        onChange={(field, value) =>
          setForms((prev) => ({
            ...prev,
            item: { ...prev.item, [field]: value },
          }))
        }
      />

      <ConfirmationModal
        open={modals.deleteConfirm.open}
        onClose={handleModalClose}
        onConfirm={handleDelete}
        title={`Delete ${modals.deleteConfirm.type}?`}
        content={`Are you sure you want to delete this ${modals.deleteConfirm.type}?`}
      />

      <Notification
        open={!!state.error || !!state.success}
        message={state.error || state.success}
        severity={state.error ? "error" : "success"}
        onClose={() =>
          setState((prev) => ({ ...prev, error: null, success: null }))
        }
      />
    </Box>
  );
};

// Sub-components

const Sidebar = ({ isMobile, counters, selectedCounter, onSelect, onRefresh }) => (
  <Box
    sx={{
      width: isMobile ? 72 : 280,
      p: 2,
      borderRight: 1,
      borderColor: "divider",
      bgcolor: "background.paper",
      transition: "width 0.3s ease",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      {!isMobile && <Typography variant="h6">Counters</Typography>}
      <Tooltip title="Refresh">
        <IconButton onClick={onRefresh} size="small">
          <Refresh fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Tooltip>
    </Box>
    {counters.map((counter) => (
      <CounterButton
        key={counter.id}
        counter={counter}
        isMobile={isMobile}
        isSelected={selectedCounter?.id === counter.id}
        onSelect={onSelect}
      />
    ))}
  </Box>
);

const CounterButton = ({ counter, isMobile, isSelected, onSelect }) => {
  const isActive = counter.status === "Active";
  return (
    <Tooltip key={counter.id} title={isMobile ? counter.counterName : ""} arrow>
      <Button
        fullWidth
        variant={isSelected ? "contained" : "text"}
        sx={{
          mb: 1,
          textTransform: "none",
          justifyContent: "flex-start",
          px: isMobile ? 1 : 2,
          minWidth: 0,
        }}
        onClick={() => onSelect(counter)}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: isActive ? "success.main" : "error.main",
              mr: isMobile ? 0 : 1.5,
            }}
          >
            {isActive ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
          </Avatar>
          {!isMobile && (
            <Typography
              sx={{
                flexGrow: 1,
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {counter.counterName}
            </Typography>
          )}
        </Box>
      </Button>
    </Tooltip>
  );
};

const Header = ({ selectedCounter, selectedCategory, onBack, onAdd }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {selectedCounter && (
        <Tooltip title="Go back">
          <IconButton onClick={onBack}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
      )}
      <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 600 }}>
        {selectedCategory
          ? `${selectedCategory.name} Items`
          : selectedCounter?.counterName || "Select a Counter"}
      </Typography>
      {selectedCounter && (
        <Fade in={!!selectedCounter}>
          <Button
            variant="contained"
            startIcon={selectedCategory ? <Fastfood /> : <Category />}
            onClick={onAdd}
          >
            {selectedCategory ? "New Item" : "New Category"}
          </Button>
        </Fade>
      )}
    </Box>
    {/* When on the category page (counter selected but no category chosen),
        display the "Menu" heading below the counter heading */}
    {selectedCounter && !selectedCategory && (
      <Typography variant="h5" sx={{ mt: 1, fontWeight: 400 }}>
        Menu
      </Typography>
    )}
  </Box>
);

const CategoryGrid = ({ categories, onSelect, onEdit, onDelete }) => (
  <Grid container spacing={3}>
    <AnimatePresence>
      {categories.map((category) => (
        <AnimatedGridItem
          key={category.id}
          item
          xs={12}
          sm={6}
          md={4}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          layout
        >
          <StyledCard>
            <CardContent sx={{ cursor: "pointer" }} onClick={() => onSelect(category)}>
              <Typography variant="h6" gutterBottom>
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.items?.length || "Click to load items"}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <IconButton onClick={() => onEdit(category)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton onClick={() => onDelete(category.id)}>
                <Delete fontSize="small" color="error" />
              </IconButton>
            </CardActions>
          </StyledCard>
        </AnimatedGridItem>
      ))}
    </AnimatePresence>
  </Grid>
);

const ItemTable = ({
  items,
  page,
  rowsPerPage,
  searchQuery,
  onEdit,
  onDelete,
  onSearch,
  onPageChange,
  onRowsPerPageChange,
}) => (
  <TableContainer component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search items..."
        value={searchQuery}
        InputProps={{
          startAdornment: <Search color="action" />,
          sx: { borderRadius: 4 },
        }}
        onChange={onSearch}
        sx={{ width: 300 }}
      />
    </Box>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <AnimatePresence>
          {items
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item) => (
              <TableRowAnimated
                key={item.id}
                hover
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={item.status === "Available" ? "success" : "error"}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(item)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(item.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRowAnimated>
            ))}
        </AnimatePresence>
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      component="div"
      count={items.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  </TableContainer>
);

const CategoryModal = ({ open, mode, form, loading, onClose, onSubmit, onChange }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{mode === "edit" ? "Edit Category" : "New Category"}</DialogTitle>
    <DialogContent sx={{ minWidth: 400, pt: 2 }}>
      <TextField
        autoFocus
        fullWidth
        label="Category Name"
        value={form.name}
        onChange={onChange}
        disabled={loading}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button variant="contained" onClick={onSubmit} disabled={!form.name || loading}>
        {mode === "edit" ? "Update" : "Create"}
      </Button>
    </DialogActions>
  </Dialog>
);

const ItemModal = ({ open, mode, form, loading, onClose, onSubmit, onChange }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{mode === "edit" ? "Edit Item" : "New Item"}</DialogTitle>
    <DialogContent
      sx={{
        minWidth: 400,
        pt: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        autoFocus
        fullWidth
        label="Item Name"
        value={form.name}
        onChange={(e) => onChange("name", e.target.value)}
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Price"
        type="number"
        value={form.price}
        onChange={(e) => onChange("price", e.target.value)}
        disabled={loading}
        InputProps={{ startAdornment: "$" }}
      />
      <TextField
        fullWidth
        label="Quantity (e.g., half, full, etc.)"
        value={form.quantity}
        onChange={(e) => onChange("quantity", e.target.value)}
        disabled={loading}
      />
      <TextField
        select
        fullWidth
        label="Status"
        value={form.status}
        onChange={(e) => onChange("status", e.target.value)}
        disabled={loading}
      >
        <MenuItem value="Available">Available</MenuItem>
        <MenuItem value="Not Available">Not Available</MenuItem>
      </TextField>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={!form.name || !form.price || loading}
      >
        {mode === "edit" ? "Update" : "Create"}
      </Button>
    </DialogActions>
  </Dialog>
);

const ConfirmationModal = ({ open, onClose, onConfirm, title, content }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="error" onClick={onConfirm}>
        Confirm Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <Box
    sx={{
      display: "flex",
      height: "70vh",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "text.secondary",
    }}
  >
    {icon}
    <Typography variant="h6" sx={{ mt: 2 }}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ mt: 1 }}>
      {subtitle}
    </Typography>
  </Box>
);

const Notification = ({ open, message, severity, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default CounterPage;
