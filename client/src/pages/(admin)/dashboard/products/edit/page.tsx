import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import api from "../../../../../API";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Skeleton,
  Space,
  Switch,
  Upload,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { Editor } from "@tinymce/tinymce-react";
import "../Products.page.css";
import chroma from "chroma-js";


const colorMap = {
  Trắng: "#ffffff",
  Đen: "#000000",
  Đỏ: "#ff0000",
  Xanh_lá: "#00ff00",
  Xanh_dương: "#0000ff",
  Vàng: "#ffff00",
  Cam: "#ffa500",
  Tím: "#800080",
  Hồng: "#ffc0cb",
  Nâu: "#a52a2a",
  Xám: "#808080",
  Be: "#f5f5dc",
  Bạc: "#c0c0c0",
  Vàng_nhạt: "#ffffe0",
  Xanh_ngọc: "#00ffff",
  Xanh_rêu: "#556b2f",
  Đỏ_đô: "#800000",
  Xanh_than: "#000080",
  Hồng_phấn: "#ffd1dc",
  Kem: "#fffdd0"
};

const colorSuggestions = Object.entries(colorMap).map(([name, hex]) => ({
  value: hex,
  label: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: hex,
          marginRight: '8px',
          border: '1px solid #d9d9d9',
          borderRadius: '2px'
        }}
      />
      <span>{name.replace(/_/g, ' ')} ({hex})</span>
    </div>
  )
}));

const ProductEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const nav = useNavigate();
  //upload
  const [image_urls, setImage_urls] = useState<string[]>([]);
  const [defaultFileList, setDefaultFileList] = useState([]);
  //d.mục
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  // call
  const { data, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await api.get(`products/${id}`);
      // console.log("get p edit", response);
      return response.data.data;
    },
  });

  //put
  const { mutate, isPending } = useMutation({
    mutationFn: async (product) => {
      return await api.put(`/products/${id}`, product);
    },
    onSuccess: () => {
      nav("/admin/products");
      message.success("Sửa sản phẩm thành công!");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: () => {
      message.error("Failed to edit product");
    },
  });

  // img
  useEffect(() => {
    if (data?.image_urls) {
      setImage_urls(data.image_urls);
      setDefaultFileList(
        data.image_urls.map((url: string, index: number) => ({
          uid: index,
          name: `image_url-${index}`,
          status: "done",
          url: url,
        }))
      );
    }
  }, [data]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    if (data && data.category) {
      // find the correct category from the categories array
      const matchingCategory = categories.find(
        (category) => category._id === data.category._id
      );

      // Set category ID in the form field (if found)
      if (matchingCategory) {
        form.setFieldsValue({
          category: matchingCategory._id,
        });
      }
    }
  }, [categories, data]);

  // img
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const onHandleChange = (info: any) => {
    if (info.file.status === "done") {
      setImage_urls((prev) => [...prev, info.file.response.secure_url]);
    }
  };

  //description
  const handleEditorChange = (content: any) => {
    setDescription(content);
    form.setFieldsValue({ description: content });
  };
   // Helper function to validate color
   const isValidColor = (color: string) => {
    try {
      return chroma.valid(color);
    } catch {
      return false;
    }
  };

  // Helper function to get color name from hex
  const getColorName = (hex: string) => {
    const entry = Object.entries(colorMap).find(([_, value]) => value.toLowerCase() === hex.toLowerCase());
    return entry ? entry[0].replace(/_/g, ' ') : hex;
  };

  // Custom color selection component
  const ColorSelect = ({ value, onChange, ...props }: any) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (selectedValue: string) => {
      onChange(selectedValue);
      setOpen(false);
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <AutoComplete
          {...props}
          value={value}
          open={open}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onChange={(newValue) => {
            onChange(newValue);
            setOpen(true);
          }}
          options={colorSuggestions}
          filterOption={(inputValue, option) => {
            const optionValue = option?.value?.toLowerCase() || '';
            const optionLabel = option?.label?.toString().toLowerCase() || '';
            const searchValue = inputValue.toLowerCase();
            return optionValue.includes(searchValue) || optionLabel.includes(searchValue);
          }}
          style={{ flex: 1, minWidth: '200px' }}
          dropdownRender={(menu) => (
            <div>
              {menu}
              {value && isValidColor(value) && (
                <div style={{ padding: '8px', borderTop: '1px solid #e8e8e8' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '24px', 
                    backgroundColor: value,
                    border: '1px solid #d9d9d9',
                    borderRadius: '2px',
                    marginTop: '4px'
                  }} />
                </div>
              )}
            </div>
          )}
        />
        {value && isValidColor(value) && (
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            background: '#f5f5f5',
            borderRadius: '4px',
            minWidth: '120px'
          }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: value,
              border: '1px solid #d9d9d9',
              borderRadius: '2px'
            }} />
            <span style={{ fontSize: '14px' }}>{getColorName(value)}</span>
          </div>
        )}
      </div>
    );
  };





  // submit
  const onFinish = (values: any) => {
    if (image_urls.length === 0) {
      message.error("Vui lòng tải lên ít nhất một hình ảnh!");
      return;
    }
    const product = {
      ...values,
      image_urls: image_urls,
      description: description || data?.description,
      variants:
        values.variants?.map((variant: any) => ({
          ...variant,
          colors: variant.colors || [],
        })) || [],
    };
    mutate(product);
  };

  if (isLoading) return <Skeleton active />;

  return (
    <div className="product-form-container py-10">
      <div className="container mx-auto px-4">
        <div className="form-card">
          <h1 className="form-title">Update Product</h1>
          <Form
            form={form}
            name="product-form"
            // style={{ maxWidth: 600 }}
            initialValues={{ ...data }}
            layout="vertical"
            onFinish={onFinish}
            className="form-section"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input className="custom-input" />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[
                  { required: true, message: "Please input price!" },
                  {
                    type: "number",
                    min: 1,
                    message: "Price must be greater than 0!",
                  },
                ]}
              >
                <InputNumber
                  className="w-full custom-input"
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  { required: true, message: "Please input quantity!" },
                  {
                    type: "number",
                    min: 1,
                    message: "Quantity must be greater than 0!",
                  },
                ]}
              >
                <InputNumber className="w-full custom-input" />
              </Form.Item>

              <Form.Item label="SKU" name="sku">
                <Input className="custom-input" placeholder="Enter SKU" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select>
                  {categories.map((category: any) => (
                    <Option key={category._id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Tags" name="tags">
                <Select
                  mode="tags"
                  className="custom-input"
                  placeholder="Add tags"
                />
              </Form.Item>
              <Form.Item
                label="Product Images"
                required
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="upload-section"
              >
                <Upload
                  key={defaultFileList.length}
                  multiple={true}
                  action="https://api.cloudinary.com/v1_1/djmnbbsyd/image/upload"
                  listType="picture-card"
                  data={{
                    upload_preset: "img_workshop",
                  }}
                  onChange={onHandleChange}
                  defaultFileList={defaultFileList}
                  className="upload-area"
                >
                  <div className="upload-button">
                    <PlusOutlined />
                    <div className="mt-2">Upload</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item
                label="Status"
                name="status"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </div>

            <Form.List name="variants">
              {(fields, { add, remove }) => (
                <div className="variants-section">
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="variant-card">
                      <Form.Item
                        {...restField}
                        name={[name, "size"]}
                        label="Size"
                        rules={[
                          { required: true, message: "Size is required" },
                        ]}
                      >
                        <Input
                          className="custom-input"
                          placeholder="Size (e.g., S, M, L)"
                        />
                      </Form.Item>

                      <Form.List name={[name, "colors"]}>
                        {(
                          colorFields,
                          { add: addColor, remove: removeColor }
                        ) => (
                          <div className="colors-section">
                            {colorFields.map(
                              ({
                                key: colorKey,
                                name: colorName,
                                ...colorRestField
                              }) => (
                                <div key={colorKey} className="color-row">
                                  <Form.Item
                                    {...colorRestField}
                                    name={[colorName, "color"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Color is required",
                                      },
                                      {
                                        validator: async (_, value) => {
                                          if (!value || isValidColor(value)) {
                                            return Promise.resolve();
                                          }
                                          return Promise.reject(new Error("Mã màu không hợp lệ"));
                                        },
                                      },
                                    ]}
                                  >
                                    <ColorSelect
                                      className="custom-input"
                                      placeholder="Nhập tên màu hoặc mã màu (ví dụ: #FF5733)"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...colorRestField}
                                    name={[colorName, "quantity"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Quantity is required",
                                      },
                                    ]}
                                  >
                                    <InputNumber
                                      className="custom-input"
                                      min={0}
                                      placeholder="Qty"
                                    />
                                  </Form.Item>
                                  <MinusCircleOutlined
                                    className="remove-button"
                                    onClick={() => removeColor(colorName)}
                                  />
                                </div>
                              )
                            )}
                            <button
                              type="button"
                              onClick={() => addColor()}
                              className="add-button mt-2"
                            >
                              <PlusOutlined className="mr-2" /> Add Color
                            </button>
                          </div>
                        )}
                      </Form.List>

                      <button
                        type="button"
                        onClick={() => remove(name)}
                        className="remove-button mt-4"
                      >
                        Remove Variant
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => add()}
                    className="add-button mt-4"
                  >
                    <PlusOutlined className="mr-2" /> Add Size Variant
                  </button>
                </div>
              )}
            </Form.List>
            <Form.Item
              label="Description"
              name="description"
              className="mt-6"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <Editor
                apiKey="m3o33nrpj98lm1ueo3zwefgum674bex794nb3rzs8c04amvk"
                init={{
                  plugins: [
                    "anchor",
                    "autolink",
                    "charmap",
                    "codesample",
                    "emoticons",
                    "image",
                    "link",
                    "lists",
                    "media",
                    "searchreplace",
                    "table",
                    "visualblocks",
                    "wordcount",
                    "checklist",
                    "mediaembed",
                    "casechange",
                    "export",
                    "formatpainter",
                    "pageembed",
                    "a11ychecker",
                    "tinymcespellchecker",
                    "permanentpen",
                    "powerpaste",
                    "advtable",
                    "advcode",
                    "editimage",
                    "advtemplate",
                    "ai",
                    "mentions",
                    "tinycomments",
                    "tableofcontents",
                    "footnotes",
                    "mergetags",
                    "autocorrect",
                    "typography",
                    "inlinecss",
                    "markdown",
                    "importword",
                    "exportword",
                    "exportpdf",
                  ],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  height: 360,
                  mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                  ],
                  ai_request: (request, respondWith) =>
                    respondWith.string(() =>
                      Promise.reject("See docs to implement AI Assistant")
                    ),
                  exportpdf_converter_options: {
                    format: "Letter",
                    margin_top: "1in",
                    margin_right: "1in",
                    margin_bottom: "1in",
                    margin_left: "1in",
                  },
                  exportword_converter_options: {
                    document: { size: "Letter" },
                  },
                  importword_converter_options: {
                    formatting: {
                      styles: "inline",
                      resets: "inline",
                      defaults: "inline",
                    },
                  },
                }}
                // initialValue="Welcome to TinyMCE!"
                onEditorChange={handleEditorChange}
              />
            </Form.Item>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => nav("/admin/products")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Update Product
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
