import { FaMinus, FaPlus } from "react-icons/fa"
import { CartProduct } from "../type"
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";



const ProductCart = ({product} :{product:CartProduct}) => {


    const handleDecrease = () => {

    }
    
    const handleAddToCart = () => {
        
    }
    return (
        
        <div className="flex gap-3 relative py-10">
            <Link to={`/product/detail/${product.id}`} className=" p-5 md:p-10 border borer-gray-200 flex items-center justify-center hover:border-blue-300"> 
                <img src={product.images[0]} className="w-32 h-32 object-cover" />
            </Link>
            <div className="flex flex-col gap-2 ">
                <p className="line-clamp-2 font-bold max-w-[350px]">{product.name}</p>
                <p className="text-xs">Brand: <span className="font-bold">{product.brand}</span></p>
                <p className="text-xs">Category: <span className="font-bold">{product.category}</span></p>
                <div className="flex items-center gap-4">
                    <p className="font-bold">${product.discountedPrice}</p>
                    <div className="flex items-center gap-2">
                        <button className="bg-gray-100 rounded-full p-1 hover:bg-black hover:text-white" onClick={handleDecrease}>
                            <FaMinus />
                        </button>
                        <p className="text-xl font-bold">{product.quantity}</p>
                        <button className="bg-gray-100 rounded-full p-1 hover:bg-black hover:text-white"   onClick={handleAddToCart}>
                            <FaPlus/>
                        </button>
                    </div>
                </div>
                {product.isStock && <p className="text-green-500 flex items-center"><TiTick />{product.isStock} In stock</p>}
                <p>Your are saving <span className="text-green-500">${product.regularPrice - product.discountedPrice}</span> upon here  </p>
                
            </div>
            <div className="absolute top-10 right-0 text-xl text-gray-500 hover:text-black cursor-pointer hover:rounded-full p-1 hover:bg-gray-200"> <IoClose /> </div>
        </div>
    )
}

export default ProductCart