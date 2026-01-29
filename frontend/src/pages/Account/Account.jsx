import React, {useState} from 'react';
import "./Account.css";
import "../../index.css";

import Login from "../../components/Account/LogIn.jsx";
import Register from "../../components/Account/Register.jsx";
const Account = () => {
        const [isLogin, setIsLogin] = useState(true);
    return(
        <>
        <div className= "Account-container">
            {
                isLogin ? <Login onSwitch = {() => setIsLogin(false)}/>
                : <Register onSwitch = {() => setIsLogin(true)}/>
            }
        </div>

        </>
        
    )
}
export default Account;