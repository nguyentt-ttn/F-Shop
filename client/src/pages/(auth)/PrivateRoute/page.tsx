import { message } from 'antd';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const storedUser = localStorage.getItem('role');
    const role = storedUser ? JSON.parse(storedUser) : null;

    if (role !== "admin") {
        message.warning('Bạn không có quyền truy cập Admin, vui lòng đăng nhập tài khoản Admin!');
        return <Navigate to='/sign-in' />;
    }
    
    return children;
}

export default PrivateRoute;
