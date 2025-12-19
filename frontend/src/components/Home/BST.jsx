import React from "react";
import "../../pages/Home/Home.css";
import '../../index.css';
import BstSummer from "../../assets/Home/BST_Summer.jpg";
import MyButton from '../../components/TabButtoon.jsx';

import {useNavigate} from 'react-router-dom';

const BST = () => {
           const navigate = useNavigate();
        const handleClick = (path) =>{
        navigate(path);
        }
    return (

        
            <div className ="Bst-summer"> 
            <img className="summer-img"
            src={BstSummer} alt="Bộ sưu tập cô tiên mùa hè"/>
            <p> BỘ SƯU TẬP CÔ TIÊN MÙA HÈ</p>
            <MyButton onClick = {() => handleClick('/Catalog')}  >Khám phá </MyButton>
        </div>
        
    )

}
export default BST;