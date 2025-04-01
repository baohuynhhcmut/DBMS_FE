import { store } from "../lib/store"
import { ProductProps } from "../type"


const CheckoutBtn = () => {


    const { currentUser,cartProduct } = store()


    const handleCheckOut = async () => {
        const body = {
            items:cartProduct,
            email: currentUser?.email
        }

        try {
            const respone = await fetch('http://localhost:8888/payment',{
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(body)
            })
    
            const result = await respone.json()
            window.location.href = result.session.url
        } catch (error) {
            console.log(error)
        }   
    }

    return (
        <>
            {currentUser ? (
                <button onClick={handleCheckOut} className="p-3 font-bold rounded-md w-full bg-white shadow-md text-black hover:bg-gray-500">
                    Checkout
                </button>  
            ):(
                <button className="p-3  font-bold  rounded-md w-full bg-white shadow-md text-black hover:bg-gray-400 hover:text-white transform scale-100 hover:scale-105 duration-200 ">
                    Please login for checkout
                </button>
            )}
        </>
    )
}

export default CheckoutBtn