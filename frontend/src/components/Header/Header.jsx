import '../../index.css'
import   '../Header/Header.css'
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg'
import search from '../../assets/search.svg'
import User from '../../assets/account.svg'
import Like from '../../assets/heart.svg'
import Cart from '../../assets/cart.svg'
import Search from '../Search/Search.jsx';
import React,{useState} from 'react'


function Header()  {
   const [menu, setMenu] = useState("home");
   const [isSearchOpen, setIsSearchOpen] = useState(false);
    return(
      <>
        <header className="header">
           <Link to="/"> <img src={logo} alt="Italic" className="logo" /></Link>
            
            <nav>
              <ul>
              <li className={menu === "Home" ? "active-menu" : null}
                onClick={() => setMenu("Home")}>
                <Link to="/">Trang chủ</Link>
              </li>
  
              <li className={menu === "Category" ? "active-menu" : null}
                onClick={() => setMenu("Category")}>
                <Link to="/Category">Danh mục</Link>
              </li>
  
              <li
                className={menu === "Blog" ? "active-menu" : null}
                onClick={() => setMenu("Blog")} >
                <Link to="/Blog">Bài viết</Link>
              </li>
  
              <li className={menu === "Ar" ? "active-menu" : null}
                onClick={() => setMenu("Ar")}>
                <Link to="/AR">Trải nghiệm AR</Link>
              </li>
  
              <li className={menu === "Contact" ? "active-menu" :null}
                onClick={() => setMenu("Contact")} >
                <Link to="/Contact">Liên hệ</Link>
              </li>
            </ul>
          </nav>

            <div className="menu-group">
            <div className='search-icon'> 
              <img className={menu === "search" ? "active-menu" : null}
              onClick={() => {
                setMenu("search");
                setIsSearchOpen(true);
              }} src={search} alt="Search" />
              <Search 
                isOpen={isSearchOpen}
                onClose={() =>setIsSearchOpen(false)}
              />
            </div>
          <Link to = "/Account">
            <img className={menu === "User" ? "active-menu" : null}
              onClick={() => setMenu("User")} src={User} alt="User" /></Link>
          <Link to = "/Like">
            <img className={menu === "Like" ? "active-menu" : null}
              onClick={() => setMenu("Like")} src={Like} alt="Like" />
            </Link>
          <div  className="cart-icon"  >
            <Link to = "/Cart">
            <img className={menu === "Cart" ? "active-menu" : null}
              onClick={() => setMenu("Cart")} src={Cart} alt="Shopping_cart" />
            </Link>
            <p className='sl'>12</p> 
          </div>
          </div>

        </header>  
     </>
    
    )
}
export default Header;