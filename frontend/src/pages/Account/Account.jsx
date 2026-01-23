import React, {useState} from 'react';
import "./Account.css";
import "../../index.css";

import Policy from "../../components/Polycy/Policy.jsx";
import Login from "../../components/Account/Login.jsx";
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
        <Policy/>
        </>
        
    )
}
export default Account;



















