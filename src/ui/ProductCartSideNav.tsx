import { FaRegEye, FaRegStar } from "react-icons/fa"
import { LuArrowLeftRight } from "react-icons/lu"
import { ProductProps } from "../type"
import { store } from "../lib/store"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"



const ProductCartSideNav = ({product} : {product:ProductProps}) => {

  const { favoriteProduct,addToFavorite} =  store()
  
  const [exist,setExist] = useState<ProductProps | null>(null)

  const handleAddFavorite = () => {
    addToFavorite(product)
  }

  useEffect(() => {
    const isExist = favoriteProduct.find((item) => item._id == product._id)
    if(isExist){
      setExist(isExist)
    }else{
      setExist(null)
    }
  },[favoriteProduct])

  return (
    <div className="absolute right-2 flex flex-col top-0 transition translate-x-16 group-hover:translate-x-0 duration-300">
        <span onClick={handleAddFavorite} className={exist ? `z-100 w-11 h-10 inline-flex relative items-center justify-center rounded-full bg-black text-white ` : 
          `z-100 w-11 h-10 inline-flex relative text-black text-lg items-center justify-center rounded-full hover:bg-black hover:text-white duration-300`}>
            <FaRegStar />
        </span>
        <span className="z-100 w-11 h-10 inline-flex relative text-black text-lg items-center justify-center rounded-full hover:bg-black hover:text-white duration-300">
            <LuArrowLeftRight />
        </span>
        <span className="z-100 w-11 h-10 inline-flex relative text-black text-lg items-center justify-center rounded-full hover:bg-black hover:text-white duration-300">
            <FaRegEye />
        </span>
    </div>
  )
}

export default ProductCartSideNav