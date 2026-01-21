
import Breadcrumb from '../components/Breadcrumb.jsx';
import './Account.css';
const Account = () => {
    return(
         <>
           <Breadcrumb />
        <div className='main'>
            <div className='nhapcauhoi'>
                <div className='phandangnhap'>
                    <h2>Đăng nhập</h2>
                </div>
                
                    <div className='tendangnhap'>
                        <p>Tên đăng nhập hoặc địa chỉ email</p>
                    </div>
                    <div>
                    <input type="text"/>
                    </div>
                    <div className='matkhau'>
                        <p>Mật khẩu</p>
                    </div>
                    <div>
                        <input type="password" />
                    </div>
                    {/* <div>
                        <p id='khongdung'>*Mật khẩu không đúng. Xin vui lòng nhập lại !</p>
                    </div> */}
                    <div className='nhomatkhau'>
                        <input type="checkbox" id='nuttich'/> <p>Nhớ mật khẩu</p>
                        <p id='quenmatkhau'>Quên mật khẩu.</p>
                    </div>
                    <p id='chuataikhoan'>Bạn chưa có tài khoản.</p>
                    <p id='dangkingay'>Đăng kí ngay!</p>
                    <div id='nut'>
                        <button>Đăng nhập</button>
                    </div>
            </div>
        </div>
    </>
    )
}
export default Account