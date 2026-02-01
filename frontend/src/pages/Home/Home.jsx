// import React from 'react'
import "../../pages/Home/Home.css";
import '../../index.css';

import Feature from "../../components/Home/Feature.jsx";
import Product from "../../components/Home/Product.jsx";

import Feedback from "../../components/Home/Feedback.jsx";
import Policy from "../../components/Polycy/Policy.jsx";
import TraiNghiemAR from "../../components/Home/TraiNghiemAR.jsx";
import BST from "../../components/Home/BST.jsx";
import Notification from "../../components/Home/Notification.jsx";
const Home = () => {
    return( 
        <>
        <Feature />
        <Policy />
        <Product />
        
        <TraiNghiemAR />
        <BST />
        <Feedback />
        <Notification />
        </>
    )
}
export default Home