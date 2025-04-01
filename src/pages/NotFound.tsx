import { Link, useLocation } from "react-router-dom"
import Container from "../ui/Container"
import { LuChevronRight } from "react-icons/lu";
import { notFoundConfig } from "../config/not-found-config";


const NotFound = () => {
  
  const { pathname } = useLocation()
  const path = pathname.split('/').filter(Boolean).pop()

  return (
    <Container className="">
        <div className="max-w-xl w-full mx-auto flex flex-col items-center">
            <h2 className="text-skyText text-3xl font-bold">404</h2>
            <p className="first-letter:uppercase"> <span className="text-2xl text-red-500 font-bold ">{path}</span> does not exist</p>
            <p className="text-gray-400">Sorry, we couldn't find the {path} page you looking for</p>
            <div className="flex flex-col gap-6 mt-6 w-full">
                {notFoundConfig.map((item,index) => (
                  <Link to={item.href} className="flex items-center justify-between border-b-2 border-gray-900/10 p-2 hover:bg-blue-100 duration-200 rounded-md hover:cursor-pointer"> 
                      <div key={index} className="flex gap-x-2 items-center">
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10">
                          {<item.icon className="w-4 h-4 text-skyText"  aria-hidden='true' />}  
                        </div>  
                        <div> 
                          <h2 className="font-bold">{item.name}</h2>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                    </div>
                    <LuChevronRight />
                  </Link>
                ))}
            </div>
        </div>
    </Container>
  )
}
export default NotFound