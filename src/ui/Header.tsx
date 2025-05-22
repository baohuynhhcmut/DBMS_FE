import { useEffect, useRef, useState } from "react";
import { logo } from "../assets";
import { IoSearchOutline,IoClose } from "react-icons/io5";
import { FiShoppingBag, FiStar, FiUser  } from "react-icons/fi";
import Container from "./Container";
import { headerConfig } from "../config/header-config";
import { Link, useNavigate } from "react-router-dom";
import config from "../config/api-config";
import { getData } from "../lib";
import { CategoryProps, ProductProps } from "../type";
import MenuHeader from "./MenuHeader";
import { store } from "../lib/store";
import { IoIosLogIn } from "react-icons/io";
import MenuUser from "./MenuUser";
import { IoLogOutOutline } from "react-icons/io5";
import { getAuth, signOut } from "firebase/auth";
import { MdDashboard } from "react-icons/md";
const Header = () => {

    const [searchText,setSearchText] = useState('')
    
    const [filterSeaProduct,setFilterSeaProduct] = useState<ProductProps[]>([])

    const [category,setCategory] = useState<CategoryProps[]>([])

    const [products,setProducts] = useState<ProductProps[]>([])

    const [selectedIndex, setSelectedIndex] = useState(-1);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]); 

    const navigate = useNavigate()
  
    const { cartProduct,favoriteProduct,currentUser } = store()

    const auth = getAuth()
    
    const handleLogOut = async () => {
      await signOut(auth)
      navigate('/login')
    }

    useEffect(() => {
        const fetchAPI = async () => {
          const endpoint = `${config?.baseUrl}products`;
          try {
            const data = await getData(endpoint);
            setProducts(data);
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
                const data = await getData(endpoint)
                setCategory(data)
            } catch (error) {
                console.log(error)
                throw error
            }
        }
        fetchAPI()
    }, [])

    
    useEffect(() => {
        const handleKeyDown = (event:KeyboardEvent) => {
          if (!filterSeaProduct.length) return;
    
          if (event.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev < filterSeaProduct.length - 1 ? prev + 1 : prev));
          } else if (event.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          } else if (event.key === "Enter" && selectedIndex >= 0) {
            navigate(`/product/detail/${filterSeaProduct[selectedIndex].id}`);
            setSearchText('')
            setSelectedIndex(-1); // Reset index

          }
        };
    
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }, [selectedIndex, filterSeaProduct,navigate]);



    const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    }
    
    useEffect(()=>{
        const filter = products.filter((item) => item.name.toLowerCase().includes(searchText))
        setFilterSeaProduct(filter)
    },[searchText])

    useEffect(() => {
        const handleClickOutside = (event:MouseEvent) => {
          if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target as Node)) {
            setSearchText("");
            setSelectedIndex(-1); // Reset index khi click ra ngoài
          }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);


      useEffect(() => {
        if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
          itemRefs.current[selectedIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, [selectedIndex]);

    return (
        <div className="w-full bg-whiteText md:sticky md:top-0 z-50">
            <div className="max-w-screen-xl mx-auto h-20 flex items-center justify-between px-4 lg:px-0">
                <Link to={'/'} className="flex justify-center items-center">
                    <img src={logo} alt="logo" className="w-24" />
                    <span className="font-bold text-2xl text-black">Meow Electronics</span>
                </Link>

                <div className="max-w-3xl w-full relative hidden md:inline-flex">
                    <input 
                        type="text"
                        placeholder="Search products"
                        value={searchText}
                        onChange={handleSearch}
                        className="flex-1 w-full rounded-full text-gray-900 text-lg 
                        placeholder:text-base placeholder:tracking-wide shadow-md ring-1 ring-inset
                        ring-gray-300 placeholder:text-gray-400 placeholder:font-normal
                        focus:ring-darkText sm:text-sm px-4 py-2 
                        "
                    />
                    {searchText ? (
                         <IoClose 
                         onClick={() => setSearchText('')}
                         className="absolute top-2.5 right-4 text-xl hover:text-red-500 cursor-pointer duration-200"
                     />
                    ):(
                        <IoSearchOutline 
                            className="absolute top-2.5 right-4 text-xl"
                        />
                    )}
                    {searchText &&  
                        <div  ref={dropdownRef} className="w-full flex flex-col gap-y-4 p-3 rounded-md shadow-md h-auto overflow-y-auto max-h-[500px] bg-white z-50 absolute left-0 top-10">
                            {filterSeaProduct.map((item, index) => (
                                <div
                                    key={index}
                                    ref={(el) => {itemRefs.current[index] = el}}
                                    className={`flex gap-4 cursor-pointer p-2 rounded-md transition ${
                                    selectedIndex === index ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                                    }`}
                                    onClick={() => navigate(`/product/detail/${item.id}`)}
                                    onMouseEnter={() => setSelectedIndex(index)} // Di chuột cũng đổi màu
                                >
                                    <img src={item.images[0]} className="w-10 h-10 object-cover" />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>}
                </div>
               


                <div className="flex items-center gap-x-6 text-2xl">
                    { currentUser ? (
                      <button onClick={handleLogOut} className="font-bold text-3xl">
                          <IoLogOutOutline /> 
                      </button>
                    ):(
                      <Link to={'/login'}>
                        <FiUser className="hover:text-skyText cursor-pointer duration-200 "/>
                      </Link>
                    )}

                    <Link  to={'/dashboard'} className="relative block">
                        <MdDashboard className="hover:text-skyText cursor-pointer duration-200 "/>
                        {/* <span className="inline-flex items-center justify-center text-whiteText absolute -top-2 -right-2 bg-red-500 text-[9px] rounded-full w-4 h-4">{favoriteProduct.length}</span> */}
                    </Link>
                    <Link to={'/cart'} className="relative block">
                        <FiShoppingBag className="hover:text-skyText cursor-pointer duration-200 " />
                        <span className="inline-flex items-center justify-center text-whiteText absolute -top-2 -right-2 bg-red-500 text-[9px] rounded-full w-4 h-4">{cartProduct.length}</span>
                    </Link> 
                </div>
            </div>

            <div className="text-whiteText w-full bg-black">
                <Container className="py-2 max-w-screen-lg flex items-center gap-5 justify-between">
                    <MenuHeader category={category}/>

                    {headerConfig.map((item) => (
                        <Link 
                            to={item.link}
                            className="uppercase hidden overflow-hidden md:inline-flex text-sm font-semibold text-whiteText/90 hover:text-whiteText duration-200 cursor-pointer relative group" 
                            key={item.title}
                        >
                            {item.title}
                            <span className="text-whiteText inline-flex w-full h-[1px] bg-whiteText absolute bottom-0 left-0 transform -translate-x-[105%] group-hover:translate-x-0 duration-300"></span>
                        </Link>
                    ))}
                </Container>
            </div>
        </div>
    );
}

export default Header;

