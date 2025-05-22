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
  OutlinedInput,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
  Skeleton,
  Checkbox,
  Collapse,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Sort as SortIcon,
  DeleteSweep as DeleteMultipleIcon,
} from "@mui/icons-material";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  total: number;
  categories: Category[];
}

interface ProductFormData {
  name: string;
  image: string;
  price: number;
  description: string;
  total: number;
  categoryIds: number[];
}

// Mock categories data
const mockCategories: Category[] = [
  { id: 1, name: "Tủ lạnh", description: "tủ lạnh nhỏ" },
  { id: 2, name: "Máy giặt", description: "Máy giặt hiện đại" },
  { id: 3, name: "Tivi", description: "Tivi xịn" },
  { id: 4, name: "Điện thoại", description: "Điện thoại thông minh" },
  { id: 5, name: "Laptop", description: "Laptop mỏng nhẹ" },
];

// Mock products data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Tủ lạnh Xiaomi",
    image:
      "https://caothienphat.com/wp-content/uploads/2024/06/Tu-lanh-Xiaomi-Mijia-606L-768x768.jpg",
    price: 599.99,
    description: "Tủ lạnh Xiaomi Mijia 606L với công nghệ làm lạnh tiên tiến",
    total: 15,
    categories: [mockCategories[0]],
  },
  {
    id: 2,
    name: "Máy giặt Samsung",
    image:
      "https://cdn.nguyenkimmall.com/images/detailed/775/10052046-may-giat-samsung-ww90tp54dsb-sv-1.jpg",
    price: 499.99,
    description: "Máy giặt Samsung 9kg với công nghệ giặt hơi nước",
    total: 10,
    categories: [mockCategories[1]],
  },
  {
    id: 3,
    name: "Smart TV LG",
    image:
      "https://cdn.tgdd.vn/Products/Images/1942/235792/lg-55up7750ptb-2.jpg",
    price: 799.99,
    description: "Smart TV LG 55 inch 4K UHD với trí tuệ nhân tạo",
    total: 8,
    categories: [mockCategories[2]],
  },
  {
    id: 4,
    name: "iPhone 15 Pro",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-blue-thumbnew-600x600.jpg",
    price: 1099.99,
    description: "iPhone 15 Pro với chip A17 Pro và camera 48MP",
    total: 25,
    categories: [mockCategories[3]],
  },
  {
    id: 5,
    name: "MacBook Air M2",
    image:
      "https://cdn.tgdd.vn/Products/Images/44/282827/apple-macbook-air-m2-2022-16gb-256gb-600x600.jpg",
    price: 1299.99,
    description: "MacBook Air với chip M2, 16GB RAM và 256GB SSD",
    total: 12,
    categories: [mockCategories[4]],
  },
  {
    id: 6,
    name: "Tủ lạnh Samsung",
    image:
      "https://cdn.tgdd.vn/Products/Images/1943/238016/samsung-rs64r53012c-sv-12-300x300.jpg",
    price: 699.99,
    description: "Tủ lạnh Samsung Side by Side 617L với ngăn đá phía dưới",
    total: 7,
    categories: [mockCategories[0]],
  },
  {
    id: 7,
    name: "Smart TV Samsung",
    image:
      "https://cdn.tgdd.vn/Products/Images/1942/235642/samsung-ua50au9000-1.jpg",
    price: 549.99,
    description: "Smart TV Samsung 50 inch 4K UHD với công nghệ HDR",
    total: 14,
    categories: [mockCategories[2]],
  },
  {
    id: 8,
    name: "iPad Pro M2",
    image:
      "https://cdn.tgdd.vn/Products/Images/522/294103/ipad-pro-m2-11-inch-wifi-cellular-xam-thumb-600x600.jpg",
    price: 899.99,
    description: "iPad Pro 11 inch với chip M2, màn hình Liquid Retina",
    total: 18,
    categories: [mockCategories[3], mockCategories[4]],
  },
];

const DashboardProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    image: "",
    price: 0,
    description: "",
    total: 0,
    categoryIds: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // New states for enhanced filtering, sorting and bulk actions
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterByPrice, setFilterByPrice] = useState("all");
  const [filterByStock, setFilterByStock] = useState("all");
  const [filterByCategory, setFilterByCategory] = useState<number | string>(
    "all"
  );
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 0); // Increased delay to better demonstrate loading
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(0);
  }, [
    searchTerm,
    filterByPrice,
    filterByStock,
    filterByCategory,
    sortField,
    sortDirection,
  ]);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedProducts(
        filteredAndSortedProducts.map((product) => product.id)
      );
    } else if (selectedProducts.length === filteredAndSortedProducts.length) {
      // This condition helps prevent unnecessary state updates
      setSelectedProducts([]);
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
      image: "",
      price: 0,
      description: "",
      total: 0,
      categoryIds: [],
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (product: Product) => {
    setEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      image: product.image,
      price: product.price,
      description: product.description,
      total: product.total,
      categoryIds: product.categories.map((cat) => cat.id),
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle numeric values
    if (name === "price" || name === "total") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      categoryIds: typeof value === "string" ? [] : value,
    });
  };

  const handleSubmit = () => {
    try {
      if (editMode && currentProduct) {
        // Update product in mock data
        const updatedProducts = products.map((product) => {
          if (product.id === currentProduct.id) {
            const selectedCategories = mockCategories.filter((cat) =>
              formData.categoryIds.includes(cat.id)
            );

            return {
              ...product,
              name: formData.name,
              image: formData.image,
              price: formData.price,
              description: formData.description,
              total: formData.total,
              categories: selectedCategories,
            };
          }
          return product;
        });

        setProducts(updatedProducts);
      } else {
        // Create new product with mock data
        const selectedCategories = mockCategories.filter((cat) =>
          formData.categoryIds.includes(cat.id)
        );

        const newProduct: Product = {
          id: Math.max(...products.map((p) => p.id)) + 1,
          name: formData.name,
          image: formData.image,
          price: formData.price,
          description: formData.description,
          total: formData.total,
          categories: selectedCategories,
        };

        setProducts([...products, newProduct]);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteConfirmation = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      // Delete product from mock data
      const updatedProducts = products.filter(
        (product) => product.id !== productToDelete
      );
      setProducts(updatedProducts);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
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

  const handleProductSelect = (id: number) => {
    setSelectedProducts((prev) => {
      if (prev.includes(id)) {
        // Deselect
        const newSelected = prev.filter((productId) => productId !== id);
        // Update selectAll state
        if (newSelected.length === 0) {
          setSelectAll(false);
        }
        return newSelected;
      } else {
        // Select
        const newSelected = [...prev, id];
        // Update selectAll state if all visible items are selected
        if (newSelected.length === filteredProducts.length) {
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
    if (selectedProducts.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialogOpen(false);
  };

  const handleBulkDelete = () => {
    // Delete all selected products
    const updatedProducts = products.filter(
      (product) => !selectedProducts.includes(product.id)
    );
    setProducts(updatedProducts);
    setSelectedProducts([]);
    setSelectAll(false);
    setBulkDeleteDialogOpen(false);
  };

  // Filter products based on search and filter criteria
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Price filter
    const matchesPrice =
      filterByPrice === "all" ||
      (filterByPrice === "under100" && product.price < 100) ||
      (filterByPrice === "100to500" &&
        product.price >= 100 &&
        product.price <= 500) ||
      (filterByPrice === "500to1000" &&
        product.price > 500 &&
        product.price <= 1000) ||
      (filterByPrice === "over1000" && product.price > 1000);

    // Stock filter
    const matchesStock =
      filterByStock === "all" ||
      (filterByStock === "outOfStock" && product.total === 0) ||
      (filterByStock === "lowStock" &&
        product.total > 0 &&
        product.total <= 10) ||
      (filterByStock === "inStock" && product.total > 10);

    // Category filter
    const matchesCategory =
      filterByCategory === "all" ||
      product.categories.some((cat) => cat.id === filterByCategory);

    return matchesSearch && matchesPrice && matchesStock && matchesCategory;
  });

  // Apply sorting to filtered products
  const filteredAndSortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;

    // Apply sorting based on selected field
    if (sortField === "id") {
      comparison = a.id - b.id;
    } else if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "price") {
      comparison = a.price - b.price;
    } else if (sortField === "stock") {
      comparison = a.total - b.total;
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
        <Typography variant="h4">Products Management</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {selectedProducts.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteMultipleIcon />}
              onClick={openBulkDeleteDialog}
            >
              Delete Selected ({selectedProducts.length})
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
            Add Product
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
              <InputLabel>Price Range</InputLabel>
              <Select
                value={filterByPrice}
                label="Price Range"
                onChange={(e) => setFilterByPrice(e.target.value as string)}
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="under100">Under $100</MenuItem>
                <MenuItem value="100to500">$100 - $500</MenuItem>
                <MenuItem value="500to1000">$500 - $1000</MenuItem>
                <MenuItem value="over1000">Over $1000</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={filterByStock}
                label="Stock Status"
                onChange={(e) => setFilterByStock(e.target.value as string)}
              >
                <MenuItem value="all">All Stock Levels</MenuItem>
                <MenuItem value="outOfStock">Out of Stock</MenuItem>
                <MenuItem value="lowStock">Low Stock (1-10)</MenuItem>
                <MenuItem value="inStock">In Stock (&gt;10)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterByCategory}
                label="Category"
                onChange={(e) =>
                  setFilterByCategory(e.target.value as number | string)
                }
              >
                <MenuItem value="all">All Categories</MenuItem>
                {mockCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
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
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="stock">Stock</MenuItem>
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
            {filterByPrice !== "all" && (
              <Chip
                label={`Price: ${
                  filterByPrice === "under100"
                    ? "Under $100"
                    : filterByPrice === "100to500"
                    ? "$100 - $500"
                    : filterByPrice === "500to1000"
                    ? "$500 - $1000"
                    : "Over $1000"
                }`}
                onDelete={() => setFilterByPrice("all")}
                color="primary"
                size="small"
              />
            )}
            {filterByStock !== "all" && (
              <Chip
                label={`Stock: ${
                  filterByStock === "outOfStock"
                    ? "Out of Stock"
                    : filterByStock === "lowStock"
                    ? "Low Stock"
                    : "In Stock"
                }`}
                onDelete={() => setFilterByStock("all")}
                color="warning"
                size="small"
              />
            )}
            {filterByCategory !== "all" && (
              <Chip
                label={`Category: ${
                  mockCategories.find((cat) => cat.id === filterByCategory)
                    ?.name || ""
                }`}
                onDelete={() => setFilterByCategory("all")}
                color="info"
                size="small"
              />
            )}
            <Chip
              label={`Sort: ${
                sortField === "id"
                  ? "ID"
                  : sortField === "name"
                  ? "Name"
                  : sortField === "price"
                  ? "Price"
                  : "Stock"
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
          placeholder="Search products by name or description..."
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
          <Table stickyHeader aria-label="product table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedProducts.length > 0 &&
                      selectedProducts.length < filteredAndSortedProducts.length
                    }
                    checked={selectAll}
                    onChange={handleSelectAllToggle}
                    disabled={
                      isLoading || filteredAndSortedProducts.length === 0
                    }
                  />
                </TableCell>
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
                <TableCell>Image</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Price ($)
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("price")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={sortField === "price" ? "primary" : "disabled"}
                        sx={{
                          transform:
                            sortField === "price" && sortDirection === "desc"
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
                    Stock
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("stock")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={sortField === "stock" ? "primary" : "disabled"}
                        sx={{
                          transform:
                            sortField === "stock" && sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>Categories</TableCell>
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
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width={50}
                        height={50}
                        animation="wave"
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" width="100%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation="wave" width={100} />
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
              ) : filteredAndSortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleProductSelect(product.id)}
                        />
                      </TableCell>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnCTcjmtbtvqjvQp0Ss-C2rmYeBf3W69Rumg&s";
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.description.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.total}
                          color={
                            product.total === 0
                              ? "error"
                              : product.total <= 10
                              ? "warning"
                              : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {product.categories.map((category) => (
                            <Chip
                              key={category.id}
                              label={category.name}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
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
                            onClick={() => handleOpenEditDialog(product)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteConfirmation(product.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          disabled={isLoading}
        />
      </Paper>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mt: 1,
            }}
          >
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
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="dense"
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Stock"
              name="total"
              type="number"
              value={formData.total}
              onChange={handleInputChange}
              margin="dense"
              inputProps={{ min: 0 }}
            />
            <Box sx={{ gridColumn: "1 / -1" }}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="category-select-label">Categories</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  multiple
                  value={formData.categoryIds}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = mockCategories.find(
                          (cat) => cat.id === value
                        );
                        return (
                          <Chip
                            key={value}
                            label={category ? category.name : ""}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {mockCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: "1 / -1" }}>
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
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Do you sure want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteProduct}
            variant="contained"
            color="error"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onClose={handleBulkDeleteCancel}>
        <DialogTitle>Delete Multiple Products</DialogTitle>
        <DialogContent>
          <Typography>
            Do you sure want to delete {selectedProducts.length} selected
            products?
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

export default DashboardProducts;
