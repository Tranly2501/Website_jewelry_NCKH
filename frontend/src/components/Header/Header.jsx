import '../../index.css'
import   '../Header/Header.css'
import logo from '../../assets/logo.svg'
import search from '../../assets/search.svg'
import User from '../../assets/account.svg'
import Like from '../../assets/heart.svg'
import Cart from '../../assets/cart.svg'
import {Link} from 'react-router-dom';

function NavMenu() {
    return(
        <ul >
         <Link to='/'><li>Trang chủ </li></Link>
         <Link to ='/catalog'>    <li>Danh mục </li></Link>
            <Link to='/AR'> <li>Trải nghiệm AR</li></Link>
         <Link to='/blog'>    <li>Bài viết </li></Link>
          <Link to='/contact' >  <li>Liên hệ </li></Link>
        </ul>
    );
}

function IconGroup() {
  return (
    <div className="icon-group">
      <Link to ='/search'><img src={search} alt="Search" /></Link>
      <Link to='/account'><img src={User} alt="User" /></Link>
      <Link to='/like'><img src={Like} alt="Like" /></Link>
     <Link to='/cart'> <img src={Cart} alt="Shopping_cart" /></Link>
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