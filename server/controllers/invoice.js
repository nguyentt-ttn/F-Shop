import Invoice from "../models/invoice";
import Cart from "../models/cart";

export const createInvoice = async (req, res) => {
  try {
    const { userId } = req.body;

    // Lấy giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    // Tính tổng giá
    const products = cart.products.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalPrice = products.reduce((total, product) => total + product.price * product.quantity, 0);

    // Tạo hóa đơn mới
    const invoice = new Invoice({
      userId,
      products,
      totalPrice,
    });

    await invoice.save();

    // Xóa giỏ hàng sau khi tạo hóa đơn
    await Cart.deleteOne({ userId });

    res.status(201).json({ message: "Hóa đơn đã được tạo thành công.", invoice });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo hóa đơn.", error });
  }
};

//Lấy danh sách hóa đơn
export const getInvoicesByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const invoices = await Invoice.find({ userId }).populate("products.productId");
      if (!invoices.length) {
        return res.status(404).json({ message: "Không tìm thấy hóa đơn." });
      }
  
      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách hóa đơn.", error });
    }
  };

//   lấy chi tiết h.don
  export const getInvoiceById = async (req, res) => {
    try {
      const { invoiceId } = req.params;
  
      const invoice = await Invoice.findById(invoiceId).populate("products.productId");
      if (!invoice) {
        return res.status(404).json({ message: "Hóa đơn không tồn tại." });
      }
  
      res.status(200).json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy chi tiết hóa đơn.", error });
    }
  };
  
// update trạng thái
  export const updateInvoiceStatus = async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const { status } = req.body;
  
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: "Hóa đơn không tồn tại." });
      }
  
      invoice.status = status;
      await invoice.save();
  
      res.status(200).json({ message: "Cập nhật trạng thái hóa đơn thành công.", invoice });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật trạng thái hóa đơn.", error });
    }
  };
  