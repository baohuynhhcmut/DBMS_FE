import { useEffect, useState } from "react";
import { bannerConfig } from "../config/banner-config";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import config from "../config/api-config";
import { getData } from "../lib";
import { CategoryProps } from "../type";
import { Link } from "react-router-dom";
import { RightArrow } from "./RightArrow";
import { LeftArrow } from "./LeftArrow";
const BannerCategory = () => {
    
  const [category, setCategory] = useState<CategoryProps[]>([]);

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
    <Carousel
      responsive={bannerConfig}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={3000}
      customRightArrow={<RightArrow />}
      customLeftArrow={<LeftArrow />}
      className="flex p-4 max-w-screen-xl mx-auto lg:px-0 items-center relative"
    >
        {category?.map((item) => (
           <Link to={`/category/${item._base}`} key={item._id} className="p-2 flex items-center border border-gray-100 hover:border-blue-400 mx-2 rounded-md">
                <img
                    src={item.image}
                    className="w-12 h-10 object-cover rounded-full px-2"
                />
                {item.name}
           </Link>
        ))}
    </Carousel>
  );
};
export default BannerCategory;
