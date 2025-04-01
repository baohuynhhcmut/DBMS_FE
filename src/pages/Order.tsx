import { useEffect, useState } from "react";
import { store } from "../lib/store";
import Container from "../ui/Container";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loading from "../ui/Loading";

const totalPayment = (order: any) => {
  return order.reduce(
    (accum: any, item: any) => accum + item.discountedPrice * item.quantity,
    0
  );
};

const Order = () => {
  const { currentUser } = store();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getOrders = async () => {
      if (currentUser) {
        const orderRef = doc(db, "orders", currentUser.email);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          const data = orderSnap.data();
          setOrders(data.orders);
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    getOrders();
  }, []);

  return (
    <>
      {currentUser ? (
        <>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Container className="">
                <div className="flex flex-col px-12">
                  <h2 className="font-bold text-2xl">Customer order detail</h2>
                  <span className="text-gray-500">
                    Customer name:{" "}
                    <span className="text-black">{`${currentUser?.lastName} ${currentUser?.firstName}`}</span>
                  </span>
                  <span className="text-gray-500">
                    Total orders:{" "}
                    <span className="text-black">{orders.length}</span>
                  </span>
                  <div className="w-full flex flex-col gap-y-5 divide-y-2 divide-gray-300">
                    {orders.map((item) => (
                      <div>
                        <Disclosure>
                          <DisclosureButton className="group flex items-center justify-between pt-3 w-full">
                            <span className="text-gray-500">
                              Order id:{" "}
                              <span className="text-black font-bold">
                                {item?.paymentId}
                              </span>
                            </span>
                            <FaPlus className="w-5 group-data-[open]:rotate-180" />
                          </DisclosureButton>

                          <DisclosurePanel>
                            <div className="bg-gray-100 border border-gray-200 p-2 flex flex-col">
                              <span className="font-bold">
                                Your order :{" "}
                                <span className="text-blue-400">
                                  #{item.paymentId.substring(0, 20)}...
                                </span>{" "}
                                has been shipped and will be with you soon
                              </span>
                              <span className="text-gray-500">
                                Order Item count:{" "}
                                <span className="text-black">
                                  {item.orderItem.length}
                                </span>
                              </span>
                              <span className="text-gray-500">
                                Payment status:{" "}
                                <span className="text-black">
                                  {item.status}
                                </span>
                              </span>
                              <span className="text-gray-500">
                                Total payment:{" "}
                                <span className="text-black">
                                  {totalPayment(item.orderItem)}
                                </span>
                              </span>
                              <div className="flex flex-col px-2 gap-y-2 divide-y divide-gray-300">
                                {item.orderItem.map((item: any) => (
                                  <div className="flex py-2 gap-x-2">
                                    <Link
                                      to={`/product/detail/${item.id}`}
                                      className="p-5 bg-white border border-blue-500"
                                    >
                                      <img
                                        className="w-20 h-20 object-cover cursor-pointer"
                                        src={item.images[0]}
                                      />
                                    </Link>
                                    <div>
                                      <p className="">${item.name}</p>
                                      <p className="text-gray-500 text-sm max-w-[700px]">
                                        {item.description}
                                      </p>
                                      <div className="flex gap-x-2 items-center divide-x divide-gray-500">
                                        <span>Quantity: {item.quantity}</span>
                                        <span className="pl-2">
                                          Price: {item.discountedPrice}
                                        </span>
                                        <span className="pl-2">
                                          Total:{" "}
                                          {item.discountedPrice * item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </DisclosurePanel>
                        </Disclosure>
                      </div>
                    ))}
                  </div>
                </div>
              </Container>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center mt-10">
            <h2 className="text-3xl font-bold mb-5">
              Please login to check your orders
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
  );
};

export default Order;
