import React from 'react';
import { Routes, Route,  } from 'react-router-dom';
import '../src/index.css'
import Navigation from './components/Navigation';
import ProductManager from './pages/ProductManager';
import Dashboard from './pages/Dashboard';
import OrderManager from './pages/OrderManager';
import CouponManager from './pages/CouponManager';
import CustomerManager from './pages/CustomerManager';
import SettingAccount from './pages/SettingAccount';

import ProductDetail from './components/ProductDetaill';
import AddProduct from './components/AddProduct'; 
import OrderDetail from './components/OrderDetail';
import CouponDetail from './components/CouponDetail';


const App = () => {
    
  

    return (
        <>
            <Navigation />
            <div className ='container' style={{ marginLeft: '250px', flex: 1 }}>
                <Routes>
                    <Route path='/' element={<Dashboard/>} />
                    <Route path='/products' element={<ProductManager />} />
                    <Route path='/Add-product' element={<AddProduct />} />
                    <Route path='/product-detail' element={<ProductDetail />} />
                    <Route path='/orders' element={<OrderManager />} />
                    <Route path='/order-detail' element={<OrderDetail />} />
                    <Route path='/coupons' element={<CouponManager />} />
                    <Route path='/coupon-detail' element={<CouponDetail />} />
                    <Route path='/customers' element={<CustomerManager />} />
                    <Route path='/settings' element={<SettingAccount />} />
                </Routes>
            </div>
        </>
    );
};
export default App;