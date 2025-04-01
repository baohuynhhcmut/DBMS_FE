import { useState } from "react";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, User, signOut } from "firebase/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Container from "../ui/Container";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const passwordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string()
                    .min(8, "Password must be at least 8 characters")
                    .max(20, "Password must be at most 20 characters")
                    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                    .regex(/[0-9]/, "Password must contain at least one number")
                    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
                    .min(8, "Password must be at least 8 characters")
                    .max(20, "Password must be at most 20 characters")
                    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                    .regex(/[0-9]/, "Password must contain at least one number")
                    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
}).refine((data) => data.confirmPassword == data.newPassword,{
    message: "Passwords do not match",
    path: ["confirmPassword"],
})


type TypePassWord = z.infer<typeof passwordSchema>


const ChangePassword = () => {
    const auth = getAuth();
    const user: User | null = auth.currentUser;
    const navigate = useNavigate()

    const [isSubmit,setIsSubmit] = useState(false)
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<TypePassWord>({
      resolver: zodResolver(passwordSchema),
    });


    const handleChangePassword = async (data: TypePassWord) => {
        setIsSubmit(true)
    
        try {
            if(user){
                const credential = EmailAuthProvider.credential(user.email as string, data.currentPassword);
                await reauthenticateWithCredential(user, credential);
    
                // Step 2: Update the password
                await updatePassword(user, data.newPassword);
                toast.success("Password updated successfully!, please login again");
                await signOut(auth)
                navigate('/login')
                setIsSubmit(false)
            }
        } catch (error: any) {
            toast.error(error.message);
            setIsSubmit(false)
        }
    };


    return (
        <Container className="">
            <form className="max-w-[600px] mx-auto rounded-md border shadow-lg" onSubmit={handleSubmit(handleChangePassword)}>
                <div className="flex flex-col gap-y-3 py-4 px-2">
                    <h2 className="font-bold text-2xl text-center">Change password</h2>
                    <div className="flex flex-col p-2">
                        <label htmlFor="currentPassword" className="font-bold text-sm">Current password</label>
                        <input id="currentPassword" className="p-2 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-300" type="password" {...register("currentPassword")} required />
                        {errors.currentPassword && <p className="text-red-500">{errors.currentPassword.message}</p>}
                    </div>

                    <div className="flex flex-col p-2">
                        <label htmlFor="newPassword" className="font-bold text-sm">New password</label>
                        <input id="newPassword" className="p-2 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-300" type="password" {...register("newPassword")} required />
                        {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
                    </div>

                    <div className="flex flex-col p-2">
                        <label htmlFor="confirmPassword" className="font-bold text-sm">Confirm your new password</label>
                        <input id="confirmPassword" className="p-2 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-300" type="password" {...register("confirmPassword")} required />
                        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                    </div>

                    <button  className="p-2 font-bold bg-black text-white rounded-md" type="submit" disabled={isSubmit}>
                        {isSubmit ? "Updating..." : "Change Password"}
                    </button>
                </div>
            </form>
        </Container>
    )
};

export default ChangePassword;
