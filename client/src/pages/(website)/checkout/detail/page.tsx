import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, Spin, Alert, List } from "antd";
import api from "../../../../API";

const CheckoutDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({ 
    queryKey: ["checkout", id],
    queryFn: async () => {
        const response = await api.get(`/checkout/${id}`);
        return response.data.data;
    }
  });

  if (isLoading) {
    return <Spin tip="Loading..." />;
  }

  if (error || !data) {
    return (
      <Alert 
        message="Checkout Details Not Found" 
        description="Unable to fetch the checkout details or no data found for the given ID" 
        type="error" 
      />
    );
  }

  return (
    <Card title={`Checkout Details - ${data._id}`}>
      <p>
        <strong>User:</strong> {data.userId?.name || data.userId?.email}
      </p>
      <p>
        <strong>Total Amount:</strong> ${data.totalAmount}
      </p>
      <p>
        <strong>Status:</strong> {data.orderStatus}
      </p>
      <p>
        <strong>Payment Method:</strong> {data.paymentMethod}
      </p>
      <p>
        <strong>Shipping Address:</strong> {data.shippingAddress?.fullName},{" "}
        {data.shippingAddress?.address}
      </p>
      <h3>Products:</h3>
      <List
        dataSource={data.products}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={`Product: ${item.productId?.name || "Unknown"}`}
              description={`Size: ${item.size}, Color: ${item.color}, Quantity: ${item.quantity}`}
            />
            <p>${item.price}</p>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CheckoutDetail;
