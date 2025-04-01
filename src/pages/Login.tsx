import { useForm,SubmitHandler  } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../ui/Loading";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string()
                .min(8, "Password must be at least 8 characters")
                .max(20, "Password must be at most 20 characters")
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

const auth = getAuth()

type LoginSchemaType = z.infer<typeof LoginSchema>;

const Login = () => {

    const [loading,setLoading] = useState(false)

    const [errorFireBase,setErrorFireBase] = useState('')

    const { register,handleSubmit,formState:{errors} } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) ,mode:'onChange'});

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
        
        setLoading(true)
        const { email,password } = data

        try {
            await signInWithEmailAndPassword(auth,email,password)
            setLoading(false)
            toast.success('Login Succes, let buy something')
            navigate('/')
        } catch (error : any) {
            console.log(error.code)
            setLoading(false)
            const message = error.code.replace("auth/","").split('-').join(" ").replace(/^./, (char:string) => char.toUpperCase());
            setErrorFireBase(message)
        }
    }

    return (
        <div className="w-full h-screen md:px-0 px-4">
            <Toaster 
                position="bottom-right"
                reverseOrder={false}
                gutter={8}
                // toastOptions={{
                //     style: {
                //         background: '#fff',
                //         color: '#',
                //       },
                // }}
            />
            {loading && <Loading />}
            <div className="grid md:grid-cols-2 h-full">
                <img className="hidden md:block w-full h-screen object-cover" src="https://kissenglishcenter.com/wp-content/uploads/2022/05/tu%CC%9B%CC%80-vu%CC%9B%CC%A3ng-thu%CC%9Bo%CC%9B%CC%80ng-du%CC%80ng-khi-vie%CC%82%CC%81t-doa%CC%A3n-va%CC%86n-tie%CC%82%CC%81ng-anh-ve%CC%82%CC%80-shopping-1024x1024.jpg" />
                <div className="flex flex-col items-center justify-center ">
                    
                    <form className="w-[450px] flex flex-col px-4 py-10 gap-y-4 border border-gray-300 rounded-md mt-2 shadow-md" onSubmit={handleSubmit(onSubmit)}>
                        <h2 className="text-center text-2xl font-bold ">Login to Meow Solutions</h2>
                        
                        {errorFireBase && <span className="text-xl text-center text-red-500">{errorFireBase}</span>}
                        
                        <div className="flex flex-col">
                            <label htmlFor="email" className="block mb-2 text-xs font-medium text-black">Email</label>
                            <input  id="email" placeholder="email" {...register("email")} className="p-2 border-2 border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />    
                            {errors.email && <span className="text-xs text-red-500 ">{errors.email.message}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password" className="block mb-2 text-xs font-medium text-black">Password</label>
                            <input type="password"  id="password" placeholder="password" {...register("password")} className="p-2 border-2 border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />    
                            {errors.password && <span className="text-xs text-red-500 ">{errors.password.message}</span>}
                        </div>


                        <span className="text-sm">Don't have account ? <Link to={'/register'} className="text-blue-500 cursor-pointer">Register now</Link>  </span>
                        <span className="text-sm">Forgot your password ? <Link to={'/reset-password'} className="text-blue-500 cursor-pointer">Click here</Link>  </span>
                        <button type="submit" className="rounded-md bg-blue-700 hover:bg-blue-800 font-bold text-white shadow-md p-3">Submit</button>
                        <button type="button" className="rounded-md bg-purple-700 hover:bg-purple-800 shadow-md p-3 inline-flex items-center justify-center gap-2 text-white">Login with Google <FaGoogle /> </button>
                        <Link to={'/'} type="button" className="rounded-md bg-white shadow-md hover:bg-gray-200  p-3 inline-flex items-center justify-center gap-2">Back to shopping <FaShoppingCart  /> </Link>
                    </form>

                </div>
            </div>
        </div>
    )
}
export default Login

