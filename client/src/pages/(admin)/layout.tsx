import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileAddOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

// Hàm tạo item menu
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  path?: string,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    label: path ? <Link to={path}>{label}</Link> : label,
    children,
  } as MenuItem;
}

// Định nghĩa các item cho menu
const items: MenuItem[] = [
  getItem('Bảng điều khiển', '1', <PieChartOutlined />, '/admin/dashboard'),
  getItem('Phân tích', '2', <DesktopOutlined />, '/admin/analytics'),
  getItem('Quản lý sản phẩm', 'sub1', <UnorderedListOutlined />, undefined, [
    getItem('Danh sách sản phẩm', '3', <UnorderedListOutlined />, '/admin/products'),
    getItem('Thêm sản phẩm', '4', <FileAddOutlined />, '/admin/products/add'),
  ]),
  getItem('Quản lý danh mục', 'sub2', <UnorderedListOutlined />, undefined, [
    getItem('DS danh mục', '5', <UnorderedListOutlined />, '/admin/categories'),
    getItem('Thêm danh mục', '6', <FileAddOutlined />, '/admin/categories/add'),
  ]),
  getItem('Nhóm', 'sub3', <TeamOutlined />, '/admin/team'),
  getItem('Tài liệu', '9', <FileOutlined />, '/admin/documents'),
];

const LayoutAdminPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Lấy thông tin đường dẫn hiện tại
  const location = useLocation();

  // Bản đồ đường dẫn sang tiêu đề đẹp hơn
  const pathToTitle: Record<string, string> = {
    admin: 'Admin',
    dashboard: 'Bảng điều khiển',
    analytics: 'Phân tích',
    products: 'Sản phẩm',
    add: 'Thêm mới',
    categories: 'Danh mục',
    team: 'Nhóm',
    documents: 'Tài liệu',
  };

  // Xây dựng breadcrumb items
  const breadcrumbItems = location.pathname
    .split('/')
    .filter((path) => path) // Loại bỏ các phần tử rỗng
    .map((path, index, arr) => {
      const url = `/${arr.slice(0, index + 1).join('/')}`;
      return {
        key: url,
        title: pathToTitle[path] || path,
        href: index < arr.length - 1 ? url : undefined, // Link chỉ áp dụng cho mục trước mục cuối
      };
    });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdminPage;
