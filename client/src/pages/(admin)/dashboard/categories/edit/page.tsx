import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../../../API";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, message, Skeleton } from "antd";

const CategoryEdit = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const res = await api.get(`/category/${id}`);
      return res.data;
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (category) => {
      return await api.put(`/category/${id}`, category);
    },
    onSuccess: () => {
      nav("/admin/categories");
      message.success("Sửa danh mục thành công!");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const onFinish = (values: any) => {
    mutate(values);
  };
  if (isLoading) return <Skeleton active />;
  return (
    <div className="product-form-container py-10">
      <div className="container mx-auto px-4">
        <div className="form-card">
          <h1 className="form-title">Create Category</h1>
          <Form
            name="category-form"
            initialValues={{ ...data }}
            onFinish={onFinish}
            layout="vertical"
            className="form-section"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label="Category Name"
                name="name"
                rules={[
                  {required: true,message: "Please input your category name!"},
                ]}
              >
                <Input className="custom-input" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input your description!" },
                ]}
              >
                <Input className="custom-input" />
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => nav("/admin/categories")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Update Category
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CategoryEdit;
