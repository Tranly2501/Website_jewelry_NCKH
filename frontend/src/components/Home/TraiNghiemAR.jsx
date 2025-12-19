
import "../../pages/Home/Home.css";
import '../../index.css';
import { Link } from "react-router-dom";
import AR from "../../assets/Home/tryAR.png"; 

const TraiNghiemAr = () => {

    return( 
    <>
        <div className = "Ar-container">
            <div className="TraiNghiem">
                <div className = "text-AR">
                    <p>Trải nghiệm chưa từng có !!!</p>
                    <span>
                        Không phải đến trực tiếp cửa hàng vẫn có thể thử nhẫn hay 
                        vòng tay  trực tiếp tại nhà  chỉ với chiếc điện
                        thoại hay laptop có hỗ trợ camera. 
                    </span>
                </div>

            </div>
             <img src={AR} alt="" />
            <button> <Link to ="/AR">Trải nghiệm</Link></button>
        </div>
    </>
    )
}
export default TraiNghiemAr;