import { store } from "../lib/store";
import { useNavigate } from "react-router-dom";

const CheckoutBtn = () => {
  const { currentUser } = store();
  const navigate = useNavigate();

  const handleCheckOut = () => {
    if (currentUser) {
      navigate("/payment");
    }
  };

  return (
    <>
      {currentUser ? (
        <button
          onClick={handleCheckOut}
          className="p-3 font-bold rounded-md w-full bg-white shadow-md text-black hover:bg-gray-500"
        >
          Checkout
        </button>
      ) : (
        <button className="p-3 font-bold rounded-md w-full bg-white shadow-md text-black hover:bg-gray-400 hover:text-white transform scale-100 hover:scale-105 duration-200 ">
          Please login for checkout
        </button>
      )}
    </>
  );
};

export default CheckoutBtn;
