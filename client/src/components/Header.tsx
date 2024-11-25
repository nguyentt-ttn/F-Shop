import { Link } from "react-router-dom";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineShoppingCart,
} from "react-icons/ai";


const Header = () => {
  const userId = localStorage.getItem("userId");
  return (
    <header>
      <div className="max-w-6xl mx-auto p-2">
        <div className="grid grid-cols-3 gap-8 items-center">
          <div>
            <img src="/logo.svg" alt="NhShop" />
          </div>
          <nav>
            <ul className="flex justify-center space-x-5 ">
              <li>
                <Link to="/" className="hover:text-red-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-red-500">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500">
                  Contact
                </Link>
              </li>
              
            </ul>
          </nav>
          <div className="flex justify-end space-x-4">
              <Link to="/sign-in">
                <AiOutlineUser />
              </Link>
            <Link to="/search">
              <AiOutlineSearch />
            </Link>
            <Link to="/wishlist">
              <AiOutlineHeart />
            </Link>
            <Link to={`/cart/${userId}`}>
              <AiOutlineShoppingCart />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
