import { useEffect, useState } from "react";
import { CategoryProps, ProductProps } from "../type";
import Container from "../ui/Container";
import ProductCard from "../ui/ProductCard";
import Pagination from "../ui/Pagination";
import config from "../config/api-config";
import { getData } from "../lib";
import { RiResetLeftFill } from "react-icons/ri";
import Loading from "../ui/Loading";

const Product = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [category, setCategory] = useState<CategoryProps[]>([]);

  const [activeCategory, setActiveCategory] = useState<CategoryProps>({} as CategoryProps);
  const [productRender, setProductRender] = useState<ProductProps[]>([]);

  const [rotate, setRotate] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  // const [loading,setLoading] = useState(false)

  useEffect(() => {
   
    const fetchAPI = async () => {
      const endpoint = `${config?.baseUrl}products`;
        try {
          const data = await getData(endpoint);
          setProducts(data);
          setProductRender(data)
        } catch (error) {
          console.log(error);
          throw error;
        }
      
    };
    fetchAPI();

  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      const endpoint = `${config?.baseUrl}categories`;
      try {
        const data = await getData(endpoint);
        setCategory(data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    fetchAPI();
  }, []);


  const handleSelectCategory = (cate: CategoryProps) => {
    setActiveCategory(cate)
    setProductRender(products.filter((item) => item.category == cate.name))
  };

  return (

    <>
      <Container className="">
          <div className="flex gap-12 flex-col md:flex-row md:px-0 px-10">
            <div className="flex flex-col">
              <h2 className="text-nowrap text-xl font-bold flex items-center gap-3 group">
                Filter{" "}
                <span
                  onClick={() => {
                    setProductRender(products)
                    setRotate(true);
                    setTimeout(() => setRotate(false), 1000); // Reset after animation ends
                  }}
                  className={`block transform transition-transform hover:text-grey-500 scale-90 hover:scale-100 duration-300  ${
                    rotate ? "animate-rotate-once" : ""
                  }`}
                >
                  <RiResetLeftFill />
                </span>{" "}
              </h2>
              <div className="underline underline-offset-2 uppercase font-semibold decoration-[2px] text-nowrap">
                select category
              </div>
              <div className="flex flex-col gap-y-3">
                {category.map((item) => (
                  <span
                    onClick={() => handleSelectCategory(item)}
                    className={`text-nowrap text-xs font-bold cursor-pointer hover:underline hover:decoration-[2px] hover:decoration-black hover:underline-offset-1 ${activeCategory && activeCategory._id == item._id ? 'text-black text-2xl' : 'text-gray-500'} `}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
    
            <div className="flex flex-col">
              <div className="font-bold text-3xl text-center">
                Product collection
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
                {productRender
                  .slice(itemOffset, itemOffset + itemsPerPage)
                  .map((item) => (
                    <ProductCard product={item} />
                  ))}
              </div>
              <Pagination
                product={productRender}
                itemOffset={itemOffset}
                setItemOffset={setItemOffset}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </Container>
    </>
  );
};
export default Product;
