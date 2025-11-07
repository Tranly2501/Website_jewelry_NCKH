import React from 'react'
import Header from '../src/components/Header/Header.jsx'
import '../src/index.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import AR from './pages/AR.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import Search from './pages/search.jsx';
import Account from './pages/Account.jsx';
import Like from './pages/Like.jsx';
import Cart from './pages/Cart.jsx';
const App = () => {

    return(
        <div >
            <Header />
            <div className ='container'>
                <Routes>
                    <Route path='/Home' element ={<Home />}/>
                    <Route path='/Catalog' element = {<Catalog />} />
                    <Route path='/AR' element = {< AR />} />
                    <Route path='/Blog' element = {<Blog />} />
                    <Route path='/Contact' element = {<Contact />} />
                    <Route path='/Search' element = {<Search />} />
                    <Route path='/Account' element = {<Account />} />
                    <Route path='/Like' element = {<Like />} />
                    <Route path='/Cart' element = {<Cart />} />
                </Routes>
            </div>
        </div>
    )
}
export default App