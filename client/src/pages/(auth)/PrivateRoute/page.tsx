import { message } from 'antd';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || user.role !== "admin") {
        message.warning('Bạn không có quyền truy cập Admin, vui lòng đăng nhập tài khoản Admin!');
        return <Navigate to='/sign-in' />;
    }
    
    return children;
}

export default PrivateRoute;
