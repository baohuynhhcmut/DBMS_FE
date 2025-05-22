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
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Collapse,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete as DeleteIcon,
  FilterAlt as FilterIcon,
  Sort as SortIcon,
  DeleteSweep as DeleteMultipleIcon,
} from "@mui/icons-material";
import { useDashboardStore } from "../lib/store";

const DashboardOrders = () => {
  const { orders, deleteOrder } = useDashboardStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // New states for enhanced filtering, sorting and bulk actions
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterByStatus, setFilterByStatus] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterByStatus, sortField, sortDirection, dateFilter]);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedOrders(filteredAndSortedOrders.map((order) => order.id));
    } else if (selectedOrders.length === filteredAndSortedOrders.length) {
      // This condition helps prevent unnecessary state updates
      setSelectedOrders([]);
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

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Handle delete dialog
  const handleOpenDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleDeleteOrder = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete);
      handleCloseDeleteDialog();
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

  const handleOrderSelect = (id: string) => {
    setSelectedOrders((prev) => {
      if (prev.includes(id)) {
        // Deselect
        const newSelected = prev.filter((orderId) => orderId !== id);
        // Update selectAll state
        if (newSelected.length === 0) {
          setSelectAll(false);
        }
        return newSelected;
      } else {
        // Select
        const newSelected = [...prev, id];
        // Update selectAll state if all visible items are selected
        if (newSelected.length === filteredAndSortedOrders.length) {
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
    if (selectedOrders.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialogOpen(false);
  };

  const handleBulkDelete = () => {
    // Delete all selected orders
    selectedOrders.forEach((id) => {
      deleteOrder(id);
    });
    setSelectedOrders([]);
    setSelectAll(false);
    setBulkDeleteDialogOpen(false);
  };

  // Get color for status chip
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "pending":
        return "primary";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Date filtering function
  const isInDateRange = (dateString: string) => {
    if (dateFilter === "all") return true;

    const orderDate = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    switch (dateFilter) {
      case "today":
        return orderDate >= today;
      case "yesterday":
        return orderDate >= yesterday && orderDate < today;
      case "lastWeek":
        return orderDate >= lastWeekStart;
      case "lastMonth":
        return orderDate >= lastMonthStart;
      default:
        return true;
    }
  };

  // Filter orders based on search and filter criteria
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      filterByStatus === "all" || order.status === filterByStatus;

    // Date filter
    const matchesDate = isInDateRange(order.date);

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Apply sorting to filtered orders
  const filteredAndSortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;

    // Apply sorting based on selected field
    if (sortField === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === "orderId") {
      comparison = a.id.localeCompare(b.id);
    } else if (sortField === "totalPrice") {
      comparison = a.totalPrice - b.totalPrice;
    } else if (sortField === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortField === "customer") {
      comparison = a.user.username.localeCompare(b.user.username);
    }

    // Apply direction
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={300} height={40} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Box>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Price ($)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={20} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Skeleton
                          variant="circular"
                          width={32}
                          height={32}
                          sx={{ mr: 1 }}
                        />
                        <Skeleton variant="text" width={80} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={150} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Skeleton variant="rectangular" width={300} height={40} />
          </Box>
        </Paper>
      </Box>
    );
  }

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
        <Typography variant="h4">Orders Management</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {selectedOrders.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteMultipleIcon />}
              onClick={openBulkDeleteDialog}
            >
              Delete Selected ({selectedOrders.length})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
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
              <InputLabel>Order Status</InputLabel>
              <Select
                value={filterByStatus}
                label="Order Status"
                onChange={(e) => setFilterByStatus(e.target.value as string)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateFilter}
                label="Date Range"
                onChange={(e) => setDateFilter(e.target.value as string)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="lastWeek">Last 7 Days</MenuItem>
                <MenuItem value="lastMonth">Last 30 Days</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value as string)}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="orderId">Order ID</MenuItem>
                <MenuItem value="totalPrice">Total Price</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="customer">Customer Name</MenuItem>
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
            {filterByStatus !== "all" && (
              <Chip
                label={`Status: ${
                  filterByStatus.charAt(0).toUpperCase() +
                  filterByStatus.slice(1)
                }`}
                onDelete={() => setFilterByStatus("all")}
                color={
                  getStatusColor(filterByStatus) as
                    | "success"
                    | "info"
                    | "warning"
                    | "primary"
                    | "error"
                    | "default"
                }
                size="small"
              />
            )}
            {dateFilter !== "all" && (
              <Chip
                label={`Date: ${
                  dateFilter === "today"
                    ? "Today"
                    : dateFilter === "yesterday"
                    ? "Yesterday"
                    : dateFilter === "lastWeek"
                    ? "Last 7 Days"
                    : "Last 30 Days"
                }`}
                onDelete={() => setDateFilter("all")}
                color="primary"
                size="small"
              />
            )}
            <Chip
              label={`Sort: ${
                sortField === "date"
                  ? "Date"
                  : sortField === "orderId"
                  ? "Order ID"
                  : sortField === "totalPrice"
                  ? "Total Price"
                  : sortField === "status"
                  ? "Status"
                  : "Customer"
              } (${sortDirection === "asc" ? "A-Z" : "Z-A"})`}
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
          placeholder="Search orders by ID, username, email or status..."
          value={searchTerm}
          onChange={handleSearch}
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
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedOrders.length > 0 &&
                      selectedOrders.length < filteredAndSortedOrders.length
                    }
                    checked={selectAll}
                    onChange={handleSelectAllToggle}
                    disabled={filteredAndSortedOrders.length === 0}
                  />
                </TableCell>
                <TableCell />
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Order ID
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("orderId")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={sortField === "orderId" ? "primary" : "disabled"}
                        sx={{
                          transform:
                            sortField === "orderId" && sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Date
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("date")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={sortField === "date" ? "primary" : "disabled"}
                        sx={{
                          transform:
                            sortField === "date" && sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Total Price ($)
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("totalPrice")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={
                          sortField === "totalPrice" ? "primary" : "disabled"
                        }
                        sx={{
                          transform:
                            sortField === "totalPrice" &&
                            sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Status
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("status")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={sortField === "status" ? "primary" : "disabled"}
                        sx={{
                          transform:
                            sortField === "status" && sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Customer
                    <IconButton
                      size="small"
                      onClick={() => handleSortChange("customer")}
                    >
                      <SortIcon
                        fontSize="small"
                        color={
                          sortField === "customer" ? "primary" : "disabled"
                        }
                        sx={{
                          transform:
                            sortField === "customer" && sortDirection === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleOrderSelect(order.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleOrderExpand(order.id)}
                          >
                            {expandedOrderId === order.id ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)
                            }
                            color={
                              getStatusColor(order.status) as
                                | "success"
                                | "info"
                                | "warning"
                                | "primary"
                                | "error"
                                | "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={order.user.avatar || ""}
                              alt={order.user.username}
                              sx={{ mr: 1, width: 32, height: 32 }}
                            >
                              {order.user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            {order.user.username}
                          </Box>
                        </TableCell>
                        <TableCell>{order.user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${order.products.length} item(s)`}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(order.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={10}
                        >
                          <Collapse
                            in={expandedOrderId === order.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 2 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                Order Details
                              </Typography>
                              <Table size="small" aria-label="order details">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Price at Purchase</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Subtotal</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {order.products.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.product.name}</TableCell>
                                      <TableCell>
                                        {item.product.image && (
                                          <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            style={{
                                              width: "50px",
                                              height: "50px",
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
                                      <TableCell>
                                        ${item.priceAtPurchase.toFixed(2)}
                                      </TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>
                                        $
                                        {(
                                          item.priceAtPurchase * item.quantity
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
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
          count={filteredAndSortedOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Order"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you sure want to delete this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteOrder} color="error" autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onClose={handleBulkDeleteCancel}>
        <DialogTitle>Delete Multiple Orders</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you sure want to delete {selectedOrders.length} selected orders?
          </DialogContentText>
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBulkDelete} color="error" autoFocus>
            Yes, Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardOrders;
