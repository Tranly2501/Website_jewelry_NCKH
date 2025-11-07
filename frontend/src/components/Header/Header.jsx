import '../../index.css'
import   '../Header/Header.css'
import logo from '../../assets/logo.svg'
import search from '../../assets/search.svg'
import User from '../../assets/account.svg'
import Like from '../../assets/heart.svg'
import Cart from '../../assets/cart.svg'
import Menu from '../../assets/menu.svg'
import {NavLink} from 'react-router-dom';

function NavMenu() {
    return(
        <ul >
         <NavLink to='/'><li>Trang chủ </li></NavLink>
         <NavLink to ='/catalog'>    <li>Danh mục </li></NavLink>
          <NavLink to='/AR'> <li>Trải nghiệm AR</li></NavLink>
         <NavLink to='/blog'>    <li>Bài viết </li></NavLink>
          <NavLink to='/contact' >  <li>Liên hệ </li></NavLink>
        </ul>
    );
}

function IconGroup() {
  return (
    <div className="icon-group">
      <NavLink to ='/search'><img src={search} alt="Search" /></NavLink>
      <NavLink to='/account'><img src={User} alt="User" /></NavLink>
      <NavLink to='/like'><img src={Like} alt="Like" /></NavLink>
     <NavLink to='/cart' className="cart-icon">
      <img src={Cart} alt="Shopping_cart" />
      <p className='sl'>12</p>
      </NavLink>
      {/* <img src={Menu} alt="menu"  className="menu"/> */}
    </div>
  );
}


function Header()  {
    return(
      <>
        <header className="header">
            <img src={logo} alt="Italic" className="logo" />
            <NavMenu />
            <IconGroup />
        </header>  
     </>
    
    )
}
export default Header;