import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Spin, Alert, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import api from '../../../../API';

const CheckoutList = () => {
    // Sử dụng React Query để fetch dữ liệu
    const { data, isLoading, error } = useQuery({
        queryKey: ['checkouts'],
        queryFn: async () => {
            const response = await api.get('/checkout');
            return response.data.data;
        },
    });

    // Điều hướng sử dụng useNavigate
    const navigate = useNavigate();

    // Xử lý khi đang load
    if (isLoading) {
        return <Spin tip="Loading..." style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} />;
    }

    // Xử lý khi gặp lỗi
    if (error) {
        return <Alert message="Error" description="Unable to fetch data" type="error" showIcon />;
    }

    // Định nghĩa các cột cho bảng
    const columns = [
        {
            title: 'User Info',
            dataIndex: 'userId',
            key: 'userId',
            render: (user) => (user ? user.name || user.email : 'Unknown User'), // Hiển thị tên hoặc email nếu có
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => (amount ? `$${amount}` : 'N/A'), // Hiển thị giá trị tiền hoặc N/A
        },
        {
            title: 'Order Status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (status) => status || 'Pending', // Trạng thái mặc định nếu không có dữ liệu
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (date ? new Date(date).toLocaleString() : 'N/A'), // Xử lý ngày giờ
        },
        {
            title: 'Action', // Cột mới cho hành động
            key: 'action',
            render: (text, record) => (
                <Button 
                    type="primary" 
                    onClick={() => navigate(`/checkout/${record._id}`)} // Điều hướng đến trang chi tiết
                >
                    Xem Chi Tiết
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>Checkout List</h2>
            <Table
                rowKey={(record) => record._id}
                dataSource={data || []} // Đảm bảo dữ liệu luôn là mảng
                columns={columns}
                pagination={{ pageSize: 5 }}
                bordered
            />
        </div>
    );
};

export default CheckoutList;
