import React from 'react'
import '../pages/Home.css'
import ringImage from '../assets/Home/ring.png'
import TryAR from '../assets/Home/tryAR.png'
import Bracelet from '../assets/Home/bracelet.png'
const Home = () => {

    return(
        <>
            <div className='ring'>
                <img src={ringImage} alt="" />
                <p>BỘ SƯU TẬP NHẪN </p>
                <button>Khám phá </button>
            </div>
            <div className='tryAR'>
                <img src={TryAR} alt="" />
                <p>CÔNG NGHỆ THỬ AR</p>
                  <button>Khám phá </button>
            </div>
            <div className='bracelet'>
                <img src={Bracelet} alt="" />
                <p>BỘ SƯU TẬP VÒNG TAY </p>
                  <button>Khám phá </button>
            </div>
        </>
    )
}
export default Home