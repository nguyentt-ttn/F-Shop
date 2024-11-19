import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import api from '../../../../../API'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'

const CategoryAdd = () => {
    const nav = useNavigate()
    const queryClient = useQueryClient()
    const {mutate}= useMutation({
        mutationFn:async(category)=>{
            return await api.post(`/category`,category)
        },
        onSuccess: () => {
            nav('/admin/categories')
              message.success("Thêm danh mục mới thành công!")
              queryClient.invalidateQueries({
                queryKey: ["categories"],
              })
            },
    })

    const onFinish = (values: any) => {
        mutate(values);
      }
  return (
    <div>
        <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
  >
    <Form.Item
      label="Tên danh mục"
      name="name"
      rules={[{ required: true, message: 'Please input your name!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Mô tả"
      name="description"
      rules={[{ required: true, message: 'Please input your description!' }]}
    >
      <Input />
    </Form.Item>

    

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Thêm danh mục
      </Button>
    </Form.Item>
  </Form>
    </div>
  )
}

export default CategoryAdd