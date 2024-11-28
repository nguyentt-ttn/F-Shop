import Checkout from "../models/checkout";
import Cart from "../models/cart"

export const createCheckout = async (req, res) => {
    try {
        // Tạo checkout mới
        const newCheckout = new Checkout(req.body);
        const savedCheckout = await newCheckout.save();

        // Làm mới giỏ hàng
        const userId = req.body.userId;
        if (userId) {
            await Cart.findOneAndUpdate(
                { userId },
                { products: [] } // Làm trống giỏ hàng
            );
        }

        res.status(201).json({
            message: "Checkout created successfully",
            data: savedCheckout,
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating checkout", error: err.message });
    }
};

// Lấy danh sách tất cả các đơn thanh toán
export const getAllCheckouts = async (req, res) => {
    try {
        const checkouts = await Checkout.find().populate("userId").populate("products.productId");
        res.status(200).json({ message: "Checkouts retrieved successfully", data: checkouts });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving checkouts", error: err.message });
    }
};

// Lấy thông tin chi tiết 1 đơn thanh toán
export const getCheckoutById = async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id)
            .populate("userId")
            .populate("products.productId");
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }
        res.status(200).json({ message: "Checkout retrieved successfully", data: checkout });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving checkout", error: err.message });
    }
};

// Cập nhật trạng thái đơn hàng
export const updateCheckoutStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const updatedCheckout = await Checkout.findByIdAndUpdate(
            req.params.id,
            { orderStatus, paymentStatus },
            { new: true }
        );
        if (!updatedCheckout) {
            return res.status(404).json({ message: "Checkout not found" });
        }
        res.status(200).json({ message: "Checkout updated successfully", data: updatedCheckout });
    } catch (err) {
        res.status(500).json({ message: "Error updating checkout", error: err.message });
    }
};

// Xóa đơn thanh toán
export const deleteCheckout = async (req, res) => {
    try {
        const deletedCheckout = await Checkout.findByIdAndDelete(req.params.id);
        if (!deletedCheckout) {
            return res.status(404).json({ message: "Checkout not found" });
        }
        res.status(200).json({ message: "Checkout deleted successfully", data: deletedCheckout });
    } catch (err) {
        res.status(500).json({ message: "Error deleting checkout", error: err.message });
    }
};
