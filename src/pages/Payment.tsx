import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../ui/Container";
import toast, { Toaster } from "react-hot-toast";
import { IoMdArrowBack } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import { ImCreditCard } from "react-icons/im";
import { RiInformationLine } from "react-icons/ri";
import { store } from "../lib/store";

const Payment = () => {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();
  const { amount } = useParams();
  const { resetCart } = store();

  // Use the amount from URL params, or fallback to a default value
  const orderAmount = amount ? parseFloat(amount) : 0;
  const orderId = "order_" + Date.now().toString();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("Đặt hàng thành công!", {
        duration: 2000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          fontSize: "16px",
        },
      });

      // Reset cart and navigate to home page after payment success
      setTimeout(() => {
        resetCart();
        navigate("/");
      }, 2000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, resetCart]);

  useEffect(() => {
    // Timer for countdown until order expires
    const expiryTimer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(expiryTimer);
      }
    }, 1000);

    return () => {
      clearInterval(expiryTimer);
    };
  }, [minutes, seconds]);

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* Header with MoMo logo and contact info */}
      <header className="bg-white py-3 px-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZcQPC-zWVyFOu9J2OGl0j2D220D49D0Z7BQ&s"
            alt="MoMo Logo"
            className="h-12 w-12"
          />
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center">
            <span className="text-pink-600 font-medium">1900 54 54 41</span>
          </div>
          <div className="flex items-center">
            <span className="text-pink-600 font-medium">hotro@momo.vn</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-grow">
        {/* Left side - Order info */}
        <div className="w-full md:w-1/3 bg-pink-600 text-white p-6">
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-2">Đơn hàng hết hạn sau</h2>
              <div className="text-3xl font-bold">
                {formatTime(minutes, seconds)}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Nhà cung cấp</h3>
              <div className="text-xl font-bold">TNI CORPORATION</div>
            </div>

            <div className="mb-6 flex items-center">
              <ImCreditCard className="mr-2 text-xl" />
              <div>
                <div className="text-sm">Số tiền</div>
                <div className="text-xl font-bold">
                  {orderAmount.toLocaleString()}$
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-1">
                <RiInformationLine className="mr-2 text-xl" />
                <div className="text-sm">Thông tin</div>
              </div>
              <div className="font-medium">TNI request payment</div>
            </div>

            <div className="mb-8">
              <div className="flex items-start mb-1">
                <div className="mr-2 text-xl">📋</div>
                <div>
                  <div className="text-sm">Đơn hàng</div>
                  <div className="font-medium break-all">{orderId}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="mt-auto flex items-center justify-center text-white border border-white rounded-md p-2"
            >
              <IoMdArrowBack className="mr-2" />
              Quay lại
            </button>
          </div>
        </div>

        {/* Right side - QR code */}
        <div className="w-full md:w-2/3 p-6 flex flex-col items-center justify-center">
          <div className="max-w-md w-full flex flex-col items-center">
            <div className="mb-8 flex items-center"></div>

            <h2 className="text-pink-600 text-xl font-medium mb-6">
              Quét mã để thanh toán
            </h2>

            <div className="mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/640px-QR_code_for_mobile_English_Wikipedia.svg.png"
                alt="QR Payment Code"
                className="w-64 h-64"
              />
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <span>
                Sử dụng App <strong>MoMo</strong> hoặc
              </span>
            </div>

            <div className="text-gray-600 mb-6">
              ứng dụng Camera hỗ trợ QR code để quét mã
            </div>

            <div className="flex items-center text-gray-500">
              <AiOutlineClockCircle className="mr-2" />
              <span>Đang chờ bạn quét ...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with security badges */}
      <footer className="bg-white py-3 px-4 border-t border-gray-200 flex justify-center">
        <img
          src="https://payment.momo.vn/w/assets/img/footer.png"
          alt="Security Badges"
          className="h-8"
        />
      </footer>
    </div>
  );
};

export default Payment;
