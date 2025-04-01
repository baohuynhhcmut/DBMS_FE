export interface HighlightsType {
    _id: number;
    _base: string;
    title: string;
    name: string;
    image: string;
    color: string;
    buttonTitle: string;
  }
  
  export interface CategoryProps {
    _id: number;
    image: string;
    name: string;
    _base: string;
    description: string;
  }
  
  export interface ProductProps {
    id:string;
    _id: number;
    _base: string;
    reviews: number;
    rating: number;
    quantity: number;
    overView: string;
    name: string;
    isStock: boolean;
    isNew: boolean;
    images: [string];
    discountedPrice: number;
    regularPrice: number;
    description: string;
    colors: [string];
    category: string;
    brand: string;
  }
  
  export interface BlogProps {
    _id: number;
    image: string;
    title: string;
    description: string;
    _base: string;
  }
  
  export interface UserTypes {
    currentUser: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
      id: string;
    };
  }
  
  export interface OrderTypes {
    orderItems: [ProductProps];
    paymentId: string;
    paymentMethod: string;
    userEmail: string;
}

export interface CartProduct extends ProductProps {
    quantity:number;
}

export interface UserType {
  firstName:string;
  lastName: string;
  email:string;
  id:string;
}

export interface StoreType  {
    currentUser: UserType | null;
    isLoading: boolean;
    getUserInfo: (uid:any) => Promise<void>;

    cartProduct: CartProduct[];
    addToCart: (product:ProductProps) => Promise<void>;
    decreaseQuantity: (producId:number) => void;
    removeFromCart: (producId:number) => void;
    resetCart: () => void;
    
    favoriteProduct: ProductProps[];
    addToFavorite: (product:ProductProps) => void;
    removeFromfavorite: (producId:number) => void;
    resetfavorite: () => void;


    updateUserInfo: (userData: Partial<UserType>) => void;
}