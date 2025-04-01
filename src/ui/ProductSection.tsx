import Container from "./Container";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { ProductProps } from "../type";
import config from "../config/api-config";
import { getData } from "../lib";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";

const ProductSection = () => {
  const [product, setProduct] = useState<ProductProps[]>([]);
  const [open, setOpen] = useState(true);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10

  useEffect(() => {
    const fetchAPI = async () => {
      const endpoint = `${config?.baseUrl}products`;
      try {
        const data = await getData(endpoint);
        setProduct(data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    fetchAPI();
  }, []);


  return (
    <Container className="">
      <div className="flex items-center justify-between border-b-2 border-gray-200 py-2" id="products">
        <div className="flex items-center">
          <h2 className="font-bold text-3xl">Top selling product</h2>
          <button
            className="px-2 mt-2 ml-2 bg-black text-white font-bold text-base rounded-full flex items-center justify-center"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <>
                Close
                <IoChevronUp className="ml-2" />
              </>
            ) : (
              <>
                Open <IoChevronDown className="ml-2" />
              </>
            )}
          </button>
        </div>
        <Link
          to={"/products/tvAndAudio"}
          className="font-medium relative group overflow-hidden"
        >
          View All Product <br />
          <span className="absolute bottom-0 left-0 w-full block h-[1px] bg-gray-600 -translate-x-[100%] group-hover:translate-x-0 duration-300"></span>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
            {product.slice(itemOffset,itemOffset+itemsPerPage).map((item) => (
                <ProductCard product={item} />
            ))}
      </div>

      <Pagination product={product} itemOffset={itemOffset} setItemOffset={setItemOffset} itemsPerPage={itemsPerPage} />

    </Container>
  );
};

export default ProductSection;
