import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "../ui/Container"
import { TiTick } from "react-icons/ti";
import { useEffect, useState } from "react";
import { store } from "../lib/store";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Loading from "../ui/Loading";


const Success = () => {

    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const navigate = useNavigate()
    const { cartProduct ,currentUser,resetCart} = store()
    // console.log(">> Session id: ",sessionId)
    const [loading,setLoading] = useState(false)



    useEffect(() => {

        if(!sessionId){
            navigate('/')
        }
        else if(cartProduct.length > 0 && currentUser){
            
            setLoading(true)
            const saveOrder = async() => {
                const orderRef = doc(db,'orders',currentUser.email)
                const orderSnap = await getDoc(orderRef);
                if(orderSnap.exists()){
                    await updateDoc(orderRef,{
                        orders: arrayUnion({
                            userEmail: currentUser.email,
                            paymentId: sessionId,
                            orderItem:cartProduct,
                            paymentMethod: 'stripe',
                            status: 'success',
                            userId: currentUser.id
                        })
                    })
                }
                else{
                    await setDoc(orderRef,{
                        orders:[
                            {
                                userEmail: currentUser.email,
                                paymentId: sessionId,
                                orderItem:cartProduct,
                                paymentMethod: 'stripe',
                                status: 'success'
                            }
                        ]
                    })
                }
                resetCart()
                setLoading(false)
            }
            saveOrder()
        }
    },[sessionId])

    return (
        <>
            {loading ? (
                <Loading />
            ):(
                <> 
                    <Container className="">
                        <div className="flex flex-col pt-10 justify-center items-center gap-y-4">
                            <span className="text-4xl p-2 border-2 border-green-500 text-green-500 rounded-full"><TiTick /></span>
                            <h2 className="font-bold text-3xl">Your Payment Accepted by Meow Electronics</h2>
                            <span>Now you can view your Orders or continue Shopping with us</span>
                            <div className="flex items-center gap-x-5">
                                <Link to={'/orders'} className="px-5 py-2 rounded-full bg-black text-white">View Order</Link>
                                <Link to={'/'} className="px-5 py-2 rounded-full bg-black text-white">Continue Shopping</Link>
                            </div>
                        </div>
                    </Container>
                </>
            )}
        </>
    )
}
export default Success