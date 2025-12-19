import "../../pages/Home/Home.css";
import '../../index.css';
import React from "react";
import ringImage from "../../assets/Home/ring.png";
import TryAR from "../../assets/Home/tryAR.png";
import Bracelet from "../../assets/Home/bracelet.png";
import MyButton from '../../components/TabButtoon.jsx';
import {useNavigate} from 'react-router-dom';
const Feature = () => {
    const navigate = useNavigate();
    const handleClick = (path) =>{
        navigate(path);
    }
    return (
           <div className='feature-grid'>
                <div className='feature-item bracelet '>
                    <img src={Bracelet} alt="" />
                    <div className='feature-text bracelet-text'>
                        <p>BỘ SƯU TẬP VÒNG TAY </p>
                        <MyButton onClick = {() => handleClick('/Catalog')}  >Khám phá </MyButton>
                    </div>
                </div>

                <div className='feature-item ar '>
                    <img src={TryAR} alt="" />
                    <div className='feature-text ar '>
                        <p>CÔNG NGHỆ THỬ AR</p>
                        <MyButton onClick = {() => handleClick('/Catalog')}  >Khám phá </MyButton>
                    </div>
                </div>
                <div className='feature-item ring'>
                    <img src={ringImage} alt="" />
                    <div className='feature-text ring'>
                        <p>BỘ SƯU TẬP NHẪN </p>
                        <MyButton onClick = {() => handleClick('/Catalog')} >Khám phá </MyButton>
                    </div>
                </div>
           </div>
    )
} 
export default Feature;