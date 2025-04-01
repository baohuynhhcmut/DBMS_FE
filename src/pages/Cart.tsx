import { useEffect, useState } from "react"
import { store } from "../lib/store"
import Container from "../ui/Container"
import ProductCart from "../ui/ProductCart"
import CheckoutBtn from "../ui/CheckoutBtn"
import { Link } from "react-router-dom"


const Cart = () => {

    
    const {cartProduct}= store()
    const [totalAmount,setTotalAmount] = useState({
        regular:0,
        discount:0
    })

    const shippingAtm = 2.5
    const taxAmt = 1

    useEffect(()=>{
        const total = cartProduct.reduce((accum,item) => {
                accum.regular += item.regularPrice * item.quantity
                accum.discount += item.discountedPrice * item.quantity
                return accum
        },{
            regular:0,
            discount:0
        })

        setTotalAmount(total)
    },[cartProduct])




    return (
        <Container className="">
            {cartProduct.length > 0 ? (
                <>
                    <h2 className="text-3xl font-bold mb-5">Shopping Cart</h2>
                    <div className="grid md:grid-cols-3 gap-10 ">
        
                        <section className="flex flex-col gap-7  col-span-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                            {cartProduct.map((item) => (
                                <ProductCart product={item} />
                            ))}
                        </section>
                        <section className="">
                            <div className="bg-gray-100/60 mb-5 rounded-lg p-5">
                                <p className="text-base text-black font-bold">Order summary</p>
                                <div className="flex flex-col gap-y-5 divide-y divide-gray-300">
                                    <div className="flex justify-between items-center  py-2">
                                        <span className="text-gray-500 text-sm">Subtotal</span>
                                        <span className="font-bold text-sm">${totalAmount.regular}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-500 text-sm">Shipping estimate</span>
                                        <span className="font-bold text-sm">${shippingAtm}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-500 text-sm">Tax estimate</span>
                                        <span className="font-bold text-sm">${taxAmt}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-base">Total discount</span>
                                        <span className="text-gray-500 text-base font-bold">${totalAmount.regular - totalAmount.discount}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-base">Order total</span>
                                        <span className="text-base font-bold">${shippingAtm + taxAmt + totalAmount.discount}</span>
                                    </div>
                                </div>
                                <CheckoutBtn />
                            </div>
                        </section>
                    </div>
                </>
            ):(
                <>
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-3xl font-bold mb-5">Your shopping cart don't have many items</h2>
                        <Link to={'/product'} className="px-4 py-2 border-gray-300 border bg-black rounded-full text-white">Shopping now</Link>
                    </div>
                </>
            )}
        </Container>
  )
}
export default Cart