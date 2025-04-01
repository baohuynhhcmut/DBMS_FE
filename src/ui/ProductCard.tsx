import { AiOutlineStar } from "react-icons/ai";
import { ProductProps } from "../type";
import { useEffect, useState } from "react";
import { Button, Transition, TransitionChild } from "@headlessui/react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import ProductCartSideNav from "./ProductCartSideNav";
import { useNavigate } from "react-router-dom";
import { store } from "../lib/store";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";

type Props = {
  product: ProductProps;
};

const calculateDiscountPercentage = (
  regularPrice: number,
  discountedPrice: number
) => {
  if (regularPrice <= 0 || discountedPrice < 0) return 0; // Tránh chia cho 0
  const discount = ((regularPrice - discountedPrice) / regularPrice) * 100;
  return Math.round(discount); // Làm tròn số %
};

const ProductCard = ({ product }: Props) => {
  let [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }
  const handleProductDetails = (_id:string) => {
    navigate(`/product/detail/${_id}`)
  }

  const {addToCart,cartProduct,decreaseQuantity} = store()


  const handleAddToCart = () => {
    addToCart(product)
    if(!existInCart){
      toast.success(`${product.name.substring(0,10)} add to cart success`)
    }
  }

  const [existInCart,setExistInCart] = useState<ProductProps | null>(null)

  useEffect(() => {
    const checkExist = cartProduct.find((item) => item._id === product._id)
    if(checkExist){
      setExistInCart(checkExist)
    }
  },[product,cartProduct])

  const handleDecrease = () => {
    
    if(existInCart && existInCart?.quantity > 1){

      decreaseQuantity(existInCart?._id)
    }
    else{
      toast.error('Cant not decrease number of product less than 1')
    }
  }


  // console.log(">> Cart product: ",cartProduct)

  return (
    <>
      <div className="relative flex flex-col p-3 border-2 border-gray-300 hover:border-black cursor-pointer rounded-md overflow-hidden group">
        <img
          src={product.images[0]}
          className="w-full h-full object-cover transform scale-90 hover:scale-95  duration-150"
          onClick={() => handleProductDetails(product.id)}
        />
        <ProductCartSideNav product={product} />
        <p className="-tracking-wider font-bold text-gray-600 uppercase text-xs">
          {product.overView}
        </p>
        <div className="w-full  font-bold text-xl md:line-clamp-3 line-clamp-1 mb-2">
          {product.name}
        </div>
        <div className="flex text-bold text-xl  ">
          {Array.from({ length: Math.ceil(product.rating) }, (_, index) => (
            <AiOutlineStar key={index} className="text-gray-400" />
          ))}
        </div>
        <div className="flex itemse-center gap-2 font-semibold text-xl">
          <span className="text-gray-500 line-through">
            {product.regularPrice}.00
          </span>
          <span className="text-blue-500">{product.discountedPrice}.00</span>
        </div>
        
        {existInCart ? (
          <div className="flex items-center self-center gap-4">
             <button className="bg-gray-100 rounded-full p-2 hover:bg-black hover:text-white" onClick={handleDecrease}>
                <FaMinus />
             </button>
              <p className="text-xl font-bold">{existInCart.quantity}</p>
             <button className="bg-gray-100 rounded-full p-2 hover:bg-black hover:text-white"   onClick={handleAddToCart}>
                <FaPlus/>
             </button>
          </div>
        ): (
          <button onClick={handleAddToCart} className="uppercase font-semibold bg-gray-100 px-2 py-2 rounded-lg text-sm hover:bg-black hover:text-white transform scale:100 hover:scale-105 duration-200">
            Add to cart
          </button>
        )}
        
        
        <div
          onClick={open}
          className="bg-white text-black ring-1 ring-gray-300 top-2 left-1 rounded-xl px-2 hover:bg-black hover:text-white absolute "
        >
          save{" "}
          {calculateDiscountPercentage(
            product.regularPrice,
            product.discountedPrice
          )}
          %
        </div>

        <Transition appear={true} show={isOpen}>
          <Dialog
            as={"div"}
            className="focus:outline-none relative z-10"
            onClose={close}
          >
            <div className="fixed inset-0 w-screen overflow-y-auto z-10">
              <div className="flex min-h-full items-center justify-center">
                <TransitionChild
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 transform-[scale(95)]"
                  enterTo="opacity-100 transform-[scale(100)]"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 transform-[scale(100)]"
                  leaveTo="opacity-0 transform-[scale(95)]"
                >
                  <DialogPanel className="max-w-md w-full bg-white p-4 rounded-md backdrop-blur-xs">
                    <DialogTitle
                      className="text-base/7  font-medium text-black"
                      as="h3"
                    >
                      Hurry up!
                    </DialogTitle>
                    <p className="text-sm text-gray-500">
                      You are going to save{" "}
                      <span className="font-bold text-red-500 text-xl">
                        {product.regularPrice - product.discountedPrice} $
                      </span>{" "}
                      from this product
                    </p>
                    <p className="line-clamp-3 text-sm text-gray-500">
                      {product.description}
                    </p>
                    <Button
                      onClick={close}
                      className="mt-2 rounded bg-sky-600 py-2 px-4 text-sm font-bold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
                    >
                      OK
                    </Button>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

export default ProductCard;
