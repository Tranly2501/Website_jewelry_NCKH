import "../../pages/Home/Home.css";
import '../../index.css';

const Notification = () => {

    return( 
    <>
   <div className="notification-container">
           <div className="notification-left"> <p>ĐĂNG KÍ ĐỂ NHẬN NHỮNG THÔNG BÁO SỚM NHẤT</p></div>

            <div className="notification-right">  
            <input type="email" id="email" name="email" placeholder="Nhập email của bạn"/> 
            <button>Đăng kí</button>
            </div>
        </div>
    </>
    )
}
export default  Notification;