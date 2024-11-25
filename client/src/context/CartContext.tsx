import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import api from './../API/index';
import { message } from 'antd';

interface CartItem {
  _id: string;
  image_urls: string[];
  name: string;
  price: number;
  quantity: number;
  size:string
  color:string
}

interface CartContextType {
  cart: CartItem[] | null;
  isLoading: boolean;
  error: Error | null;
  addToCart: (product: CartItem) => void;
  removeProduct: (product: CartItem) => void;
  increaseQuantity: (product: CartItem) => void;
  decreaseQuantity: (product: CartItem) => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem("userId"));

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId); // Lưu userId vào localStorage khi có giá trị mới
    }
  }, [userId]);

  // Lấy giỏ hàng từ API
  const { data: cart, isLoading, error }: UseQueryResult<any, Error> = useQuery(
    {
      queryKey: ["cart", userId],  // Truyền queryKey trong đối tượng
      queryFn: async () => {
        if (!userId) throw new Error("User ID is not available");
        const res = await api.get(`/cart/${userId}`);
        return res.data;
      },
      enabled: !!userId, // Chỉ chạy khi userId tồn tại
    }
  );

  // Mutation để thêm sản phẩm vào giỏ hàng
  const addProductMutation = useMutation({
    mutationFn: async (product: any) => {
      if (!userId) throw new Error("User ID is not available");
  
      // Cập nhật thông tin thiếu cho sản phẩm
      const dataToSend = {
        productId: product._id,  // Đảm bảo rằng product.id tồn tại
        userId: userId,          // userId lấy từ localStorage
        size: product.size,      
        color: product.color,    
      };
  
      console.log("Data to send:", dataToSend);  // In ra dữ liệu trước khi gửi
  
      try {
        const res = await api.post(`/cart/${userId}`, dataToSend);
        return res.data;
      } catch (err: any) {
        console.error("Error from API:", err.response?.data || err.message);
        message.error(`Lỗi: ${err.response?.data?.message || err.message}`);
        throw new Error(err.response?.data?.message || err.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      message.success("Sản phẩm đã được thêm vào giỏ hàng.");
    },
    onError: (error) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });
  
  // Mutation để xóa sản phẩm khỏi giỏ
  const removeProductMutation = useMutation({
    mutationFn: async ({ userId, productId, size, color }: { userId: string, productId: string, size: string, color: string }) => {
      const res = await api.delete(`/cart/remove`, {
        data: { userId, productId, size, color }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      message.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
    },
    onError: (error) => {
      message.error(`Lỗi: ${error.message}`);
    },
  });
  
  
  

 // Mutation để tăng số lượng
 const increaseQuantityMutation = useMutation({
  mutationFn: async ({ _id, size, color }: CartItem) => {
    if (!userId) throw new Error("User ID is not available");

    const res = await api.post(`/cart/increase`, { userId, productId: _id, size, color });
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey:["cart", userId]});
    message.success("Số lượng sản phẩm đã được tăng.");
  },
  onError: (error: any) => {
    message.error(`Lỗi: ${error.response?.data?.message || error.message}`);
  },
});

// Mutation để giảm số lượng
const decreaseQuantityMutation = useMutation({
  mutationFn: async ({ _id, size, color }: CartItem) => {
    if (!userId) throw new Error("User ID is not available");

    // Thay đổi phương thức từ `post` thành `patch`
    const res = await api.patch(`/cart/decrease`, { userId, productId: _id, size, color });
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    message.success("Số lượng sản phẩm đã được giảm.");
  },
  onError: (error: any) => {
    message.error(`Lỗi: ${error.response?.data?.message || error.message}`);
  },
});



  // Các hàm xử lý
  const addToCart = (product: CartItem) => {
    if (userId) {
      addProductMutation.mutate(product);
    } else {
      message.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
    }
  };

  const removeProduct = (product: CartItem) => {
    if (userId) {
      // Kiểm tra nếu có size và color trong sản phẩm
      if (product.size && product.color) {
        // Gọi API để xóa sản phẩm khỏi giỏ hàng
        removeProductMutation.mutate({
          userId,
          productId: product._id,
          size: product.size,
          color: product.color,
        });
      } else {
        message.error("Sản phẩm không có đủ thông tin kích thước hoặc màu sắc.");
      }
    } else {
      message.error("Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng.");
    }
  };
  

// Xử lý tăng số lượng
const increaseQuantity = (product: CartItem) => {
  if (!product._id || !product.size || !product.color) {
    message.error("Thiếu thông tin cần thiết: productId, size, hoặc color.");
    return;
  }
  increaseQuantityMutation.mutate(product);
};

// Xử lý giảm số lượng
const decreaseQuantity = (product: CartItem) => {
  if (!product._id || !product.size || !product.color) {
    message.error("Thiếu thông tin cần thiết: productId, size, hoặc color.");
    return;
  }

  if (product.quantity > 1) {
    // Giảm số lượng nếu quantity > 1
    decreaseQuantityMutation.mutate(product);
  } else if (product.quantity === 1) {
    // Giảm số lượng xuống 0, không xóa sản phẩm mà chỉ giảm số lượng
    decreaseQuantityMutation.mutate(product);
  } else {
    message.error("Sản phẩm có số lượng không hợp lệ.");
  }
};

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        removeProduct,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook để sử dụng CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
