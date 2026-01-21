import React from 'react'
import Header from '../src/components/Header/Header.jsx'
import Footer from '../src/components/footer/Footer.jsx'
import Home from './pages/Home/Home.jsx';
import '../src/index.css'
import { Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog/Catalog.jsx';
import AR from './pages/AR.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import Search from './pages/search.jsx';
import Account from './pages/Account.jsx';
import Like from './pages/Like.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/Catalog/ProductDetail.jsx';

const App = () => {
 
    return(
        <>
        <Header />
            <div className ='container'>
                <Routes>
                    <Route path='/' element ={<Home />}/> 
                    <Route path='/Catalog' element = {<Catalog />} />
                    <Route path='/AR' element = {< AR />} />
                    <Route path='/Blog' element = {<Blog />} />
                    <Route path='/Contact' element = {<Contact />} />
                    <Route path='/Search' element = {<Search />} />
                    <Route path='/Account' element = {<Account />} />
                    <Route path='/Like' element = {<Like />} />
                    <Route path='/Cart' element = {<Cart />} />
                    <Route path='/ProductDetail' element = {<ProductDetail />} />
                     
                </Routes>
            </div>
        <Footer />
        </>
    );
};
export default App