import { useQuery } from "@tanstack/react-query";
import { Button, List, Skeleton } from "antd";
import { useCart } from "../../../context/CartContext";
import api from "../../../API";

const ProductListTest = () => {
    const { addItemMutation } = useCart();

    const { data: products, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await api.get("/products");
            return response.data;
        },
    });

    const addToCart = (product: any) => {
        addItemMutation.mutate({ ...product, quantity: 1 });
    };
    if (isLoading) return <Skeleton active />;

    return (
        <div className="product-list">
            <h2>Danh Sách Sản Phẩm</h2>
            <List
                itemLayout="horizontal"
                
                dataSource={Array.isArray(products) ? products : []} // Đảm bảo products là một mảng
                renderItem={(product) => (
                    <List.Item
                        actions={[
                            <Button onClick={() => addToCart(product)}>Thêm vào giỏ hàng</Button>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<img src="{product.} "alt={product.name} width={50} />}
                            title={product.name}
                            description={`${product.price} VND`}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ProductListTest;