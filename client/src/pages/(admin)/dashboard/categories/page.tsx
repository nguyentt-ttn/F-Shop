import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { CategoryInterface } from '../../../../interfaces/category';
import api from '../../../../API';
import { Button, message, Popconfirm, Skeleton, Table } from 'antd';
import { Link } from 'react-router-dom';

const AdminCategoriesPage = () => {
    const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<CategoryInterface[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get(`/category`);
      console.log("category" ,response)
      return response.data.map((category: CategoryInterface) => ({
        key: category._id,
        ...category,
      }))
    },
  })

  const { mutate } = useMutation({
    mutationFn: async (_id: string|number) => {
      await api.delete(`/category/${_id}`)
    },
    onSuccess: () => {
      message.success("Xoá danh mục thành công")
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      })
    },
  });

 
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: CategoryInterface, index: number) => index + 1,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    
    {
      title: "",
      render: (_: any, category: CategoryInterface) => (
        <div className="flex space-x-2">
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn xóa product này không?"
            onConfirm={() => mutate(category._id)}
            okText="Đồng ý"
            cancelText="Huỷ"
          >
            <Button danger>Remove</Button>
          </Popconfirm>
          <Link to={`/admin/categories/${category._id}/edit`}>
            <Button type="primary">Update</Button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div>
        <h1 className="text-3xl mb-4">Quản lý danh mục</h1>
      <Skeleton loading={isLoading} active>
        <Table dataSource={data} columns={columns} />
      </Skeleton>
    </div>
  )
}

export default AdminCategoriesPage