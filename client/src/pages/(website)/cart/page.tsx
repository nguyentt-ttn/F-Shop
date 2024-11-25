import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, Table, Button, message, Image } from "antd";
import api from "../../../API";
import { useCart } from "../../../context/CartContext";
import { AiOutlineDelete, AiOutlineShoppingCart } from "react-icons/ai";

const CartPage = () => {
  const { userId } = useParams();
  const {
    cart,
    isLoading,
    error,
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
  } = useCart();

  const {
    data,
    isLoading: queryLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is not available");
      const res = await api.get(`/cart/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  if (queryLoading || isLoading) return <Skeleton active />;
  if (queryError || error) return <div>Đã xảy ra lỗi khi tải giỏ hàng.</div>;

  if (!data || !data.products || data.products.length === 0) {
    return <div>Giỏ hàng của bạn hiện đang trống.</div>;
  }

  // Hàm xử lý tăng số lượng
  const handleIncrease = (product: any) => {
    increaseQuantity(product);
  };
  // Hàm xử lý giảm số lượng
  const handleDecrease = (product: any) => {
    decreaseQuantity(product);
  };

  // Hàm xử lý xóa sản phẩm khỏi giỏ
  const handleRemove = (product: any) => {
    removeProduct(product);
  };

  // Tính tổng giá trị giỏ hàng
  const totalPrice = data.products.reduce(
    (acc: number, product: any) => acc + product.price * product.quantity,
    0
  );

  const columns = [
    {
      title: "Ảnh",
      key: "image_urls",
      dataIndex: "image_urls",
      render: (imageUrls: any) => <Image src={imageUrls[0]} height={160}/>
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, product: any) => (
        <div >
          <Button onClick={() => handleDecrease(product)} disabled={quantity <= 1}> - </Button> {quantity} <Button onClick={() => handleIncrease(product)}> + </Button>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text: any, product: any) => (
        <span>{(product.price * product.quantity).toLocaleString()} VNĐ</span>
      ),
      
    },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Màu sắc", dataIndex: "color", key: "color" },
    {
      title: "Thao tác",
      key: "action",
      render: (text: any, product: any) => (
        <Button danger onClick={() => handleRemove(product)}>
         <AiOutlineDelete />
        </Button>
      ),
    },
  ];

  return (
      <div className="max-w-6xl mx-auto py-12 p-2">
      <h2 className="text-3xl	m-2">Giỏ hàng </h2>
        <div className="flex justify-between space-x-6">
          <div className="w-2/3">
            <Table
              dataSource={data.products}
              columns={columns}
              className="w-full text-left border-collapse"
              pagination={false}
            />
          </div>

          <div className="w-1/3 bg-gray-100 p-6 ">
            <h2 className="text-lg font-bold mb-4">Cart Total</h2>
            <span className="border-b border-gray-200 block mb-4"></span>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{totalPrice} VNĐ</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span className="text-red-500 font-bold">{totalPrice.toLocaleString()} VNĐ</span>
            </div>
            <a href="./payment.html">
              <button className="w-full bg-white border border-yellow-500 text-yellow-500 font-bold py-2 rounded hover:bg-yellow-600">
                Checkout
              </button>
            </a>
          </div>

        </div>
      </div>
  );
};

export default CartPage;
