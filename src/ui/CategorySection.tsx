import { Link } from "react-router-dom";
import Container from "./Container";
import { useEffect, useState } from "react";
import { CategoryProps } from "../type";
import config from "../config/api-config";
import { getData } from "../lib";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";


const CategorySection = () => {
  const [category, setCategory] = useState<CategoryProps[]>([]);
  const [open, setOpen] = useState(true);
  

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


  return (
    <Container className="">
      <div className="flex items-center justify-between border-b-2 border-gray-200 py-2">
        <div className="flex items-center">
             <h2 className="font-bold text-3xl">Populate Category</h2>
             <button 
                className="px-2 mt-2 ml-2 bg-black text-white font-bold text-base rounded-full flex items-center justify-center"
                onClick={() => setOpen(!open)}
                >
                    {open ? <>Close<IoChevronUp className="ml-2" /></> : <>Open <IoChevronDown className="ml-2" /></>} 
            </button>
        </div>  
        <Link
          to={"/category/tvAndAudio"}
          className="font-medium relative group overflow-hidden"
        >
          View All Categories <br />
          <span className="absolute bottom-0 left-0 w-full block h-[1px] bg-gray-600 -translate-x-[100%] group-hover:translate-x-0 duration-300"></span>
        </Link>
      </div>

      <div className={`overflow-hidden mt-3 lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-6  transition-all duration-500 ease-in-out ${open ? "h-full grid opacity-100" : "max-h-0 opacity-0"}`} >
            {category.map((item, index) => (
                <Link to={`/category/${item._base}`} className="text-center flex-1 p-4 shadow-lg items-center justify-center group" key={index}>
                    <img src={item.image} alt="category-image" className="w-full h-40 object-cover rounded-lg group-hover:scale-100 scale-90 duration-200" />
                    <span className="font-bold">{item.name}</span>
                </Link>
            ))}
      </div>
    </Container>
  );
};

export default CategorySection;
