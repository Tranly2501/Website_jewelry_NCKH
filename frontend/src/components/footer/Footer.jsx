import '../../index.css'
import '../footer/Footer.css'
import local from '../../assets/location.svg' 
import phone from '../../assets/phone.svg'
import time from '../../assets/time.svg'
import email from '../../assets/email.svg'
import facebook from '../../assets/facebook.svg'
import instagram from '../../assets/intagram.svg'
import twitter from '../../assets/twitter.svg'
import {NavLink} from 'react-router-dom';

const Footer = () => {

    return(

        <footer>
        <div className="footer-container">
                <div className="footer-column">
                    <h3 className="title">LIÊN KẾT NHANH</h3>
                    <ul className="list">
                        <NavLink to='/'><li>Trang chủ </li></NavLink>
                        <NavLink to ='/catalog'>    <li>Danh mục </li></NavLink>
                        <NavLink to='/contact' >  <li>Liên hệ </li></NavLink>
                         <NavLink to='/AR'> <li>Trải nghiệm AR</li></NavLink>
                        <NavLink to='/like'><li>Sản phẩm yêu thích </li></NavLink>
                        <NavLink  to='/cart'><li> Giỏ hàng </li></NavLink>
                    </ul>
                </div>
                <div className="footer-column"> 
                   <h3 className="title">DỊCH VỤ KHÁCH HÀNG </h3>
                    <ul className="list">
                        <li>Hướng dẫn chọn size</li>
                        <li>Hướng dẫn bảo quản</li>
                        <li>Chăm sóc khách hàng</li>
                        <li>Trả hàng và đổi hàng </li>
                        <li>Bảo hành</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3 className="title">THÔNG TIN LIÊN LẠC</h3>
                   <address className='contact-info'>
                            <div>
                                <img src={local} alt="123 Trần Phú, Hà Đông, Hà Nội" />
                                123 Trần Phú, Hà Đông, Hà Nội
                            </div>
                            <div>
                                <img src={phone} alt="" />
                                (+84) 03568992542
                            </div>
                            <div>
                                <img src={time} alt="" />
                                 Thứ 2 - thứ 7: 8.30 - 18.30
                            </div>
                            <div>
                                <img src={email} alt="" />
                                info@Jewelry.com
                            </div>
                   </address>
                         <div className='contact-social'>
                                <img src={facebook} alt="Facebook" />
                                <img src={instagram} alt="Instagram" />
                                <img src={twitter} alt="twitter" />
                         </div>
                        
                </div>
        </div>
        <p className='footer-bottom'> © 2025 Jewelry</p>
         </footer>
    )
}
export default Footer