import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Chip,
  Collapse,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { FilterAlt, Sort, Refresh } from "@mui/icons-material";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const theme = useTheme();

  // Filter and sort states
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("sales");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Mock data for summary cards
  const summaryData = {
    totalSales: "$24,680",
    salesGrowth: "+15%",
    orders: "384",
    ordersGrowth: "+12%",
    customers: "1,254",
    customersGrowth: "+5%",
    products: "85",
    productsGrowth: "+3",
  };

  // All available categories
  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];

  // All available months for data
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Original data
  const originalSalesData = [
    4000, 3000, 2000, 2780, 1890, 2390, 3490, 4000, 3200, 2800, 3300, 5000,
  ];

  const originalCategoryData = [400, 300, 200, 150, 100];

  const originalTopProductsData = {
    labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
    data: [120, 98, 86, 72, 65],
    categories: ["Electronics", "Clothing", "Electronics", "Home", "Sports"],
  };

  // State for the filtered data
  const [filteredSalesData, setFilteredSalesData] = useState([
    ...originalSalesData,
  ]);
  const [filteredCategoryData, setFilteredCategoryData] = useState([
    ...originalCategoryData,
  ]);
  const [filteredTopProductsData, setFilteredTopProductsData] = useState({
    labels: [...originalTopProductsData.labels],
    data: [...originalTopProductsData.data],
  });

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [dateRange, selectedCategory, sortBy]);

  // Function to apply filters and sorting
  const applyFiltersAndSort = () => {
    // Filter by date range
    let filteredSales = [...originalSalesData];

    if (dateRange === "last3months") {
      // Last 3 months (assuming current month is December)
      filteredSales = originalSalesData.map((value, index) => {
        return index >= 9 && index <= 11 ? value : 0; // Oct, Nov, Dec
      });
    } else if (dateRange === "last6months") {
      // Last 6 months
      filteredSales = originalSalesData.map((value, index) => {
        return index >= 6 && index <= 11 ? value : 0; // Jul-Dec
      });
    } else if (dateRange === "firsthalf") {
      // First half of year
      filteredSales = originalSalesData.map((value, index) => {
        return index >= 0 && index <= 5 ? value : 0; // Jan-Jun
      });
    } else if (dateRange === "secondhalf") {
      // Second half of year
      filteredSales = originalSalesData.map((value, index) => {
        return index >= 6 && index <= 11 ? value : 0; // Jul-Dec
      });
    }

    setFilteredSalesData(filteredSales);

    // Filter category data based on selected category
    let newCategoryData = [...originalCategoryData];
    if (selectedCategory !== "all") {
      const categoryIndex = categories.indexOf(selectedCategory);
      newCategoryData = originalCategoryData.map((value, index) => {
        return index === categoryIndex ? value : 0;
      });
    }
    setFilteredCategoryData(newCategoryData);

    // Filter and sort top products
    let filteredProducts = originalTopProductsData.labels.map(
      (label, index) => ({
        label,
        data: originalTopProductsData.data[index],
        category: originalTopProductsData.categories[index],
      })
    );

    // Filter by category if needed
    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort products
    if (sortBy === "sales") {
      filteredProducts.sort((a, b) => b.data - a.data);
    } else if (sortBy === "name") {
      filteredProducts.sort((a, b) => a.label.localeCompare(b.label));
    }

    // Update the filtered products data
    setFilteredTopProductsData({
      labels: filteredProducts.map((p) => p.label),
      data: filteredProducts.map((p) => p.data),
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setDateRange("all");
    setSelectedCategory("all");
    setSortBy("sales");
  };

  // Monthly sales data with filtered data
  const monthlySalesData = {
    labels: months,
    datasets: [
      {
        label: "Sales",
        data: filteredSalesData,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + "33",
        fill: true,
      },
    ],
  };

  // Category data with filtered data
  const categoryData = {
    labels: categories,
    datasets: [
      {
        data: filteredCategoryData,
        backgroundColor: [
          "#0088FE",
          "#00C49F",
          "#FFBB28",
          "#FF8042",
          "#8884d8",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Top products data with filtered and sorted data
  const topProductsData = {
    labels: filteredTopProductsData.labels,
    datasets: [
      {
        label: "Sales",
        data: filteredTopProductsData.data,
        backgroundColor: theme.palette.secondary.main,
      },
    ],
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  // Get display text for date range
  const getDateRangeText = () => {
    switch (dateRange) {
      case "last3months":
        return "Last 3 Months";
      case "last6months":
        return "Last 6 Months";
      case "firsthalf":
        return "First Half of Year";
      case "secondhalf":
        return "Second Half of Year";
      default:
        return "All Time";
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Dashboard</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            sx={{ mr: 1 }}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={resetFilters}
          >
            Reset
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Collapse in={isFilterVisible}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters & Sorting
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <FormControl fullWidth sx={{ flex: 1 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value as string)}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="last3months">Last 3 Months</MenuItem>
                <MenuItem value="last6months">Last 6 Months</MenuItem>
                <MenuItem value="firsthalf">First Half of Year</MenuItem>
                <MenuItem value="secondhalf">Second Half of Year</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ flex: 1 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value as string)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ flex: 1 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as string)}
              >
                <MenuItem value="sales">Sales (High to Low)</MenuItem>
                <MenuItem value="name">Name (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Active filters display */}
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ mr: 1 }}>
              Active Filters:
            </Typography>
            {dateRange !== "all" && (
              <Chip
                label={`Date: ${getDateRangeText()}`}
                size="small"
                onDelete={() => setDateRange("all")}
              />
            )}
            {selectedCategory !== "all" && (
              <Chip
                label={`Category: ${selectedCategory}`}
                size="small"
                onDelete={() => setSelectedCategory("all")}
              />
            )}
            <Chip
              label={`Sort: ${
                sortBy === "sales" ? "Sales (High to Low)" : "Name (A-Z)"
              }`}
              size="small"
              onDelete={() => setSortBy("sales")}
            />
          </Box>
        </Paper>
      </Collapse>

      {/* Summary Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        {/* Sales Overview Card */}
        <Card sx={{ flex: 1 }}>
          <CardHeader title="Total Sales" />
          <Divider />
          <CardContent>
            <Typography variant="h3">{summaryData.totalSales}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {summaryData.salesGrowth} from last month
            </Typography>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card sx={{ flex: 1 }}>
          <CardHeader title="Orders" />
          <Divider />
          <CardContent>
            <Typography variant="h3">{summaryData.orders}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {summaryData.ordersGrowth} from last month
            </Typography>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card sx={{ flex: 1 }}>
          <CardHeader title="Customers" />
          <Divider />
          <CardContent>
            <Typography variant="h3">{summaryData.customers}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {summaryData.customersGrowth} from last month
            </Typography>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card sx={{ flex: 1 }}>
          <CardHeader title="Products" />
          <Divider />
          <CardContent>
            <Typography variant="h3">{summaryData.products}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {summaryData.productsGrowth} new this month
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Charts */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        {/* Monthly Sales Chart */}
        <Paper sx={{ p: 2, height: 400, flex: 2 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Sales
            {dateRange !== "all" && (
              <Chip
                label={getDateRangeText()}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
            {selectedCategory !== "all" && (
              <Chip
                label={selectedCategory}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Box sx={{ height: "90%", position: "relative" }}>
            <Line options={lineOptions} data={monthlySalesData} />
          </Box>
        </Paper>

        {/* Product Categories Chart */}
        <Paper sx={{ p: 2, height: 400, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Product Categories
            {selectedCategory !== "all" && (
              <Chip
                label={selectedCategory}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Box sx={{ height: "90%", position: "relative" }}>
            <Pie options={pieOptions} data={categoryData} />
          </Box>
        </Paper>
      </Stack>

      {/* Top Selling Products */}
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          Top Selling Products
          {sortBy === "sales" ? (
            <Chip
              label="Sorted by Sales"
              size="small"
              color="secondary"
              icon={<Sort />}
              sx={{ ml: 1 }}
            />
          ) : (
            <Chip
              label="Sorted by Name"
              size="small"
              color="secondary"
              icon={<Sort />}
              sx={{ ml: 1 }}
            />
          )}
          {selectedCategory !== "all" && (
            <Chip
              label={selectedCategory}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        <Box sx={{ height: "90%", position: "relative" }}>
          <Bar options={barOptions} data={topProductsData} />
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
