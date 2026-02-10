import { Routes, Route, useLocation } from 'react-router-dom';

import Header from '../src/components/Header/Header.jsx'
import Footer from '../src/components/footer/Footer.jsx'
import Policy from './components/Polycy/Policy.jsx';
import Breadcrumb from './components/Breadcrumb';
import Home from './pages/Home/Home.jsx';
import '../src/index.css'
import Category from './pages/Category/Category.jsx';
import AR from './pages/AR/AR.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Blog from './pages/Blog/Blog.jsx';
import Search from './pages/search.jsx';
import Account from './pages/Account/Account.jsx';
import MyAccount from './pages/myAccount/MyAccount.jsx';
import Admin from './pages/Admin/Admin.jsx'
import Wishlist from './pages/Wishlist/Wishlist.jsx';
import Cart from './pages/Cart/Cart.jsx';
import ProductDetail from './pages/Category/ProductDetail.jsx';
import Checkout from './components/Cart/Checkout/Checkout.jsx'; // Thêm dòng này ở nhóm các dòng import
import Confirm from "./components/Cart/Confirm/Confirm.jsx";

const App = () => {
    const location = useLocation(); 
   // danh sách các trang muốn ẩn policy
  const hidePolicyRoutes = ['/Cart', '/Account', '/Admin','/checkout', '/','/confirm'];
  const isHidden = hidePolicyRoutes.includes(location.pathname);

  // danh sách các trang muốn ẩn breadcrumb
  const hideBreadcrumbRoutes = ['/','/Admin','/checkout','/confirm'];
  const isHiddenBreadcrumb = hideBreadcrumbRoutes.includes(location.pathname);
 return (
        <>
        <Header />
            {!isHiddenBreadcrumb && <Breadcrumb />}
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
                    <Route path='/Wishlist' element = {<Wishlist />} />
                    <Route path='/Cart' element = {<Cart />} />
                    <Route path='/ProductDetail' element = {<ProductDetail />} />
                     <Route path="/checkout" element={<Checkout />} />
                     <Route path="/confirm" element={<Confirm />} />
                </Routes>
            </div>
        {!isHidden && <Policy />}
        <Footer />
        </>
    );
};
export default App