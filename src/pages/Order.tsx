import { useEffect, useState } from "react";
import { store } from "../lib/store";
import Container from "../ui/Container";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Loading from "../ui/Loading";

// Mock order data for demo
const mockOrders = [
  {
    paymentId: "payment_" + Date.now() + "_1",
    orderItem: [
      {
        _id: 2001,
        id: "2001",
        name: "Divoom Tivoo Portable Bluetooth Speaker",
        images: [
          "https://locomocean.com/cdn/shop/products/5aa8977931512.png?v=1613208600",
        ],
        description:
          "Smart Clock Alarm Pixel Art DIY By App LED Light Sign In Decoration Unique Gift",
        regularPrice: 600,
        discountedPrice: 580,
        quantity: 2,
        rating: 4.5,
        reviews: 50,
        category: "TV & Audio",
        colors: ["red", "blue", "green", "yellow", "black", "white"],
        brand: "Samsung",
        isStock: true,
        overView: "Bluetooth Speaker",
        isNew: true,
        _base: "tvAndAudio",
      },
    ],
    status: "Delivered",
    paymentMethod: "Credit Card",
    date: "2023-12-15",
  },
  {
    paymentId: "payment_" + Date.now() + "_2",
    orderItem: [
      {
        _id: 2002,
        id: "2002",
        name: "Xiaomi Mi Watch Lite",
        images: [
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/0/0/000_mi_watch_lite_1__1_1_1.jpg",
        ],
        description:
          "GPS Bluetooth 5.1 Smart Watch Sports Fitness Heart Rate Monitor 1.4 Inch TFTLCD Screen 5 ATM Waterproof Mi Band",
        regularPrice: 250,
        discountedPrice: 180,
        quantity: 1,
        rating: 4.8,
        reviews: 80,
        category: "Smart Watches",
        colors: ["red", "blue", "green", "yellow", "black", "white"],
        brand: "Xiaomi",
        isStock: true,
        overView: "Smart health watch",
        isNew: false,
        _base: "smartWatches",
      },
    ],
    status: "Processing",
    paymentMethod: "PayPal",
    date: "2024-01-20",
  },
  {
    paymentId: "payment_" + Date.now() + "_3",
    orderItem: [
      {
        _id: 2001,
        id: "2001",
        name: "Divoom Tivoo Portable Bluetooth Speaker",
        images: [
          "https://locomocean.com/cdn/shop/products/5aa8977931512.png?v=1613208600",
        ],
        description:
          "Smart Clock Alarm Pixel Art DIY By App LED Light Sign In Decoration Unique Gift",
        regularPrice: 600,
        discountedPrice: 580,
        quantity: 1,
        rating: 4.5,
        reviews: 50,
        category: "TV & Audio",
        colors: ["red", "blue", "green", "yellow", "black", "white"],
        brand: "Samsung",
        isStock: true,
        overView: "Bluetooth Speaker",
        isNew: true,
        _base: "tvAndAudio",
      },
      {
        _id: 2002,
        id: "2002",
        name: "Xiaomi Mi Watch Lite",
        images: [
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/0/0/000_mi_watch_lite_1__1_1_1.jpg",
        ],
        description:
          "GPS Bluetooth 5.1 Smart Watch Sports Fitness Heart Rate Monitor 1.4 Inch TFTLCD Screen 5 ATM Waterproof Mi Band",
        regularPrice: 250,
        discountedPrice: 180,
        quantity: 2,
        rating: 4.8,
        reviews: 80,
        category: "Smart Watches",
        colors: ["red", "blue", "green", "yellow", "black", "white"],
        brand: "Xiaomi",
        isStock: true,
        overView: "Smart health watch",
        isNew: false,
        _base: "smartWatches",
      },
    ],
    status: "Shipped",
    paymentMethod: "MoMo",
    date: "2024-02-05",
  },
];

const totalPayment = (order: any) => {
  return order.reduce(
    (accum: number, item: any) => accum + item.discountedPrice * item.quantity,
    0
  );
};

const Order = () => {
  const { currentUser } = store();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("date-desc");

  useEffect(() => {
    setLoading(true);

    // Mock fetching orders instead of Firebase
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 0);
  }, []);

  useEffect(() => {
    // Apply filters and search when dependencies change
    let result = [...orders];

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderItem.some(
            (item: any) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    if (sortOption === "date-asc") {
      result = result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (sortOption === "date-desc") {
      result = result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortOption === "price-asc") {
      result = result.sort(
        (a, b) => totalPayment(a.orderItem) - totalPayment(b.orderItem)
      );
    } else if (sortOption === "price-desc") {
      result = result.sort(
        (a, b) => totalPayment(b.orderItem) - totalPayment(a.orderItem)
      );
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, sortOption]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get user display name
  const userName = currentUser
    ? `${currentUser.lastName} ${currentUser.firstName}`
    : "Demo User";

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container className="">
          <div className="flex flex-col px-4 md:px-12">
            <h2 className="font-bold text-2xl">Customer Order History</h2>
            <span className="text-gray-500">
              Customer name: <span className="text-black">{userName}</span>
            </span>
            <span className="text-gray-500 mb-4">
              Total orders:{" "}
              <span className="text-black">{filteredOrders.length}</span>
            </span>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-100 p-4 rounded-lg">
              <div className="flex flex-1 items-center relative">
                <FaSearch className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by product, brand, or ID..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={handleStatusFilter}
                >
                  <option value="all">All Statuses</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {sortOption.includes("-desc") ? (
                  <FaSortAmountDown className="text-gray-500" />
                ) : (
                  <FaSortAmountUp className="text-gray-500" />
                )}
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={sortOption}
                  onChange={handleSort}
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="price-asc">Price (Low to High)</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-lg text-gray-600">
                  No orders match your search criteria
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-y-5 divide-y-2 divide-gray-300">
                {filteredOrders.map((item, index) => (
                  <div key={item.paymentId}>
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <DisclosureButton className="group flex flex-col md:flex-row md:items-center justify-between pt-3 w-full">
                            <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-left">
                              <span className="text-gray-500">
                                Order ID:{" "}
                                <span className="text-black font-bold">
                                  {item?.paymentId.substring(0, 15)}...
                                </span>
                              </span>
                              <span className="text-gray-500">
                                Date:{" "}
                                <span className="text-black">
                                  {formatDate(item.date)}
                                </span>
                              </span>
                              <span className="text-gray-500">
                                Status:{" "}
                                <span
                                  className={`font-semibold ${
                                    item.status === "Delivered"
                                      ? "text-green-600"
                                      : item.status === "Shipped"
                                      ? "text-blue-600"
                                      : "text-orange-500"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-blue-600">
                                ${totalPayment(item.orderItem).toFixed(2)}
                              </span>
                              <FaPlus
                                className={`w-5 transition-transform duration-200 ${
                                  open ? "rotate-45" : ""
                                }`}
                              />
                            </div>
                          </DisclosureButton>

                          <DisclosurePanel>
                            <div className="mt-4 bg-gray-100 border border-gray-200 p-4 rounded-md flex flex-col">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <span className="font-bold">
                                    Order Details
                                  </span>
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-600">
                                      Order ID:{" "}
                                      <span className="text-black">
                                        {item.paymentId}
                                      </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Date:{" "}
                                      <span className="text-black">
                                        {formatDate(item.date)}
                                      </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Payment Method:{" "}
                                      <span className="text-black">
                                        {item.paymentMethod}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-bold">
                                    Order Summary
                                  </span>
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-600">
                                      Status:{" "}
                                      <span
                                        className={`font-semibold ${
                                          item.status === "Delivered"
                                            ? "text-green-600"
                                            : item.status === "Shipped"
                                            ? "text-blue-600"
                                            : "text-orange-500"
                                        }`}
                                      >
                                        {item.status}
                                      </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Items:{" "}
                                      <span className="text-black">
                                        {item.orderItem.length}
                                      </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Total:{" "}
                                      <span className="text-black font-semibold">
                                        $
                                        {totalPayment(item.orderItem).toFixed(
                                          2
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <span className="font-bold mb-3">Items</span>
                              <div className="flex flex-col gap-y-4 divide-y divide-gray-200">
                                {item.orderItem.map(
                                  (product: any, productIndex: number) => (
                                    <div
                                      key={`${product._id}-${productIndex}`}
                                      className="flex flex-col md:flex-row py-4 gap-4"
                                    >
                                      <Link
                                        to={`/product/detail/${product.id}`}
                                        className="p-2 bg-white border border-gray-200 rounded-md hover:border-blue-500 transition-colors"
                                      >
                                        <img
                                          className="w-24 h-24 object-contain cursor-pointer"
                                          src={product.images[0]}
                                          alt={product.name}
                                        />
                                      </Link>
                                      <div className="flex-1">
                                        <h3 className="font-medium">
                                          {product.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                          {product.description}
                                        </p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm">
                                          <span className="px-2 py-1 bg-gray-200 rounded-md">
                                            Quantity: {product.quantity}
                                          </span>
                                          <span className="px-2 py-1 bg-gray-200 rounded-md">
                                            Price: $
                                            {product.discountedPrice.toFixed(2)}
                                          </span>
                                          <span className="px-2 py-1 bg-gray-200 rounded-md">
                                            Total: $
                                            {(
                                              product.discountedPrice *
                                              product.quantity
                                            ).toFixed(2)}
                                          </span>
                                          <span className="px-2 py-1 bg-gray-200 rounded-md">
                                            {product.category}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      )}
    </>
  );
};

export default Order;
