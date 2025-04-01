import { useForm,SubmitHandler  } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../ui/Loading";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
})

const auth = getAuth()

type LoginSchemaType = z.infer<typeof LoginSchema>;

const ResetPassword = () => {

    const [loading,setLoading] = useState(false)

    const [errorFireBase,setErrorFireBase] = useState('')

    const { register,handleSubmit,formState:{errors} } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) ,mode:'onChange'});

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
        
        setLoading(true)
        const { email } = data
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("✅ Password reset email sent! Check your inbox.");
            navigate('/login')
        } catch (error : any) {
            setErrorFireBase(error.message)
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
                        <h2 className="text-center text-2xl font-bold ">Forgot Password</h2>
                        
                        {errorFireBase && <span className="text-xl text-center text-red-500">{errorFireBase}</span>}
                        
                        <div className="flex flex-col">
                            <label htmlFor="email" className="block mb-2 text-xs font-medium text-black">Email</label>
                            <input  id="email" placeholder="email" {...register("email")} className="p-2 border-2 border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />    
                            {errors.email && <span className="text-xs text-red-500 ">{errors.email.message}</span>}
                        </div>


                        <button type="submit" className="rounded-md bg-blue-700 hover:bg-blue-800 font-bold text-white shadow-md p-3">Submit</button>
                        <Link to={'/'} type="button" className="rounded-md bg-white shadow-md hover:bg-gray-200  p-3 inline-flex items-center justify-center gap-2">Back to shopping <FaShoppingCart  /> </Link>
                    </form>

                </div>
            </div>
        </div>
    )
}
export default ResetPassword

