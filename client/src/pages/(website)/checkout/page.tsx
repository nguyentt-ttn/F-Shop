// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../../../API";
// import { useMutation } from "@tanstack/react-query";

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { cartData, totalPrice } = location.state || {};

//   const [shippingAddress, setShippingAddress] = useState({
//     fullName: "",
//     phone: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

//   // Nếu giỏ hàng trống
//   if (!cartData || cartData.length === 0) {
//     return <div>Giỏ hàng của bạn đang trống.</div>;
//   }

//   // Hàm xử lý khi người dùng thay đổi thông tin trong các trường input
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setShippingAddress((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Mutation để gửi yêu cầu thanh toán
//   const { mutate, isLoading, isError, error, isSuccess } = useMutation({
//     mutationFn: async (paymentData: any) => {
//       return await api.post("/checkout", paymentData);
//     },
//     onSuccess: (data) => {
//       console.log("Thanh toán thành công:", data);
//       localStorage.removeItem("cartData");
//     },
//     onError: (error) => {
//       console.error("Lỗi thanh toán:", error);
//     },
//   });

//   // Hàm xử lý khi người dùng nhấn nút thanh toán
//   const handlePayment = () => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       console.error("User not logged in.");
//       navigate("/sign-in");
//       return;
//     }

//     // Chuyển đổi cartData sang định dạng mới
//     const products = cartData.map((product: any) => ({
//       productId: product._id,
//       size: product.size,
//       color: product.color,
//       quantity: product.quantity,
//       price: product.price,
//     }));

//     const paymentData = {
//       userId,
//       products,
//       totalAmount: totalPrice,
//       shippingAddress,
//       paymentMethod,
//     };

//     console.log("paymentData", paymentData); // Kiểm tra dữ liệu trước khi gửi
//     mutate(paymentData);
//   };

//   return (
//     <div>
//       <h2>Thông tin thanh toán</h2>
//       <div>
//         <h3>Giỏ hàng</h3>
//         {cartData.map((product: any) => (
//           <div key={product.productId}>
//             <span>
//               {product.productId} {product.name} - {product.size} -{" "}
//               {product.color}
//             </span>
//             - {product.quantity} x {product.price} VNĐ
//           </div>
//         ))}
//         <div>Total: {totalPrice} VNĐ</div>
//       </div>

//       <div>
//         <h3>Địa chỉ giao hàng</h3>
//         <form>
//           <div>
//             <label>Họ và tên:</label>
//             <input
//               type="text"
//               name="fullName"
//               value={shippingAddress.fullName}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Điện thoại:</label>
//             <input
//               type="text"
//               name="phone"
//               value={shippingAddress.phone}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Địa chỉ:</label>
//             <input
//               type="text"
//               name="address"
//               value={shippingAddress.address}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Thành phố:</label>
//             <input
//               type="text"
//               name="city"
//               value={shippingAddress.city}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Mã bưu điện:</label>
//             <input
//               type="text"
//               name="postalCode"
//               value={shippingAddress.postalCode}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Quốc gia:</label>
//             <input
//               type="text"
//               name="country"
//               value={shippingAddress.country}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//         </form>
//       </div>
//       <div>
//         <h3>Phương thức thanh toán</h3>
//         <div>
//           <label>
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="cash_on_delivery"
//               checked={paymentMethod === "cash_on_delivery"}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//             Thanh toán khi nhận hàng
//           </label>
//         </div>
//         <div>
//           <label>
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="online_payment"
//               checked={paymentMethod === "online_payment"}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//            Thanh toán online
//           </label>
//         </div>
//       </div>

//       {/* Nút thanh toán */}
//       <button
//         className="w-full bg-yellow-500 text-white py-2 rounded mt-4"
//         onClick={handlePayment}
//         disabled={isLoading}
//       >
//         {isLoading ? "Đang thanh toán..." : "Thanh toán"}
//       </button>

//       {/* Hiển thị thông báo lỗi nếu có */}
//       {isError && <div>Error: {error?.message}</div>}
//       {/* Hiển thị thông báo thành công nếu thanh toán thành công */}
//       {isSuccess && <div>Thanh toán thành công!</div>}
//     </div>
//   );
// };

// export default PaymentPage;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../API";
import { useMutation } from "@tanstack/react-query";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartData, totalPrice } = location.state || {};

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  // Nếu giỏ hàng trống
  if (!cartData || cartData.length === 0) {
    return <div>Giỏ hàng của bạn đang trống.</div>;
  }

  // Hàm xử lý khi người dùng thay đổi thông tin trong các trường input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mutation để gửi yêu cầu thanh toán
  const { mutate, isLoading, isError, error, isSuccess } = useMutation({
    mutationFn: async (paymentData) => {
      if (paymentMethod === "online_payment") {
        const response = await api.post("/payment/create_payment_url", paymentData);
        return response.data;
      } else {
        const response = await api.post("/checkout", paymentData); // Logic thanh toán khi nhận hàng
        return response.data;
      }
    },
    onSuccess: (data) => {
      if (paymentMethod === "online_payment") {
        window.location.href = data.paymentUrl; 
      } else {
        console.log("Thanh toán thành công:", data);
        localStorage.removeItem("cartData");
        navigate("/thank-you"); // Điều hướng tới trang cảm ơn sau khi thanh toán thành công
      }
    },
    onError: (error) => {
      console.error("Lỗi thanh toán:", error);
    },
  });

  // Hàm xử lý khi người dùng nhấn nút thanh toán
  const handlePayment = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User not logged in.");
      navigate("/sign-in");
      return;
    }

    // Chuyển đổi cartData sang định dạng mới
    const products = cartData.map((product) => ({
      productId: product._id,
      size: product.size,
      color: product.color,
      quantity: product.quantity,
      price: product.price,
    }));

    const paymentData = {
      userId,
      products,
      totalAmount: totalPrice,
      orderDescription: "Mô tả đơn hàng của bạn",
      orderType: "170000",
      language: "vn",
      bankCode: paymentMethod === "online_payment" ? "NCB" : null,
      paymentMethod,
      shippingAddress,
    };

    console.log("paymentData", paymentData);
    mutate(paymentData);
  };

  return (
    <div>
      <h2>Thông tin thanh toán</h2>
      <div>
        <h3>Giỏ hàng</h3>
        {cartData.map((product) => (
          <div key={product.productId}>
            <span>
              {product.productId} {product.name} - {product.size} -{" "}
              {product.color}
            </span>
            - {product.quantity} x {product.price} VNĐ
          </div>
        ))}
        <div>Total: {totalPrice} VNĐ</div>
      </div>

      <div>
        <h3>Địa chỉ giao hàng</h3>
        <form>
          <div>
            <label>Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Thành phố:</label>
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Mã bưu điện:</label>
            <input
              type="text"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Quốc gia:</label>
            <input
              type="text"
              name="country"
              value={shippingAddress.country}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </div>
      <div>
        <h3>Phương thức thanh toán</h3>
        <div>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={paymentMethod === "cash_on_delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Thanh toán khi nhận hàng
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="online_payment"
              checked={paymentMethod === "online_payment"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Thanh toán online
          </label>
        </div>
      </div>

      {/* Nút thanh toán */}
      <button
        className="w-full bg-yellow-500 text-white py-2 rounded mt-4"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Đang thanh toán..." : "Thanh toán"}
      </button>

      {/* Hiển thị thông báo lỗi nếu có */}
      {isError && <div>Error: {error?.message}</div>}
      {/* Hiển thị thông báo thành công nếu thanh toán thành công */}
      {isSuccess && <div>Thanh toán thành công!</div>}
    </div>
  );
};

export default PaymentPage;
