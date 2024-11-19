import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../API';
import { Skeleton } from 'antd';


const ProductList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get(`/products`);
      return response.data;
    },
  });

  if (isLoading) return <Skeleton active/>;
  if (isError || !data?.data?.length) return <p>No products available.</p>;

  return (
    <section className="max-w-6xl mx-auto py-12">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-semibold text-gray-800">New Products</h2>
        <button className="mt-4 border-2 border-orange-500 text-orange-500 bg-white py-2 px-10 rounded hover:bg-orange-500 hover:text-white transition duration-300">View All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {data.data.map((product: any) => (
          <div key={product._id} className="bg-[#f7f7f7] shadow-md rounded-sm overflow-hidden">
            <Link to={`/products/${product._id}`}>
              <img
                src={product.image_urls?.[0] || "default-image-url.jpg"}
                alt={product.name || "Product image"}
                className="w-full h-72 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link to={`/products/${product._id}`} className="text-xl font-bold text-gray-800">{product.name}</Link>
              <p className="text-gray-600 mb-2 ">Stylish cafe chair</p>
              <div className="text-red-500 text-lg font-semibold">2,500,000 VND</div>
              <button className="rounded-sm mt-4 border-2 border-[#CA8A04] text-[#CA8A04] bg-white py-2 px-4 hover:bg-[#CA8A04] hover:text-white transition duration-300 w-full font-semibold">Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
