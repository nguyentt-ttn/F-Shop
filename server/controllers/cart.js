import mongoose from "mongoose";
import Cart from "../models/cart";

// Lấy giỏ hàng của người dùng
 export const getCartByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
      const cart = await Cart.findOne({ userId }).populate("products.productId"); // populate thông tin sản phẩm
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }
  
      // Trả về sản phẩm đã có thông tin tên và giá
      const products = cart.products.map((item) => ({
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));
  
      res.status(200).json({
        userId: cart.userId,
        products,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error });
    }
  };
  

// Thêm sản phẩm vào giỏ
export const addProductToCart = async (req, res) => {
    try {
        const { userId, productId, size, color, quantity = 1 } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !productId || !size || !color) {
            return res.status(400).json({
                message: "Thiếu thông tin cần thiết: userId, productId, size, hoặc color.",
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Nếu giỏ hàng chưa tồn tại, tạo mới
            cart = new Cart({ userId, products: [] });
        }

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if (productIndex > -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng
            cart.products[productIndex].quantity += quantity;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào giỏ
            cart.products.push({ productId, size, color, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm vào giỏ hàng.", error });
    }
};


// Cập nhật số lượng sản phẩm trong giỏ
export const updateProductQuantity = async (req, res) => {
    try {
        const { userId, productId, size, color, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
        }

        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId && item.size === size && item.color === color
        );

        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            if (quantity <= 0) {
                // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ
                cart.products.splice(productIndex, 1);
            }
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm trong giỏ hàng.", error });
    }
};

// Xóa sản phẩm khỏi giỏ hàng của người dùng
export const removeProductFromCart = async (req, res) => {
    try {
        const { userId, productId, size, color } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !productId || !size || !color) {
            return res.status(400).json({
                message: "Thiếu thông tin cần thiết: userId, productId, size, hoặc color.",
            });
        }

        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Giỏ hàng không tồn tại.",
            });
        }

        // Tìm chỉ mục của sản phẩm trong giỏ hàng
        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại trong giỏ hàng.",
            });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.products.splice(productIndex, 1);

        // Lưu lại giỏ hàng sau khi xóa sản phẩm
        await cart.save();

        res.status(200).json({
            message: "Sản phẩm đã được xóa khỏi giỏ hàng.",
            cart,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng.", error });
    }
};



export const deleteCart = async (req, res) => {
    const { userId } = req.params; // Lấy userId từ tham số URL

    try {
        // Kiểm tra xem giỏ hàng của người dùng có tồn tại không
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        // Xóa giỏ hàng
        await Cart.deleteOne({ userId });

        return res.status(200).json({ message: "Giỏ hàng đã được xóa thành công" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Đã có lỗi xảy ra khi xóa giỏ hàng" });
    }
};

// Tăng số lượng sản phẩm
export const increaseProductQuantity = async (req, res) => {
    try {
      const { userId, productId, size, color } = req.body;
  
      if (!userId || !productId || !size || !color) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết: userId, productId, size, hoặc color." });
      }
  
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
      }
  
      const productIndex = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );
  
      if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
        await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tăng số lượng sản phẩm.", error: error.message });
    }
  };
  
  // Giảm số lượng sản phẩm
  export const decreaseProductQuantity = async (req, res) => {
    try {
      const { userId, productId, size, color } = req.body;
  
      if (!userId || !productId || !size || !color) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết: userId, productId, size, hoặc color." });
      }
  
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
      }
  
      const productIndex = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );
  
      if (productIndex > -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
          await cart.save();
          return res.status(200).json(cart);
        } else {
          return res.status(400).json({ message: "Số lượng sản phẩm không thể giảm xuống dưới 1." });
        }
      } else {
        return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi giảm số lượng sản phẩm.", error: error.message });
    }
};
