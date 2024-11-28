import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const responseCode = queryParams.get("vnp_ResponseCode");
  const message =
    responseCode === "00"
      ? "Thanh toán thành công!"
      : "Thanh toán không thành công.";

  return <div>{message}</div>;
};

export default PaymentSuccess;
