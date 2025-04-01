import { useParams } from "react-router-dom";
import { ProductProps } from "../type";
import { useEffect, useState } from "react";
import config from "../config/api-config";
import { getData } from "../lib";
import Loading from "../ui/Loading";
import Container from "../ui/Container";
import { AiOutlineStar } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";



const ProductDetail = () => {

    const { id } = useParams();
    
    if(!id) return <p>Loading data</p>;
    const [product, setProduct] = useState<ProductProps>({} as ProductProps);

    const [color,setColor] = useState('')

    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true)
          const endpoint = `${config?.baseUrl}products/${id}`;
          try {
            const data = await getData(endpoint);
            setProduct(data);
            setColor(data.colors[0])
          } catch (error) {
            console.log(error);
            throw error;
          }
          setTimeout(() => setLoading(false),1000)
        };
        fetchAPI();
    }, [id]);   

    // console.log(product.colors[0]);


  return (
    <>
        {loading ? (
            <Loading />
        ): (
            <Container className="">
                <div className="grid md:grid-cols-2 gap-28">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex flex-row justify-between items-center md:flex-col md:flex-start gap-2 ">
                            {product  && product?.images?.map((item) => (
                                <img src={item} alt={product.name} className="w-14 h-14 object-cover" />
                            ))}
                        </div>
                        <div className="w-[350px] h-[350px] flex items-center justify-center">
                            <img src={product?.images && product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="font-bold text-2xl">{product.name}</h2>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <span className="line-through text-gray-600 text-xl font-semibold">${product.regularPrice}.00</span>
                                <span className="text-blue-500 text-xl font-semibold">${product.discountedPrice}.00</span>
                            </div>
                            <div className="flex text-base gap-2 items-center">
                                    {Array.from({ length: Math.ceil(product.rating) }, (_, index) => (
                                        <AiOutlineStar key={index} className="text-gray-400" />
                                    ))}
                                    <span className="text-base font-bold">({product.reviews} reviews)</span>
                            </div>
                        </div>
                        <span className="flex gap-2 items-center"> <FaRegEye className="inline" />{product.reviews} people are viewing this right now</span>
                        <span>Your are saving <span className="font-bold ">{product.regularPrice - product.discountedPrice}.00$</span> upon purchase</span>
                        <div>
                            <p  className="flex items-center gap-2">Color: <span className={`first-letter:uppercase font-bold block`} style={{color:`${color}`}}>{color}</span></p>
                            <div className="flex gap-4 mt-5">
                                {product && product?.colors?.map((item) => (
                                    <div className={`px-2 h-10 w-10 rounded-full cursor-pointer`} onClick={() => setColor(item)} style={{background: `${item}`}} > 
                                    
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p  className="flex items-center gap-2">Brand: <span className={` first-letter:uppercase font-bold block`}>{product?.brand}</span></p>
                        <p  className="flex items-center gap-2">Category: <span className={` first-letter:uppercase font-bold block`}>{product?.category}</span></p>
                        <button className="w-full bg-slate-700 hover:bg-slate-900 cursor-pointer transform scale-100 hover:scale-105 duration-200  rounded-md px-3 py-2 text-white font-bold">Buy now</button>
                    </div>
                </div>
            </Container>
        )}
    </>
  )
}

export default ProductDetail