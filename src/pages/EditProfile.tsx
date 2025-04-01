import { store } from "../lib/store"
import Container from "../ui/Container"
import { UserType } from "../type"
import { db } from "../lib/firebase"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { doc, updateDoc } from "firebase/firestore"

const EditProfile = () => {

    const {  currentUser,updateUserInfo } = store()
    const { register, handleSubmit, setValue } = useForm<UserType>();
    const [isSubmit,setIsSubmit] = useState(false)

    useEffect(() => {
        if (currentUser) {
            setValue("firstName", currentUser.firstName);
            setValue("lastName", currentUser.lastName);
            setValue("email",currentUser.email)
        }
    }, [currentUser, setValue,updateUserInfo]);

    const onSubmit = async (data: Partial<UserType>) => {
        if (!currentUser) return;
        setIsSubmit(true)
        const userRef = doc(db, "users", currentUser.id);
        try {
            await updateDoc(userRef, {
                firstName: data.firstName,
                lastName: data.lastName,
            });

            // 🔹 Update Zustand store to reflect changes instantly
            updateUserInfo({
                firstName: data.firstName!,
                lastName: data.lastName!,
            });

            toast.success("Profile updated successfully!");
        } catch (error:any) {
            toast.error("Error updating profile: " + error.message);
        }
        setIsSubmit(false)
    };

    console.log(currentUser)

    return (
        <Container className="" >
            <form className="max-w-[600px] mx-auto p-2 shadow-md py-2 " onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-2">
                    <h2 className="text-center text-xl font-bold">Edit your user profile</h2>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold">First Name:</label>
                        <input className="p-2 rounded-md border border-gray-200 w-full" type="text" {...register("firstName")} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold">Last Name:</label>
                        <input className="p-2 rounded-md border border-gray-200 w-full" type="text" {...register("lastName")} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold">Email (read-only):</label>
                        <input className="p-2 rounded-md border border-gray-200 w-full" disabled type="email" {...register("email")} readOnly />
                    </div>

                    <button className="bg-black rounded-lg p-2 w-full font-bold text-xl text-white" type="submit">
                        {isSubmit ? "Uploading..." :  "Update Profile"}   
                    </button>
                </div>
            </form>

        </Container>
    )

}

export default EditProfile