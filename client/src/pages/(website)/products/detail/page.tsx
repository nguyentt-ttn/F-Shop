import React, { useEffect, useState } from "react";
import api from "../../../../API";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../../../../interfaces/product";
import { Card, Skeleton, Space } from "antd";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["products", id],
    queryFn: async () => {
      try {
        const res = await api.get<{ data: Product }>(`products/${id}`);
        console.log("Product data:", res.data);
        return res.data.data;
      } catch (error) {
        console.error("Error fetching product details:", error);
        throw new Error("Unable to fetch product details");
      }
    },
    enabled: !!id,
  });
  if (isLoading) {
    return <Skeleton active />;
  }
  if (error) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu sản phẩm</div>;
  }
  if (!data) {
    return <div>Không tìm thấy sản phẩm</div>;
  }
  const handleSizeClick = (size) => {
    setSelectedSize(size);
    setSelectedColor(null); // Reset màu sắc khi chọn size mới
  };
  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const selectedVariant = data.variants?.find(
    (variant) => variant.size === selectedSize
  );
  return (
    <div>
      <h1>{data.name}</h1>
      <p>
        Giá: {data.price ? `${data.price} VND` : "Không có thông tin về giá"}
      </p>
      <p>
        Mô tả: <span dangerouslySetInnerHTML={{ __html: data.description }} />
      </p>
      <p>Loại: {data.category?.name || "Không có thông tin về loại"}</p>
      <p>Số lượng: {data.quantity}</p>
      <p>Trạng thái: {data.status ? "Còn hàng" : "Hết hàng"}</p>
      <div className="items-center mb-4">
        <span className="font-bold">Size</span>
        <div className="flex space-x-2">
          {data.variants?.map((variant) => (
            <button
              key={variant._id}
              onClick={() => handleSizeClick(variant.size)}
              className={`px-4 py-2 border rounded ${
                selectedSize === variant.size ? "bg-gray-300" : ""
              }`}
            >
              {variant.size}{" "}
            </button>
          ))}
        </div>
      </div>
      {selectedVariant && (
        <div className="items-center mb-4">
          <span className="font-bold">Color</span>
          <div className="flex space-x-2">
            {selectedVariant.colors?.map((color) => (
              <button
                key={color._id}
                onClick={() => handleColorClick(color.color)}
                className={`w-8 h-8 rounded-full border border-gray-300 ${
                  selectedColor === color.color ? "ring-2 ring-gray-500" : ""
                }`}
                style={{ backgroundColor: color.color }}
                title={color.color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
    // <div>
    //   <main className="max-w-6xl mx-auto py-4">
    //     <div>
    //       <div className="flex space-x-6 ">
    //         <div className="flex flex-row ">
    //           <div className="flex flex-col space-y-3 mr-2 ml pt-5 pl-3">
    //             <img
    //               alt="Product thumbnail 1"
    //               className="w-20 h-20 object-cover"
    //               height="80"
    //               src=""
    //               width="80"
    //             />
    //             <img
    //               alt="Product thumbnail 1"
    //               className="w-20 h-20 object-cover"
    //               height="80"
    //               src=""
    //               width="80"
    //             />
    //             <img
    //               alt="Product thumbnail 1"
    //               className="w-20 h-20 object-cover"
    //               height="80"
    //               src=""
    //               width="80"
    //             />
    //             <img
    //               alt="Product thumbnail 1"
    //               className="w-20 h-20 object-cover"
    //               height="80"
    //               src=""
    //               width="80"
    //             />
    //             <img
    //               alt="Product thumbnail 1"
    //               className="w-20 h-20 object-cover"
    //               height="80"
    //               src=""
    //               width="80"
    //             />
    //           </div>

    //           <img
    //             alt="Main product image"
    //             className="w-[31rem] h-[31rem] object-cover"
    //             src=""
    //           />
    //         </div>
    //         <div className="flex-1">
    //           <h1 className="text-3xl font-bold">{data?.name}</h1>
    //           <p className="text-xl text-red-600 mt-2 font-bold">
    //             Giá:{" "}
    //             {data.price ? `${data.price} VND` : "Không có thông tin về giá"}
    //           </p>
    //           <div className="flex items-center space-x-2 my-4">
    //             <div className="flex items-center">
    //               <i className="fas fa-star text-yellow-500"></i>
    //               <i className="fas fa-star text-yellow-500"></i>
    //               <i className="fas fa-star text-yellow-500"></i>
    //               <i className="fas fa-star text-yellow-500"></i>
    //               <i className="fas fa-star text-yellow-500"></i>
    //             </div>
    //             <span className="text-gray-600 mt-1">
    //               | ( {data.reviews}Customer Review)
    //             </span>
    //           </div>
    //           <p className="text-gray-600 mb-4">
    //             Setting the bar as one of the loudest speakers in its className,
    //             the Kilburn is a compact, stout-hearted hero with a
    //             well-balanced audio which boasts a clear midrange and extended
    //             highs for a sound.
    //           </p>
    //           <div className="items-center mb-4">
    //             <span className="font-bold">Size</span>
    //             <div className="flex space-x-2">
    //               {data.variants?.map((variant) => (
    //                 <button
    //                   key={variant._id}
    //                   onClick={() => handleSizeClick(variant.size)}
    //                   className={`px-4 py-2 border rounded ${
    //                     selectedSize === variant.size ? "bg-gray-300" : ""
    //                   }`}
    //                 >
    //                   {variant.size}
    //                 </button>
    //               ))}
    //             </div>
    //           </div>
    //           <div className="items-center mb-4">
    //             <span className="font-bold">Color</span>
    //             <div className="flex space-x-2">
    //               {selectedVariant?.colors?.map((color) => (
    //                 <button
    //                   key={color._id}
    //                   className="w-8 h-8 rounded-full"
    //                   style={{ backgroundColor: color.color }}
    //                   title={color.color}
    //                 >
    //                   {color.color} {color.quantity}
    //                 </button>
    //               )) || <p>Vui lòng chọn size để xem màu sắc</p>}
    //             </div>
    //           </div>
    //           {/* <div className="items-center mb-4">
    //             <span className="font-bold">Size</span>
    //             <div className="flex space-x-2">
    //               {data.variants?.map((variant) => (
    //                 <button
    //                   key={variant._id}
    //                   className="px-4 py-2 border rounded"
    //                 >
    //                   {variant.size}
    //                 </button>
    //               ))}
    //             </div>
    //           </div>
    //           <div className="items-center mb-4">
    //             <span className="font-bold">Color</span>
    //             <div className="flex space-x-2">
    //               {data.variants?.[0]?.colors?.map((color) => (
    //                 <button
    //                   key={color._id}
    //                   className="w-8 h-8 rounded-full"
    //                   style={{ backgroundColor: color.color }}
    //                   title={color.color} // thêm title để kiểm tra giá trị màu
    //                 >
    //                   {color.color} {color.quantity}
    //                 </button>
    //               ))}
    //             </div>
    //           </div> */}
    //           {/* <div className=" items-center mb-4">
    //               <span className="font-bold">Size</span>
    //               <div className="flex space-x-2">
    //                 <button className="px-4 py-2 border rounded">L</button>
    //                 <button className="px-4 py-2 border rounded">XL</button>
    //                 <button className="px-4 py-2 border rounded">XS</button>
    //               </div>
    //             </div>
    //             <div className=" items-center  mb-4">
    //               <span className="font-bold">Color</span>
    //               <div className="flex space-x-2">
    //                 <button className="w-8 h-8 bg-black rounded-full"></button>
    //                 <button className="w-8 h-8 bg-purple-600 rounded-full"></button>
    //                 <button className="w-8 h-8 bg-yellow-600 rounded-full"></button>
    //               </div>
    //             </div> */}
    //           <div className="flex items-center space-x-4 mb-4">
    //             <div className="flex items-center space-x-4 border border-gray-300 rounded">
    //               <button className="px-4 py-2  rounded">-</button>
    //               <span>1</span>
    //               <button className="px-4 py-2 rounded">+</button>
    //             </div>
    //             <a href="./category.html">
    //               <button className="px-7 py-2 bg-yellow-500 text-white rounded">
    //                 Add To Cart
    //               </button>
    //             </a>
    //             <button className="px-9 py-2 border rounded">Compare</button>
    //           </div>
    //           {/* <div><hr></div> */}
    //           <div className="text-gray-600 ">
    //             <p className="mb-1 mt-3">SKU:{data.sku} </p>
    //             <p className="mt-1">
    //               Category:{" "}
    //               {data.category
    //                 ? data.category.name
    //                 : "Không có thông tin về loại"}
    //             </p>
    //             <p className="mt-1">Tags: {data.tags}</p>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="mt-12">
    //         <div className="flex space-x-6 border-b">
    //           <button className="pb-2 border-b-2 border-black">
    //             Description
    //           </button>
    //           <button className="pb-2">Additional Information</button>
    //           <button className="pb-2">Reviews [{data.reviews}]</button>
    //         </div>
    //         <div className="mt-6">
    //           <p className="text-gray-600 mb-4">
    //             số lượng{data.quantity}
    //             mô tả:{data.description}
    //           </p>
    //           <p className="text-gray-600 mb-4">
    //             Weighing in under 7 pounds, the Kilburn is a lightweight piece
    //             of vintage styled engineering. Setting the bar as one of the
    //             loudest speakers in its className, the Kilburn is a compact,
    //             stout-hearted hero with a well-balanced audio which boasts a
    //             clear midrange and extended highs for a sound that is both
    //             articulate and pronounced. The analogue knobs allow you to fine
    //             tune the controls to your personal preferences while the
    //             guitar-influenced leather strap enables easy and stylish travel.
    //           </p>
    //           <div className="flex space-x-4">
    //             <img
    //               alt="Product detail image 1"
    //               className="w-1/2 h-64 object-cover"
    //               height="300"
    //               src="https://storage.googleapis.com/a1aa/image/j7DcMYNQlRKfAaiVhWbrelUSHOs8FJ3kowmYsziLOt3XJwjTA.jpg"
    //               width="400"
    //             />
    //             <img
    //               alt="Product detail image 2"
    //               className="w-1/2 h-64 object-cover"
    //               height="300"
    //               src="https://storage.googleapis.com/a1aa/image/YXesfJVFnzgJTU5pnA2gJqf5UACe8sQIeupEwIp1hU0XLBe4E.jpg"
    //               width="400"
    //             />
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="mt-12 mb-6">
    //       <h2 className="text-2xl text-center font-bold mb-6">
    //         Related Products
    //       </h2>
    //       <div className="grid grid-cols-4 gap-6">
    //         <div className="border p-4">
    //           <img
    //             alt="Related product 1"
    //             className="w-full h-64 object-cover mb-4"
    //             height="200"
    //             src="https://storage.googleapis.com/a1aa/image/6GLQoeyVphVuMqYwiqxa0NfNCbT3LswHDshMkfRM5ElnSgHnA.jpg"
    //             width="200"
    //           />
    //           <h3 className="text-lg font-bold">Syltherine</h3>
    //           <p className="text-gray-600 mb-2">Stylish cafe chair</p>
    //           <p className="text-red-600 font-bold mb-4">2.500.000đ</p>
    //           <button className="px-4 py-2 bg-yellow-500 text-white rounded">
    //             Add to cart
    //           </button>
    //         </div>
    //         <div className="border p-4">
    //           <img
    //             alt="Related product 2"
    //             className="w-full h-64 object-cover mb-4"
    //             height="200"
    //             src="https://storage.googleapis.com/a1aa/image/k5mvt7mL7rrBJFQvfzjczUfq5aXwJouQ0TZjmanWE6ocJwjTA.jpg"
    //             width="200"
    //           />
    //           <h3 className="text-lg font-bold">Leviosa</h3>
    //           <p className="text-gray-600 mb-2">Stylish cafe chair</p>
    //           <p className="text-red-600 font-bold mb-4">1.800.000đ</p>
    //           <button className="px-4 py-2 bg-yellow-500 text-white rounded">
    //             Add to cart
    //           </button>
    //         </div>
    //         <div className="border p-4">
    //           <img
    //             alt="Related product 3"
    //             className="w-full h-64 object-cover mb-4"
    //             height="200"
    //             src="https://storage.googleapis.com/a1aa/image/sF1Bu8u3mIq8B1yTPNiuZReuHDFvW5DIMhpMZIxXlncsE4xJA.jpg"
    //             width="200"
    //           />
    //           <h3 className="text-lg font-bold">Lolito</h3>
    //           <p className="text-gray-600 mb-2">Luxury big sofa</p>
    //           <p className="text-red-600 font-bold mb-4">2.000.000đ</p>
    //           <button className="px-4 py-2 bg-yellow-500 text-white rounded">
    //             Add to cart
    //           </button>
    //         </div>
    //         <div className="border p-4">
    //           <img
    //             alt="Related product 4"
    //             className="w-full h-64 object-cover mb-4"
    //             height="200"
    //             src="https://storage.googleapis.com/a1aa/image/QJ4YJ0CeBtQnBqqngylPgwibaSdyfBQ0ejg7IdRUUsE8SgHnA.jpg"
    //             width="200"
    //           />
    //           <h3 className="text-lg font-bold">Respira</h3>
    //           <p className="text-gray-600 mb-2">Outdoor bar table and stool</p>
    //           <p className="text-red-600 font-bold mb-4">4.500.000đ</p>
    //           <a href="./category.html">
    //             <button className="px-4 py-2 bg-yellow-500 text-white rounded">
    //               Add to cart
    //             </button>
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
};

export default ProductDetail;
