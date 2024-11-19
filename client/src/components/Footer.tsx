

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-32 ">
  <div className="container mx-auto px-4 flex flex-wrap justify-around">
    <div className="mb-6">
      <img src="/logo.svg" alt="Furnirio logo" className="w-32 mb-4" />
      <p>400 University Drive Suite 200 Coral</p>
    <p>Gables, FL 33134 USA</p>
    </div>
    
    <div className="mb-6">
      <h5 className="uppercase font-bold mb-2">Sitemap</h5>
      <ul>
        <li><a href="#" className="hover:text-gray-300">Home</a></li>
        <li><a href="#" className="hover:text-gray-300">Shop</a></li>
        <li><a href="#" className="hover:text-gray-300">About</a></li>
        <li><a href="#" className="hover:text-gray-300">Contact</a></li>
      </ul>
    </div>

    <div className="mb-6">
      <h5 className="uppercase font-bold mb-2">Help</h5>
      <ul>
        <li><a href="#" className="hover:text-gray-300">Payment Options</a></li>
        <li><a href="#" className="hover:text-gray-300">Returns</a></li>
        <li><a href="#" className="hover:text-gray-300">Privacy Policies</a></li>
      </ul> 
    </div>

    <div className="">
      <h5 className="uppercase font-bold mb-2">Location</h5>
      <p>support@furnirio.in</p>
      <p>Ahmedabad Main Road</p>
      <p>Udaipur, India - 313002</p>
    </div>
  </div>

  <hr />

  <div className="text-center mt-8">
    <p>Copyright © 2023 Furnirio. All rights reserved.</p>
  </div>
</footer>
  )
}

export default Footer
