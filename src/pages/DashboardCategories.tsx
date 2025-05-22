import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Collapse,
  Skeleton,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilterAlt as FilterIcon,
  Sort as SortIcon,
  DeleteSweep as DeleteMultipleIcon,
  FilterList,
} from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  total: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

interface CategoryFormData {
  name: string;
  description: string;
}

// Mock categories data (same as in DashboardProducts)
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Tủ lạnh",
    description: "tủ lạnh nhỏ",
    products: [
      {
        id: 1,
        name: "Tủ lạnh Xiaomi",
        image:
          "https://caothienphat.com/wp-content/uploads/2024/06/Tu-lanh-Xiaomi-Mijia-606L-768x768.jpg",
        price: 599.99,
        description:
          "Tủ lạnh Xiaomi Mijia 606L với công nghệ làm lạnh tiên tiến",
        total: 15,
      },
      {
        id: 6,
        name: "Tủ lạnh Samsung",
        image:
          "https://cdn.tgdd.vn/Products/Images/1943/238016/samsung-rs64r53012c-sv-12-300x300.jpg",
        price: 699.99,
        description: "Tủ lạnh Samsung Side by Side 617L với ngăn đá phía dưới",
        total: 7,
      },
    ],
  },
  {
    id: 2,
    name: "Máy giặt",
    description: "Máy giặt hiện đại",
    products: [
      {
        id: 2,
        name: "Máy giặt Samsung",
        image:
          "https://cdn.nguyenkimmall.com/images/detailed/775/10052046-may-giat-samsung-ww90tp54dsb-sv-1.jpg",
        price: 499.99,
        description: "Máy giặt Samsung 9kg với công nghệ giặt hơi nước",
        total: 10,
      },
    ],
  },
  {
    id: 3,
    name: "Tivi",
    description: "Tivi xịn",
    products: [
      {
        id: 3,
        name: "Smart TV LG",
        image:
          "https://cdn.tgdd.vn/Products/Images/1942/235792/lg-55up7750ptb-2.jpg",
        price: 799.99,
        description: "Smart TV LG 55 inch 4K UHD với trí tuệ nhân tạo",
        total: 8,
      },
      {
        id: 7,
        name: "Smart TV Samsung",
        image:
          "https://cdn.tgdd.vn/Products/Images/1942/235642/samsung-ua50au9000-1.jpg",
        price: 549.99,
        description: "Smart TV Samsung 50 inch 4K UHD với công nghệ HDR",
        total: 14,
      },
    ],
  },
  {
    id: 4,
    name: "Điện thoại",
    description: "Điện thoại thông minh",
    products: [
      {
        id: 4,
        name: "iPhone 15 Pro",
        image:
          "https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-blue-thumbnew-600x600.jpg",
        price: 1099.99,
        description: "iPhone 15 Pro với chip A17 Pro và camera 48MP",
        total: 25,
      },
      {
        id: 8,
        name: "iPad Pro M2",
        image:
          "https://cdn.tgdd.vn/Products/Images/522/294103/ipad-pro-m2-11-inch-wifi-cellular-xam-thumb-600x600.jpg",
        price: 899.99,
        description: "iPad Pro 11 inch với chip M2, màn hình Liquid Retina",
        total: 18,
      },
    ],
  },
  {
    id: 5,
    name: "Laptop",
    description: "Laptop mỏng nhẹ",
    products: [
      {
        id: 5,
        name: "MacBook Air M2",
        image:
          "https://cdn.tgdd.vn/Products/Images/44/282827/apple-macbook-air-m2-2022-16gb-256gb-600x600.jpg",
        price: 1299.99,
        description: "MacBook Air với chip M2, 16GB RAM và 256GB SSD",
        total: 12,
      },
      {
        id: 8,
        name: "iPad Pro M2",
        image:
          "https://cdn.tgdd.vn/Products/Images/522/294103/ipad-pro-m2-11-inch-wifi-cellular-xam-thumb-600x600.jpg",
        price: 899.99,
        description: "iPad Pro 11 inch với chip M2, màn hình Liquid Retina",
        total: 18,
      },
    ],
  },
];

const DashboardCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  );

  // New states for enhanced filtering, sorting and bulk actions
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterByProductCount, setFilterByProductCount] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setCategories(mockCategories);
      setIsLoading(false);
    }, 0);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterByProductCount, sortField, sortDirection]);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedCategories(filteredAndSortedCategories.map((cat) => cat.id));
    } else if (
      selectedCategories.length === filteredAndSortedCategories.length
    ) {
      // This condition helps prevent unnecessary state updates
      setSelectedCategories([]);
    }
  }, [selectAll]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setEditMode(false);
    setFormData({
      name: "",
      description: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (category: Category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    try {
      if (editMode && currentCategory) {
        // Update category in mock data
        const updatedCategories = categories.map((category) => {
          if (category.id === currentCategory.id) {
            return {
              ...category,
              name: formData.name,
              description: formData.description,
            };
          }
          return category;
        });

        setCategories(updatedCategories);
      } else {
        // Create new category with mock data
        const newCategory: Category = {
          id: Math.max(...categories.map((c) => c.id)) + 1,
          name: formData.name,
          description: formData.description,
          products: [],
        };

        setCategories([...categories, newCategory]);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteConfirmation = (id: number) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      // Delete category from mock data
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryToDelete
      );
      setCategories(updatedCategories);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategoryId(
      expandedCategoryId === categoryId ? null : categoryId
    );
  };

  // New handlers for enhanced features
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCategorySelect = (id: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) {
        // Deselect
        const newSelected = prev.filter((categoryId) => categoryId !== id);
        // Update selectAll state
        if (newSelected.length === 0) {
          setSelectAll(false);
        }
        return newSelected;
      } else {
        // Select
        const newSelected = [...prev, id];
        // Update selectAll state if all visible items are selected
        if (newSelected.length === filteredAndSortedCategories.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  const handleSelectAllToggle = () => {
    setSelectAll(!selectAll);
  };

  const openBulkDeleteDialog = () => {
    if (selectedCategories.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialogOpen(false);
  };

  const handleBulkDelete = () => {
    // Delete all selected categories
    const updatedCategories = categories.filter(
      (category) => !selectedCategories.includes(category.id)
    );
    setCategories(updatedCategories);
    setSelectedCategories([]);
    setSelectAll(false);
    setBulkDeleteDialogOpen(false);
  };

  // Filter categories based on search and filter criteria
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Product count filter
    if (filterByProductCount === "empty" && category.products.length > 0) {
      return false;
    }
    if (
      filterByProductCount === "hasProducts" &&
      category.products.length === 0
    ) {
      return false;
    }

    return matchesSearch;
  });

  // Apply sorting to filtered categories
  const filteredAndSortedCategories = [...filteredCategories].sort((a, b) => {
    let comparison = 0;

    // Apply sorting based on selected field
    if (sortField === "id") {
      comparison = a.id - b.id;
    } else if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "productCount") {
      comparison = a.products.length - b.products.length;
    }

    // Apply direction
    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Categories Management</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {selectedCategories.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteMultipleIcon />}
              onClick={openBulkDeleteDialog}
            >
              Delete Selected ({selectedCategories.length})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            disabled={isLoading}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters & Sorting
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Product Count</InputLabel>
              <Select
                value={filterByProductCount}
                label="Product Count"
                onChange={(e) =>
                  setFilterByProductCount(e.target.value as string)
                }
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="empty">Empty Categories</MenuItem>
                <MenuItem value="hasProducts">
                  Categories with Products
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value as string)}
              >
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="productCount">Product Count</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Direction</InputLabel>
              <Select
                value={sortDirection}
                label="Direction"
                onChange={(e) =>
                  setSortDirection(e.target.value as "asc" | "desc")
                }
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Active filters */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filterByProductCount !== "all" && (
              <Chip
                label={`Filter: ${
                  filterByProductCount === "empty"
                    ? "Empty Categories"
                    : "Categories with Products"
                }`}
                onDelete={() => setFilterByProductCount("all")}
                color="primary"
                size="small"
              />
            )}
            <Chip
              label={`Sort: ${
                sortField === "id"
                  ? "ID"
                  : sortField === "name"
                  ? "Name"
                  : "Product Count"
              } (${sortDirection === "asc" ? "Ascending" : "Descending"})`}
              color="secondary"
              size="small"
              icon={<SortIcon />}
            />
          </Box>
        </Paper>
      </Collapse>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search categories by name or description..."
          value={searchTerm}
          onChange={handleSearch}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="category table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedCategories.length > 0 &&
                      selectedCategories.length <
                        filteredAndSortedCategories.length
                    }
                    checked={selectAll}
                    onChange={handleSelectAllToggle}
                    disabled={
                      isLoading || filteredAndSortedCategories.length === 0
                    }
                  />
                </TableCell>
                <TableCell />
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    ID
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("id")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={sortField === "id" ? "primary" : "disabled"}
                        sx={{
                          transform:
                            sortField === "id" && sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Name
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("name")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={sortField === "name" ? "primary" : "disabled"}
                        sx={{
                          transform:
                            sortField === "name" && sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Products
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("productCount")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={
                          sortField === "productCount" ? "primary" : "disabled"
                        }
                        sx={{
                          transform:
                            sortField === "productCount" &&
                            sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell padding="checkbox">
                      <Skeleton
                        variant="rectangular"
                        width={20}
                        height={20}
                        animation="wave"
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="circular"
                        width={30}
                        height={30}
                        animation="wave"
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" width="100%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" width={80} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Skeleton
                          variant="circular"
                          width={30}
                          height={30}
                          animation="wave"
                        />
                        <Skeleton
                          variant="circular"
                          width={30}
                          height={30}
                          animation="wave"
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <React.Fragment key={category.id}>
                      <TableRow hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategorySelect(category.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleCategoryExpand(category.id)}
                          >
                            {expandedCategoryId === category.id ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{category.id}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          {category.description.length > 50
                            ? `${category.description.substring(0, 50)}...`
                            : category.description}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${category.products.length} product(s)`}
                            color={
                              category.products.length > 0
                                ? "primary"
                                : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenEditDialog(category)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteConfirmation(category.id)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={7}
                        >
                          <Collapse
                            in={expandedCategoryId === category.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 2 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                Products in {category.name}
                              </Typography>
                              {category.products.length > 0 ? (
                                <Table size="small" aria-label="products">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>ID</TableCell>
                                      <TableCell>Image</TableCell>
                                      <TableCell>Name</TableCell>
                                      <TableCell>Price</TableCell>
                                      <TableCell>Stock</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {category.products.map((product) => (
                                      <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>
                                          {product.image && (
                                            <img
                                              src={product.image}
                                              alt={product.name}
                                              style={{
                                                width: "40px",
                                                height: "40px",
                                                objectFit: "cover",
                                              }}
                                              onError={(e) => {
                                                (
                                                  e.target as HTMLImageElement
                                                ).src =
                                                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnCTcjmtbtvqjvQp0Ss-C2rmYeBf3W69Rumg&s";
                                              }}
                                            />
                                          )}
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                          ${product.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{product.total}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <Typography color="text.secondary">
                                  No products in this category
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          disabled={isLoading}
        />
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="dense"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>Do you sure want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteCategory}
            variant="contained"
            color="error"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onClose={handleBulkDeleteCancel}>
        <DialogTitle>Delete Multiple Categories</DialogTitle>
        <DialogContent>
          <Typography>
            Do you sure want to delete {selectedCategories.length} selected
            categories?
          </Typography>
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkDeleteCancel}>Cancel</Button>
          <Button onClick={handleBulkDelete} variant="contained" color="error">
            Yes, Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardCategories;
