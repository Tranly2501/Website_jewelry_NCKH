import React from 'react'
import Header from '../src/components/Header/Header.jsx'
import Footer from '../src/components/footer/Footer.jsx'
import Policy from './components/Polycy/Policy.jsx';

import Home from './pages/Home/Home.jsx';
import '../src/index.css'
import { Routes, Route } from 'react-router-dom';
import Category from './pages/Category/Category.jsx';
import AR from './pages/AR.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import Search from './pages/search.jsx';
import Account from './pages/Account/Account.jsx';
import MyAccount from './pages/myAccount/MyAccount.jsx';
import Admin from './pages/Admin/Admin.jsx'
import Like from './pages/Like.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/Category/ProductDetail.jsx';

const App = () => {
 
    return(
        <>
        <Header />
            <div className ='container'>
                <Routes>
                    <Route path='/' element ={<Home />}/> 
                    <Route path='/Category' element = {<Category />} />
                    <Route path='/AR' element = {< AR />} />
                    <Route path='/Blog' element = {<Blog />} />
                    <Route path='/Contact' element = {<Contact />} />
                    <Route path='/Search' element = {<Search />} />
                    <Route path='/Account' element = {<Account />} />
                    <Route path='/MyAccount' element = {<MyAccount />} />
                    <Route path='/Admin' element = {<Admin />} />
                    <Route path='/Like' element = {<Like />} />
                    <Route path='/Cart' element = {<Cart />} />
                    <Route path='/ProductDetail' element = {<ProductDetail />} />
                     
                </Routes>
            </div>
        <Policy/>
        <Footer />
        </>
    );
};
export default App