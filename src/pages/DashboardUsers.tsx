import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Skeleton,
  Chip,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  Divider,
  TablePagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  DeleteSweep as DeleteMultipleIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { useDashboardStore, User } from "../lib/store";

const DashboardUsers = () => {
  const { users, deleteUser } = useDashboardStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // New states for enhanced filtering, sorting and bulk actions
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterByRole, setFilterByRole] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterByRole, sortField, sortDirection]);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleUserSelect = (id: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(id)) {
        // Deselect
        const newSelected = prev.filter((userId) => userId !== id);
        // Update selectAll state
        if (newSelected.length === 0) {
          setSelectAll(false);
        }
        return newSelected;
      } else {
        // Select
        const newSelected = [...prev, id];
        // Update selectAll state if all visible items are selected
        if (newSelected.length === filteredUsers.length) {
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
    if (selectedUsers.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteDialogOpen(false);
  };

  const handleBulkDelete = () => {
    // Delete all selected users
    selectedUsers.forEach((id) => {
      deleteUser(id);
    });
    setSelectedUsers([]);
    setSelectAll(false);
    setBulkDeleteDialogOpen(false);
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fullName &&
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Role filter
    const matchesRole =
      filterByRole === "all" || user.roles.includes(filterByRole);

    return matchesSearch && matchesRole;
  });

  // Apply sorting to filtered users
  const filteredAndSortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;

    // Apply sorting based on selected field
    if (sortField === "id") {
      comparison = a.id.localeCompare(b.id);
    } else if (sortField === "username") {
      comparison = a.username.localeCompare(b.username);
    } else if (sortField === "email") {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === "fullName") {
      const nameA = a.fullName || "";
      const nameB = b.fullName || "";
      comparison = nameA.localeCompare(nameB);
    }

    // Apply direction
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedUsers(filteredAndSortedUsers.map((user) => user.id));
    } else if (selectedUsers.length === filteredAndSortedUsers.length) {
      // This condition helps prevent unnecessary state updates
      setSelectedUsers([]);
    }
  }, [selectAll, filteredAndSortedUsers]);

  // Handle delete dialog
  const handleOpenDeleteDialog = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      handleCloseDeleteDialog();
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>

        <Skeleton
          variant="rectangular"
          width="100%"
          height={56}
          sx={{ mb: 2 }}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Skeleton variant="rectangular" width={20} height={20} />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Roles</TableCell>
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
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        sx={{ mr: 1 }}
                      />
                      <Skeleton variant="text" width={100} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Skeleton variant="rectangular" width={64} height={30} />
                      <Skeleton variant="rectangular" width={64} height={30} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h2" fontWeight="bold">
          Users Management
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {selectedUsers.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteMultipleIcon />}
              onClick={openBulkDeleteDialog}
            >
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button variant="contained" color="primary">
            Add User
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
              <InputLabel>Role</InputLabel>
              <Select
                value={filterByRole}
                label="Role"
                onChange={(e) => setFilterByRole(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="username">Username</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="fullName">Full Name</MenuItem>
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
            {filterByRole !== "all" && (
              <Chip
                label={`Role: ${
                  filterByRole.charAt(0).toUpperCase() + filterByRole.slice(1)
                }`}
                onDelete={() => setFilterByRole("all")}
                color={
                  filterByRole === "admin"
                    ? "error"
                    : filterByRole === "editor"
                    ? "warning"
                    : "default"
                }
                size="small"
              />
            )}
            <Chip
              label={`Sort: ${
                sortField === "id"
                  ? "ID"
                  : sortField === "username"
                  ? "Username"
                  : sortField === "email"
                  ? "Email"
                  : "Full Name"
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
          placeholder="Search users by username, email or full name..."
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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < filteredAndSortedUsers.length
                  }
                  checked={selectAll}
                  onChange={handleSelectAllToggle}
                  disabled={filteredAndSortedUsers.length === 0}
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
                  Username
                  <IconButton
                    size="small"
                    onClick={() => handleSortChange("username")}
                  >
                    <SortIcon
                      fontSize="small"
                      color={sortField === "username" ? "primary" : "disabled"}
                      sx={{
                        transform:
                          sortField === "username" && sortDirection === "desc"
                            ? "rotate(180deg)"
                            : "none",
                      }}
                    />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Email
                  <IconButton
                    size="small"
                    onClick={() => handleSortChange("email")}
                  >
                    <SortIcon
                      fontSize="small"
                      color={sortField === "email" ? "primary" : "disabled"}
                      sx={{
                        transform:
                          sortField === "email" && sortDirection === "desc"
                            ? "rotate(180deg)"
                            : "none",
                      }}
                    />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Full Name
                  <IconButton
                    size="small"
                    onClick={() => handleSortChange("fullName")}
                  >
                    <SortIcon
                      fontSize="small"
                      color={sortField === "fullName" ? "primary" : "disabled"}
                      sx={{
                        transform:
                          sortField === "fullName" && sortDirection === "desc"
                            ? "rotate(180deg)"
                            : "none",
                      }}
                    />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                      />
                    </TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={user.avatar || undefined}
                          alt={user.username}
                          sx={{ mr: 1, width: 32, height: 32 }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        {user.username}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.fullName || "N/A"}</TableCell>
                    <TableCell>
                      {user.roles.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          size="small"
                          color={
                            role === "admin"
                              ? "error"
                              : role === "editor"
                              ? "warning"
                              : "default"
                          }
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(user.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you sure want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={handleBulkDeleteCancel}
        aria-labelledby="bulk-delete-dialog-title"
        aria-describedby="bulk-delete-dialog-description"
      >
        <DialogTitle id="bulk-delete-dialog-title">
          {"Delete Multiple Users"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="bulk-delete-dialog-description">
            Do you sure want to delete {selectedUsers.length} selected users?
            This action cannot be undone.
          </DialogContentText>
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

export default DashboardUsers;
