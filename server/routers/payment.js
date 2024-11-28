import express from 'express';
import config from 'config';
import dateFormat from 'dateformat';
import qs from 'qs';
import crypto from 'crypto';

const paymentRouter = express.Router();

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

paymentRouter.post('/create_payment_url', function (req, res, next) {
  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnpUrl = config.get('vnp_Url');
  let returnUrl = config.get('vnp_ReturnUrl');

  let date = new Date();
  let createDate = dateFormat(date, 'yyyymmddHHmmss');
  let orderId = dateFormat(date, 'HHmmss');
  let amount = req.body.totalAmount * 100; // Chuyển đổi sang đơn vị VND
  let bankCode = req.body.bankCode;

  let orderInfo = req.body.orderDescription;
  let orderType = req.body.orderType;
  let locale = req.body.language || 'vn';

  if (!amount || !orderInfo || !orderType) {
    return res.status(400).json({ error: "Thiếu thông tin thanh toán" });
  }

  let currCode = 'VND';
  let vnp_Params = {
    'vnp_Version': '2.1.0',
    'vnp_Command': 'pay',
    'vnp_TmnCode': tmnCode,
    'vnp_Locale': locale,
    'vnp_CurrCode': currCode,
    'vnp_TxnRef': orderId,
    'vnp_OrderInfo': orderInfo,
    'vnp_OrderType': orderType,
    'vnp_Amount': amount,
    'vnp_ReturnUrl': returnUrl,
    'vnp_IpAddr': ipAddr,
    'vnp_CreateDate': createDate
  };

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // Sắp xếp các tham số theo thứ tự bảng chữ cái
  vnp_Params = sortObject(vnp_Params);

  // Tạo chữ ký (secure hash) sử dụng secret key
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  // Thêm chữ ký vào tham số
  vnp_Params['vnp_SecureHash'] = secureHash;

  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
  res.json({ paymentUrl: vnpUrl });
});




export default paymentRouter;
