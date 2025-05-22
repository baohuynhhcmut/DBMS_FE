import { useEffect, useState } from "react";
import { store } from "../lib/store";
import Container from "../ui/Container";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import { ProductProps, CartProduct } from "../type";

const Cart = () => {
  const {
    cartProduct,
    currentUser,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = store();
  const navigate = useNavigate();

  const [totalAmount, setTotalAmount] = useState({
    regular: 0,
    discount: 0,
  });

  const shippingAtm = 2.5;
  const taxAmt = 1;

  useEffect(() => {
    const total = cartProduct.reduce(
      (accum, item) => {
        const regularPrice = item.regularPrice || 0;
        const discountedPrice = item.discountedPrice || 0;
        const quantity = item.quantity || 1;

        accum.regular += regularPrice * quantity;
        accum.discount += discountedPrice * quantity;
        return accum;
      },
      {
        regular: 0,
        discount: 0,
      }
    );

    setTotalAmount(total);
  }, [cartProduct]);

  const handleDirectCheckout = () => {
    // Calculate total and navigate to payment with amount
    const total = (shippingAtm + taxAmt + totalAmount.discount).toFixed(2);
    navigate(`/payment/${total}`);
  };

  const handleIncreaseQuantity = (product: ProductProps) => {
    addToCart(product);
  };

  const handleDecreaseQuantity = (productId: number) => {
    const product = cartProduct.find((item) => item._id === productId);
    if (product && product.quantity > 1) {
      decreaseQuantity(productId);
    } else {
      removeFromCart(productId);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    removeFromCart(productId);
  };

  // Product cart component with quantity controls
  const ProductCart = ({ product }: { product: CartProduct }) => {
    // Ensure values are defined or use default values
    const discountedPrice = product.discountedPrice || 0;
    const regularPrice = product.regularPrice || 0;
    const quantity = product.quantity || 1;
    const image =
      product.images && product.images.length > 0 ? product.images[0] : "";

    return (
      <div key={product._id} className="flex flex-col md:flex-row py-5 gap-4">
        <div className="w-full md:w-2/5 flex items-center">
          <img
            src={image}
            alt={product.name || "Product"}
            className="w-24 h-24 object-contain mr-4"
          />
          <div>
            <h3 className="font-medium text-base">
              {product.name || "Unnamed Product"}
            </h3>
            <p className="text-gray-500 text-sm">
              {product.brand || "Unknown Brand"}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/5 flex items-center">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleDecreaseQuantity(product._id)}
              className="p-2 hover:bg-gray-100"
            >
              <AiOutlineMinus />
            </button>
            <span className="px-4 py-1">{quantity}</span>
            <button
              onClick={() => handleIncreaseQuantity(product)}
              className="p-2 hover:bg-gray-100"
            >
              <AiOutlinePlus />
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/5 flex items-center">
          <div className="flex flex-col">
            <span className="text-base font-medium">
              ${discountedPrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ${regularPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="w-full md:w-1/5 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <span className="font-bold">
              ${(discountedPrice * quantity).toFixed(2)}
            </span>
            <button
              onClick={() => handleRemoveProduct(product._id)}
              className="p-2 text-red-500 hover:bg-red-100 rounded-full"
            >
              <AiOutlineDelete size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container className="">
      {cartProduct.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold mb-5">Shopping Cart</h2>
          <div className="grid md:grid-cols-3 gap-10 ">
            <section className="flex flex-col gap-7 col-span-2 divide-y divide-gray-200 border-b border-t border-gray-200">
              {cartProduct.map((item) => (
                <ProductCart key={item._id} product={item} />
              ))}
            </section>
            <section className="">
              <div className="bg-gray-100/60 mb-5 rounded-lg p-5">
                <p className="text-base text-black font-bold">Order summary</p>
                <div className="flex flex-col gap-y-5 divide-y divide-gray-300">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 text-sm">Subtotal</span>
                    <span className="font-bold text-sm">
                      ${totalAmount.regular.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 text-sm">
                      Shipping estimate
                    </span>
                    <span className="font-bold text-sm">
                      ${shippingAtm.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 text-sm">Tax estimate</span>
                    <span className="font-bold text-sm">
                      ${taxAmt.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-base">Total discount</span>
                    <span className="text-gray-500 text-base font-bold">
                      ${(totalAmount.regular - totalAmount.discount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-base">Order total</span>
                    <span className="text-base font-bold">
                      $
                      {(shippingAtm + taxAmt + totalAmount.discount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Direct checkout button */}
                <button
                  onClick={handleDirectCheckout}
                  className="mt-4 w-full p-3 font-bold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-5">
              Your shopping cart is empty
            </h2>
            <Link
              to={"/product"}
              className="px-4 py-2 border-gray-300 border bg-black rounded-full text-white"
            >
              Shop now
            </Link>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
