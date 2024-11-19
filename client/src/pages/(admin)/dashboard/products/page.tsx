import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton, Table, Image, Button, message, Popconfirm, Tag, Space, Card } from "antd";
import { Link } from "react-router-dom";
import api from "../../../../API";
import { Product } from "../../../../interfaces/product";
import './productsadmin.page.css'
import chroma from 'chroma-js';

const AdminProductPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get(`/products`);
      // console.log("Products response:", response);
      return response.data.data.map((product: Product) => ({
        key: product._id,
        ...product,
      }))
    },
  })

  // useMutation với kiểu tham số là string (id của product)
  const { mutate } = useMutation({
    mutationFn: async (_id: string) => {
      await api.delete(`/products/${_id}`)
    },
    onSuccess: () => {
      message.success("Xoá sản phẩm thành công")
      queryClient.invalidateQueries({
        queryKey: ["products"],
      })
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/category");
      return data;
    },
  });

 
 
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: Product, index: number) => index + 1,
    },
    
    {
      title: "Images",
      key: "image_urls",
      dataIndex: "image_urls",
      render: (_: any, item: { image_urls: string[] }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {item.image_urls.slice(0, 3).map((url, index) => (
        <Image
          key={index}
          width={80}
          src={url}
          alt={`Image ${index + 1}`}
        />
      ))}
      {item.image_urls.length > 3 && <span style={{color: 'gray'}}>...</span>}
    </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price ",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Quantity ",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_: any, record: Product) => {
        const categoryId = typeof record.category === 'object' ? record.category._id : record.category;
        const category = categories?.find((category) => category._id === categoryId);
        return category ? category.name : "Chưa có danh mục";
      },
      
    },

{
    title: 'Variants',
    key: 'variants',
    render: (record: Product) => (
        <div style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            {record.variants?.map((variant) => (
                <div key={variant._id} style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#374151', fontSize: '16px' }}>Size: {variant.size}</strong>
                    <div style={{ marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {variant.colors.map((color) => {
                            // Sử dụng chroma-js để tính độ sáng của màu
                            const textColor = chroma(color.color).luminance() < 0.5 ? '#ffffff' : '#000000';
                            return (
                                <Tag
                                    key={color._id}
                                    style={{
                                        backgroundColor: color.color,
                                        color: textColor,
                                        padding: '4px 8px',
                                        borderRadius: '16px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {color.color}: {color.quantity}
                                </Tag>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    ),
}
,

  
    // {
    //   title: 'Variants',
    //   key: 'variants',
    //   render: (record: Product) => (
    //     <div style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
    //       {record.variants?.map((variant) => (
    //         <div key={variant._id} style={{ marginBottom: '12px' }}>
    //           <strong style={{ color: '#374151', fontSize: '16px' }}>Size: {variant.size}</strong>
    //           <div style={{ marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    //             {variant.colors.map((color) => (
    //               <Tag
    //                 key={color._id}
    //                 style={{
    //                   backgroundColor: color.color,
    //                   padding: '4px 8px',
    //                   borderRadius: '16px',
    //                   fontWeight: 'bold',
    //                 }}
    //               >
    //                 {color.color}: {color.quantity}
    //               </Tag>
    //             ))}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
    
    
    
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description:string) => (
        <div className="multi-line-text" dangerouslySetInnerHTML={{ __html: description }} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: "",
      render: (_: any, products: Product) => (
        <div className="flex space-x-2">
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn xóa product này không?"
            onConfirm={() => mutate(products._id)}
            okText="Đồng ý"
            cancelText="Huỷ"
          >
            <Button danger>Remove</Button>
          </Popconfirm>
          <Link to={`/admin/products/${products._id}/edit`}>
            <Button type="primary">Update</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl mb-4">Quản lý sản phẩm</h1>
      <Skeleton loading={isLoading} active>
        <Table dataSource={data} columns={columns} />
      </Skeleton>
    </div>
  );
};

export default AdminProductPage;
