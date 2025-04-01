import { HiBookOpen } from "react-icons/hi"
import { store } from "../lib/store"
import Container from "../ui/Container"
import { LuChevronRight } from "react-icons/lu"
import { Link } from "react-router-dom"
import { CiEdit } from "react-icons/ci";
import { MdOutlinePassword } from "react-icons/md";

const ProfileConfig = [
    {
          name: "Edit profile",
          href: "/profile/edit",
          description: "You will edit all your profile here",
          icon: CiEdit ,
    },
    {
        name: "Change password",
        href: "/profile/change-password",
        description: "You will change your password here",
        icon: MdOutlinePassword  ,
  },
]

const Profile = () => {

    const { currentUser } = store()
    
    console.log(currentUser)
    
    return (

        <>
            {currentUser ? (
                 <Container className="">
                 <div className="flex mx-10 flex-col">
                     <h2 className="font-bold text-2xl decoration-black underline  decoration-2">Hi {`${currentUser?.lastName}  ${currentUser?.firstName}`}</h2>
                     <div className="flex flex-col gap-6 w-full max-w-[600px] mx-auto mt-10">
                         {ProfileConfig.map((item,index) => (
                             <Link to={item.href} className="flex items-center justify-between border-b-2 border-gray-900/10 p-2 hover:bg-blue-100 duration-200 rounded-md hover:cursor-pointer"> 
                                 <div key={index} className="flex gap-x-2 items-center">
                                     <div className="flex h-10 p-2 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10">
                                         {<item.icon className="w-8 h-8 text-skyText"  aria-hidden='true' />}  
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
            ):(
                <>
                    <div className="flex flex-col justify-center items-center mt-10">
                        <h2 className="text-3xl font-bold mb-5">
                        Please login to check your account
                        </h2>
                        <Link
                        to={"/product"}
                        className="px-4 py-2 border-gray-300 border bg-black rounded-full text-white"
                        >
                        Shopping now
                        </Link>
                    </div>
                </>
            )}
        </>

       
    )
}
export default Profile