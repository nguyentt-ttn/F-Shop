import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../../../../API'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Input, message, Skeleton } from 'antd'

const CategoryEdit = () => {
    const {id} = useParams()
    const nav = useNavigate()
    const queryClient = useQueryClient()

    const{data,isLoading} = useQuery({
        queryKey: ['categories',id], 
        queryFn: async()=>{
            const res = await api.get(`/category/${id}`)
            return res.data
        }
    })
    const {mutate}= useMutation({
        mutationFn:async(category)=>{
            return await api.put(`/category/${id}`,category)
        },
        onSuccess: () => {
            nav('/admin/categories')
              message.success("Sửa danh mục thành công!")
              queryClient.invalidateQueries({
                queryKey: ["categories"],
              })
            },
    })

    const onFinish = (values: any) => {
        mutate(values);
      }
      if (isLoading) return <Skeleton active />;
  return (
    <div>
        <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ ...data }}
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
      Sửa danh mục
      </Button>
    </Form.Item>
  </Form>
    </div>
  )
}

export default CategoryEdit