import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ProductProps, StoreType, UserType } from "../type";

// Define Category and Product interfaces for dashboard
export interface Category {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  total: number;
  categories: Category[];
}

// Define User interface for dashboard
export interface User {
  id: string;
  avatar: string | null;
  username: string;
  email: string;
  fullName: string | null;
  dob: string | null;
  roles: string[];
}

// Define Order interfaces for dashboard
export interface OrderProduct {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  date: string;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  products: OrderProduct[];
  user: User;
}

// Mock users data
const initialUsers: User[] = [
  {
    id: "usr_001",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    username: "johndoe",
    email: "john.doe@example.com",
    fullName: "John Doe",
    dob: "1990-05-15",
    roles: ["user"],
  },
  {
    id: "usr_002",
    avatar: "https://mui.com/static/images/avatar/2.jpg",
    username: "janedoe",
    email: "jane.doe@example.com",
    fullName: "Jane Doe",
    dob: "1992-08-21",
    roles: ["user", "admin"],
  },
  {
    id: "usr_003",
    avatar: null,
    username: "bobsmith",
    email: "bob.smith@example.com",
    fullName: "Bob Smith",
    dob: "1985-11-30",
    roles: ["user"],
  },
  {
    id: "usr_004",
    avatar: "https://mui.com/static/images/avatar/3.jpg",
    username: "alicejones",
    email: "alice.jones@example.com",
    fullName: "Alice Jones",
    dob: "1988-02-14",
    roles: ["user"],
  },
  {
    id: "usr_005",
    avatar: "https://mui.com/static/images/avatar/4.jpg",
    username: "mikebrown",
    email: "mike.brown@example.com",
    fullName: "Mike Brown",
    dob: "1995-07-08",
    roles: ["user", "editor"],
  },
  {
    id: "usr_006",
    avatar: null,
    username: "sarahwilson",
    email: "sarah.wilson@example.com",
    fullName: "Sarah Wilson",
    dob: "1991-12-03",
    roles: ["user"],
  },
  {
    id: "usr_007",
    avatar: "https://mui.com/static/images/avatar/5.jpg",
    username: "davidlee",
    email: "david.lee@example.com",
    fullName: "David Lee",
    dob: "1987-09-22",
    roles: ["user", "admin"],
  },
];

// Mock orders data
const initialOrders: Order[] = [
  {
    id: "ORD-2023-001",
    date: "2023-11-15T08:30:00Z",
    totalPrice: 1299.99,
    status: "delivered",
    products: [
      {
        product: {
          id: 5,
          name: "MacBook Air M2",
          image:
            "https://cdn.tgdd.vn/Products/Images/44/282827/apple-macbook-air-m2-2022-16gb-256gb-600x600.jpg",
          price: 1299.99,
          description: "MacBook Air với chip M2, 16GB RAM và 256GB SSD",
          total: 12,
          categories: [],
        },
        quantity: 1,
        priceAtPurchase: 1299.99,
      },
    ],
    user: initialUsers[0],
  },
  {
    id: "ORD-2023-002",
    date: "2023-11-20T14:45:00Z",
    totalPrice: 1099.99,
    status: "shipped",
    products: [
      {
        product: {
          id: 4,
          name: "iPhone 15 Pro",
          image:
            "https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-blue-thumbnew-600x600.jpg",
          price: 1099.99,
          description: "iPhone 15 Pro với chip A17 Pro và camera 48MP",
          total: 25,
          categories: [],
        },
        quantity: 1,
        priceAtPurchase: 1099.99,
      },
    ],
    user: initialUsers[1],
  },
  {
    id: "ORD-2023-003",
    date: "2023-12-01T10:15:00Z",
    totalPrice: 1349.98,
    status: "processing",
    products: [
      {
        product: {
          id: 2,
          name: "Máy giặt Samsung",
          image:
            "https://cdn.nguyenkimmall.com/images/detailed/775/10052046-may-giat-samsung-ww90tp54dsb-sv-1.jpg",
          price: 499.99,
          description: "Máy giặt Samsung 9kg với công nghệ giặt hơi nước",
          total: 10,
          categories: [],
        },
        quantity: 1,
        priceAtPurchase: 499.99,
      },
      {
        product: {
          id: 3,
          name: "Smart TV LG",
          image:
            "https://cdn.tgdd.vn/Products/Images/1942/235792/lg-55up7750ptb-2.jpg",
          price: 849.99,
          description: "Smart TV LG 55 inch 4K UHD với trí tuệ nhân tạo",
          total: 8,
          categories: [],
        },
        quantity: 1,
        priceAtPurchase: 849.99,
      },
    ],
    user: initialUsers[2],
  },
];

// Mock categories data
const initialCategories: Category[] = [
  {
    id: 1,
    name: "Tủ lạnh",
    description: "tủ lạnh nhỏ",
    products: [],
  },
  {
    id: 2,
    name: "Máy giặt",
    description: "Máy giặt hiện đại",
    products: [],
  },
  {
    id: 3,
    name: "Tivi",
    description: "Tivi xịn",
    products: [],
  },
  {
    id: 4,
    name: "Điện thoại",
    description: "Điện thoại thông minh",
    products: [],
  },
  {
    id: 5,
    name: "Laptop",
    description: "Laptop mỏng nhẹ",
    products: [],
  },
];

// Mock products data
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Tủ lạnh Xiaomi",
    image:
      "https://caothienphat.com/wp-content/uploads/2024/06/Tu-lanh-Xiaomi-Mijia-606L-768x768.jpg",
    price: 599.99,
    description: "Tủ lạnh Xiaomi Mijia 606L với công nghệ làm lạnh tiên tiến",
    total: 15,
    categories: [],
  },
  {
    id: 2,
    name: "Máy giặt Samsung",
    image:
      "https://cdn.nguyenkimmall.com/images/detailed/775/10052046-may-giat-samsung-ww90tp54dsb-sv-1.jpg",
    price: 499.99,
    description: "Máy giặt Samsung 9kg với công nghệ giặt hơi nước",
    total: 10,
    categories: [],
  },
  {
    id: 3,
    name: "Smart TV LG",
    image:
      "https://cdn.tgdd.vn/Products/Images/1942/235792/lg-55up7750ptb-2.jpg",
    price: 799.99,
    description: "Smart TV LG 55 inch 4K UHD với trí tuệ nhân tạo",
    total: 8,
    categories: [],
  },
  {
    id: 4,
    name: "iPhone 15 Pro",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-blue-thumbnew-600x600.jpg",
    price: 1099.99,
    description: "iPhone 15 Pro với chip A17 Pro và camera 48MP",
    total: 25,
    categories: [],
  },
  {
    id: 5,
    name: "MacBook Air M2",
    image:
      "https://cdn.tgdd.vn/Products/Images/44/282827/apple-macbook-air-m2-2022-16gb-256gb-600x600.jpg",
    price: 1299.99,
    description: "MacBook Air với chip M2, 16GB RAM và 256GB SSD",
    total: 12,
    categories: [],
  },
  {
    id: 6,
    name: "Tủ lạnh Samsung",
    image:
      "https://cdn.tgdd.vn/Products/Images/1943/238016/samsung-rs64r53012c-sv-12-300x300.jpg",
    price: 699.99,
    description: "Tủ lạnh Samsung Side by Side 617L với ngăn đá phía dưới",
    total: 7,
    categories: [],
  },
  {
    id: 7,
    name: "Smart TV Samsung",
    image:
      "https://cdn.tgdd.vn/Products/Images/1942/235642/samsung-ua50au9000-1.jpg",
    price: 549.99,
    description: "Smart TV Samsung 50 inch 4K UHD với công nghệ HDR",
    total: 14,
    categories: [],
  },
  {
    id: 8,
    name: "iPad Pro M2",
    image:
      "https://cdn.tgdd.vn/Products/Images/522/294103/ipad-pro-m2-11-inch-wifi-cellular-xam-thumb-600x600.jpg",
    price: 899.99,
    description: "iPad Pro 11 inch với chip M2, màn hình Liquid Retina",
    total: 18,
    categories: [],
  },
];

// Initialize product-category relationships
initialProducts[0].categories = [initialCategories[0]]; // Tủ lạnh Xiaomi -> Tủ lạnh
initialProducts[1].categories = [initialCategories[1]]; // Máy giặt Samsung -> Máy giặt
initialProducts[2].categories = [initialCategories[2]]; // Smart TV LG -> Tivi
initialProducts[3].categories = [initialCategories[3]]; // iPhone 15 Pro -> Điện thoại
initialProducts[4].categories = [initialCategories[4]]; // MacBook Air M2 -> Laptop
initialProducts[5].categories = [initialCategories[0]]; // Tủ lạnh Samsung -> Tủ lạnh
initialProducts[6].categories = [initialCategories[2]]; // Smart TV Samsung -> Tivi
initialProducts[7].categories = [initialCategories[3], initialCategories[4]]; // iPad Pro M2 -> Điện thoại, Laptop

// Initialize category products
initialCategories[0].products = [initialProducts[0], initialProducts[5]]; // Tủ lạnh
initialCategories[1].products = [initialProducts[1]]; // Máy giặt
initialCategories[2].products = [initialProducts[2], initialProducts[6]]; // Tivi
initialCategories[3].products = [initialProducts[3], initialProducts[7]]; // Điện thoại
initialCategories[4].products = [initialProducts[4], initialProducts[7]]; // Laptop

// Define the dashboard state interface
interface DashboardState {
  products: Product[];
  categories: Category[];
  users: User[];
  orders: Order[];
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  isLoadingUsers: boolean;
  isLoadingOrders: boolean;

  // Product actions
  setProducts: (products: Product[]) => void;
  addProduct: (
    product: Omit<Product, "id" | "categories">,
    categoryIds: number[]
  ) => void;
  updateProduct: (
    id: number,
    product: Partial<Product>,
    categoryIds: number[]
  ) => void;
  deleteProduct: (id: number) => void;

  // Category actions
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Omit<Category, "id" | "products">) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteCategory: (id: number) => void;

  // User actions
  setUsers: (users: User[]) => void;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Order actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
}

// Create dashboard store
export const useDashboardStore = create<DashboardState>()((set, get) => ({
  products: initialProducts,
  categories: initialCategories,
  users: initialUsers,
  orders: initialOrders,
  isLoadingProducts: false,
  isLoadingCategories: false,
  isLoadingUsers: false,
  isLoadingOrders: false,

  // Product actions
  setProducts: (products) => set({ products }),

  addProduct: (productData, categoryIds) => {
    const { products, categories } = get();

    // Create new product with ID
    const newProduct: Product = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      ...productData,
      categories: [],
    };

    // Add selected categories to product
    const selectedCategories = categories.filter((cat) =>
      categoryIds.includes(cat.id)
    );
    newProduct.categories = selectedCategories;

    // Add product to store
    const updatedProducts = [...products, newProduct];

    // Update categories to include this product
    const updatedCategories = categories.map((category) => {
      if (categoryIds.includes(category.id)) {
        return {
          ...category,
          products: [...category.products, newProduct],
        };
      }
      return category;
    });

    set({
      products: updatedProducts,
      categories: updatedCategories,
    });
  },

  updateProduct: (id, productData, categoryIds) => {
    const { products, categories } = get();

    // Find product to update
    const productToUpdate = products.find((p) => p.id === id);
    if (!productToUpdate) return;

    // Get selected categories
    const selectedCategories = categories.filter((cat) =>
      categoryIds.includes(cat.id)
    );

    // Update product
    const updatedProduct = {
      ...productToUpdate,
      ...productData,
      categories: selectedCategories,
    };

    // Update products list
    const updatedProducts = products.map((p) =>
      p.id === id ? updatedProduct : p
    );

    // Update categories to reflect product changes
    const updatedCategories = categories.map((category) => {
      // If category should contain this product
      if (categoryIds.includes(category.id)) {
        // If product is already in category, replace it
        if (category.products.some((p) => p.id === id)) {
          return {
            ...category,
            products: category.products.map((p) =>
              p.id === id ? updatedProduct : p
            ),
          };
        }
        // Otherwise add it
        else {
          return {
            ...category,
            products: [...category.products, updatedProduct],
          };
        }
      }
      // If category should not contain this product, remove it
      else if (category.products.some((p) => p.id === id)) {
        return {
          ...category,
          products: category.products.filter((p) => p.id !== id),
        };
      }
      return category;
    });

    set({
      products: updatedProducts,
      categories: updatedCategories,
    });
  },

  deleteProduct: (id) => {
    const { products, categories } = get();

    // Remove product from products list
    const updatedProducts = products.filter((p) => p.id !== id);

    // Remove product from all categories
    const updatedCategories = categories.map((category) => ({
      ...category,
      products: category.products.filter((p) => p.id !== id),
    }));

    set({
      products: updatedProducts,
      categories: updatedCategories,
    });
  },

  // Category actions
  setCategories: (categories) => set({ categories }),

  addCategory: (categoryData) => {
    const { categories } = get();

    // Create new category with ID
    const newCategory: Category = {
      id:
        categories.length > 0
          ? Math.max(...categories.map((c) => c.id)) + 1
          : 1,
      ...categoryData,
      products: [],
    };

    // Add category to store
    set({ categories: [...categories, newCategory] });
  },

  updateCategory: (id, categoryData) => {
    const { categories } = get();

    // Update category
    const updatedCategories = categories.map((category) => {
      if (category.id === id) {
        return {
          ...category,
          ...categoryData,
        };
      }
      return category;
    });

    set({ categories: updatedCategories });
  },

  deleteCategory: (id) => {
    const { categories, products } = get();

    // Remove category from categories list
    const updatedCategories = categories.filter((c) => c.id !== id);

    // Remove category from all products
    const updatedProducts = products.map((product) => ({
      ...product,
      categories: product.categories.filter((c) => c.id !== id),
    }));

    set({
      categories: updatedCategories,
      products: updatedProducts,
    });
  },

  // User actions
  setUsers: (users) => set({ users }),

  addUser: (userData) => {
    const { users } = get();

    // Generate a unique ID
    const newId = `usr_${String(users.length + 1).padStart(3, "0")}`;

    // Create new user with ID
    const newUser: User = {
      id: newId,
      ...userData,
    };

    // Add user to store
    set({ users: [...users, newUser] });
  },

  updateUser: (id, userData) => {
    const { users } = get();

    // Update user
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          ...userData,
        };
      }
      return user;
    });

    set({ users: updatedUsers });
  },

  deleteUser: (id) => {
    const { users, orders } = get();

    // Remove user from users list
    const updatedUsers = users.filter((user) => user.id !== id);

    // Update orders that reference this user
    // In a real app, you might want to handle this differently
    const updatedOrders = orders.filter((order) => order.user.id !== id);

    set({
      users: updatedUsers,
      orders: updatedOrders,
    });
  },

  // Order actions
  setOrders: (orders) => set({ orders }),

  addOrder: (orderData) => {
    const { orders } = get();

    // Generate a unique ID
    const orderNumber = orders.length + 1;
    const year = new Date().getFullYear();
    const newId = `ORD-${year}-${String(orderNumber).padStart(3, "0")}`;

    // Create new order with ID
    const newOrder: Order = {
      id: newId,
      ...orderData,
    };

    // Add order to store
    set({ orders: [...orders, newOrder] });
  },

  updateOrder: (id, orderData) => {
    const { orders } = get();

    // Update order
    const updatedOrders = orders.map((order) => {
      if (order.id === id) {
        return {
          ...order,
          ...orderData,
        };
      }
      return order;
    });

    set({ orders: updatedOrders });
  },

  deleteOrder: (id) => {
    const { orders } = get();

    // Remove order from orders list
    const updatedOrders = orders.filter((order) => order.id !== id);

    set({ orders: updatedOrders });
  },
}));

const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },

  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const store = create<StoreType>()(
  persist(
    (set) => ({
      currentUser: {
        id: "default_user_123",
        email: "demo@meowsolutions.com",
        firstName: "Demo",
        lastName: "User",
        avatar: "https://i.pravatar.cc/150?u=demo@meowsolutions.com",
      },
      isLoading: true,
      cartProduct: [],
      favoriteProduct: [],

      getUserInfo: async (uid: any) => {
        if (!uid)
          return set({
            currentUser: null,
            isLoading: false,
          });
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        try {
          if (docSnap.exists()) {
            set({
              currentUser: docSnap.data() as UserType,
              isLoading: false,
            });
          } else {
          }
        } catch (error) {
          console.log(error);
          set({
            currentUser: null,
            isLoading: false,
          });
        }
      },

      addToCart: async (product: ProductProps) => {
        set((state: StoreType) => {
          const existProduct = state.cartProduct.find(
            (p) => p._id == product._id
          );
          if (existProduct) {
            return {
              cartProduct: state.cartProduct.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cartProduct: [...state.cartProduct, { ...product, quantity: 1 }],
            };
          }
        });
      },

      decreaseQuantity: (producId: number) => {
        set((state: StoreType) => {
          return {
            cartProduct: state.cartProduct.map((item) =>
              item._id === producId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          };
        });
      },

      removeFromCart: (producId: number) => {
        set((state: StoreType) => {
          return {
            cartProduct: state.cartProduct.filter(
              (item) => item._id !== producId
            ),
          };
        });
      },

      resetCart: () => {
        set({ cartProduct: [] });
      },

      addToFavorite: (product: ProductProps) => {
        set((state: StoreType) => {
          const isInFavorite = state.favoriteProduct.find(
            (item) => item._id === product._id
          );
          return {
            favoriteProduct: isInFavorite
              ? state.favoriteProduct.filter((item) => item._id != product._id)
              : [...state.favoriteProduct, { ...product }],
          };
        });
      },

      removeFromfavorite: (producId: number) => {
        set((state: StoreType) => {
          const isInFavorite = state.favoriteProduct.find(
            (item) => item._id === producId
          );
          if (isInFavorite) {
            return {
              favoriteProduct: state.favoriteProduct.filter(
                (item) => item._id === producId
              ),
            };
          } else {
            return { favoriteProduct: state.favoriteProduct };
          }
        });
      },

      resetfavorite: () => {
        set({ favoriteProduct: [] });
      },

      updateUserInfo: (userData: Partial<UserType>) => {
        set((prevState) => ({
          currentUser: { ...(prevState.currentUser as UserType), ...userData },
        }));
      },
    }),
    {
      name: "store",
      storage: customStorage,
    }
  )
);
