import '../../index.css'
import '../Header/Header.css'
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.svg'
import search from '../../assets/search.svg'
import User from '../../assets/account.svg' 
import Wishlist from '../../assets/heart.svg'
import Cart from '../../assets/cart.svg'
import Search from '../Search/Search.jsx';
import React, { useState, useEffect } from 'react'

function Header() {
    const [menu, setMenu] = useState("home");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const [currentUser, setCurrentUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false); // State bật tắt menu con

    const navigate = useNavigate();

    // 1. Kiểm tra đăng nhập
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    // 2. Hàm đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("accessToken");
        setCurrentUser(null);
        setShowUserMenu(false);
        navigate("/Account"); 
        window.location.reload();
    };

    return (
        <>
            <header className="header">
                <Link to="/"> <img src={logo} alt="Italic" className="logo" /></Link>

                <nav>
                    <ul>
                        <li className={menu === "Home" ? "active-menu" : null} onClick={() => setMenu("Home")}>
                            <Link to="/">Trang chủ</Link>
                        </li>
                        <li className={menu === "Category" ? "active-menu" : null} onClick={() => setMenu("Category")}>
                            <Link to="/Category">Danh mục</Link>
                        </li>
                        <li className={menu === "Blog" ? "active-menu" : null} onClick={() => setMenu("Blog")}>
                            <Link to="/Blog">Bài viết</Link>
                        </li>
                        <li className={menu === "Ar" ? "active-menu" : null} onClick={() => setMenu("Ar")}>
                            <Link to="/AR">Trải nghiệm AR</Link>
                        </li>
                        <li className={menu === "Contact" ? "active-menu" : null} onClick={() => setMenu("Contact")}>
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
                            onClose={() => setIsSearchOpen(false)}
                        />
                    </div>

                    {/* --- PHẦN XỬ LÝ USER  --- */}
                    <div className="user-container" style={{ position: 'relative' }}>
                        
                        {currentUser ? (
                            // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP
                            <div className="logged-in-state" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <img 
                                    src={User} 
                                    alt="User" 
                                    className={menu === "User" ? "active-menu" : null}
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                />


                                {/* Menu Dropdown  */}
                                {showUserMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '40px',
                                        right: '-20px',
                                        background: 'white',
                                        boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        width: '150px',
                                        zIndex: 1000
                                    }}>
                                        <Link to="/MyAccount" style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
                                            Hồ sơ của tôi
                                        </Link>
                                        <div 
                                            onClick={handleLogout} 
                                            style={{ color: 'red', cursor: 'pointer', borderTop: '1px solid #eee', paddingTop: '5px' }}
                                        >
                                            Đăng xuất
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP 
                            <Link to="/Account">
                                <img 
                                    className={menu === "User" ? "active-menu" : null}
                                    onClick={() => setMenu("User")} 
                                    src={User} 
                                    alt="User" 
                                />
                            </Link>
                        )}
                    </div>
                    {/* ------------------------------------------- */}

                    <Link to="/Wishlist">
                        <img className={menu === "Wishlist" ? "active-menu" : null}
                            onClick={() => setMenu("Wishlist")} src={Wishlist} alt="Wishlist" />
                    </Link>
                    <div className="cart-icon"  >
                        <Link to="/Cart">
                            <img className={menu === "Cart" ? "active-menu" : null}
                                onClick={() => setMenu("Cart")} src={Cart} alt="Shopping_cart" />
                        </Link>
                        <p className='sl'></p>
                    </div>
                </div>

            </header>
        </>

    )
}
export default Header;